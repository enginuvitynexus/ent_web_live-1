# Phase 1 — Set Up GCP Organization Project (Detailed)

> Every single command you need, in exact order.  
> Replace the placeholders below with your actual values before running.

---

## Your Placeholders — Fill These In First

Open a notepad and fill these in. You'll copy-paste them throughout this guide.

```
ORG_PROJECT_ID    = _______________   (e.g., ent-web-org-prod)
ORG_ID            = _______________   (your GCP Organization ID — numeric)
BILLING_ACCOUNT   = _______________   (e.g., 01A2B3-C4D5E6-F7G8H9)
REGION            = asia-south1        (Mumbai, India — South Asia)
DB_PASSWORD       = _______________   (create a strong password, 16+ chars)
SMTP_PASSWORD     = _______________   (your Zoho SMTP password)
```

---

## Step 1.1 — Find Your Organization ID

You just created an organization account. Let's confirm it exists and grab the ID.

```bash
gcloud organizations list
```

**Expected output:**
```
DISPLAY_NAME                ID             DIRECTORY_CUSTOMER_ID
Enginuvity Nexus Tech       123456789012   C04abcdef
```

Copy the `ID` — that's your `ORG_ID`.

> [!TIP]  
> If `gcloud organizations list` returns empty, your org may not be fully propagated yet.  
> Go to [console.cloud.google.com/cloud-resource-manager](https://console.cloud.google.com/cloud-resource-manager) and check if your organization appears at the top of the hierarchy.

---

## Step 1.2 — Create a Folder Structure (Optional but Recommended)

Organizations work best with folders. This keeps things organized as you grow.

```
📂 Enginuvity Nexus (Organization)
 └── 📂 Production
      └── 📄 ent-web-org-prod (Project)
```

```bash
# Create a "Production" folder under your org
gcloud resource-manager folders create \
  --display-name="Production" \
  --organization=ORG_ID
```

**Expected output:**
```
Created Folder [folders/1234567890].
```

Save that folder ID. If you skip this step, you'll create the project directly under the org (also fine).

---

## Step 1.3 — Create the New Project

### Option A: Under a folder (if you did Step 1.2)
```bash
gcloud projects create ORG_PROJECT_ID \
  --name="ENT Web Production" \
  --folder=FOLDER_ID
```

### Option B: Directly under the organization
```bash
gcloud projects create ORG_PROJECT_ID \
  --name="ENT Web Production" \
  --organization=ORG_ID
```

**Verify:**
```bash
gcloud projects describe ORG_PROJECT_ID
```

**Expected output:**
```
createTime: '2026-07-10T...'
lifecycleState: ACTIVE
name: ENT Web Production
parent:
  id: '123456789012'
  type: organization        # ← This confirms it's under the org
projectId: ent-web-org-prod
projectNumber: '987654321012'
```

> [!IMPORTANT]  
> Make sure `parent.type` says `organization` (or `folder`), **not** empty. If it's empty, the project was created as standalone and not under your org.

---

## Step 1.4 — Set the Project as Active

Every command from now on targets this project.

```bash
gcloud config set project ORG_PROJECT_ID
```

**Verify:**
```bash
gcloud config get project
# Should output: ent-web-org-prod (or whatever you named it)
```

---

## Step 1.5 — Link a Billing Account

Projects can't use paid services without billing.

### Find your billing account ID:
```bash
gcloud billing accounts list
```

**Expected output:**
```
ACCOUNT_ID            NAME                OPEN   MASTER_ACCOUNT_ID
01A2B3-C4D5E6-F7G8H9  My Billing Account  True
```

### Link it to your project:
```bash
gcloud billing projects link ORG_PROJECT_ID \
  --billing-account=BILLING_ACCOUNT
```

**Verify:**
```bash
gcloud billing projects describe ORG_PROJECT_ID
```

Should show `billingEnabled: true`.

> [!WARNING]  
> If you're using the organization's billing account (not your personal one), make sure you have `billing.resourceAssociations.create` permission on that billing account. Ask your org admin if you get a permission error.

---

## Step 1.6 — Enable All Required APIs

These APIs need to be enabled before you can create any resources.

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  compute.googleapis.com \
  iam.googleapis.com \
  cloudresourcemanager.googleapis.com
```

**Verify all are enabled:**
```bash
gcloud services list --enabled --filter="NAME:(run OR artifactregistry OR sqladmin OR secretmanager OR cloudbuild OR compute)" --format="table(NAME,TITLE)"
```

**Expected output:**
```
NAME                                TITLE
artifactregistry.googleapis.com     Artifact Registry API
cloudbuild.googleapis.com           Cloud Build API
compute.googleapis.com              Compute Engine API
run.googleapis.com                  Cloud Run Admin API
secretmanager.googleapis.com        Secret Manager API
sqladmin.googleapis.com             Cloud SQL Admin API
```

> [!NOTE]  
> API enablement takes 30–60 seconds. If later commands fail with "API not enabled", wait a minute and retry.

---

## Step 1.7 — Create Artifact Registry Repository

This is where Docker images get stored when the pipeline pushes them.

```bash
gcloud artifacts repositories create ent-web-images \
  --repository-format=docker \
  --location=asia-south1 \
  --description="ENT Web Docker images (Organization)"
```

**Verify:**
```bash
gcloud artifacts repositories describe ent-web-images \
  --location=asia-south1 \
  --format="table(name,format,sizeBytes)"
```

**Verify you can authenticate Docker to it:**
```bash
gcloud auth configure-docker asia-south1-docker.pkg.dev --quiet
```

---

## Step 1.8 — Create the Service Account for GitHub Actions

This service account is what GitHub Actions uses to authenticate with GCP, push images, deploy to Cloud Run, and read secrets.

### 1.8a — Create the account

```bash
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions CI/CD Deployer" \
  --description="Used by GitHub Actions to build and deploy ENT Web"
```

**Verify:**
```bash
gcloud iam service-accounts list --format="table(email,displayName)"
```

Should show:
```
EMAIL                                                    DISPLAY_NAME
github-deployer@ORG_PROJECT_ID.iam.gserviceaccount.com   GitHub Actions CI/CD Deployer
```

### 1.8b — Grant IAM Roles (5 roles)

```bash
SA_EMAIL="github-deployer@ORG_PROJECT_ID.iam.gserviceaccount.com"
```

Run each of these:

```bash
# Role 1: Cloud Run Admin — deploy and manage Cloud Run services
gcloud projects add-iam-policy-binding ORG_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin" \
  --condition=None

# Role 2: Artifact Registry Writer — push Docker images
gcloud projects add-iam-policy-binding ORG_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/artifactregistry.writer" \
  --condition=None

# Role 3: Service Account User — needed for Cloud Run to act as this SA
gcloud projects add-iam-policy-binding ORG_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser" \
  --condition=None

# Role 4: Secret Manager Secret Accessor — read secrets at runtime
gcloud projects add-iam-policy-binding ORG_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor" \
  --condition=None

# Role 5: Cloud SQL Client — connect to Cloud SQL from Cloud Run
gcloud projects add-iam-policy-binding ORG_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudsql.client" \
  --condition=None
```

### 1.8c — Verify All 5 Roles Are Bound

```bash
gcloud projects get-iam-policy ORG_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:github-deployer" \
  --format="table(bindings.role)"
```

**Expected output — must show all 5:**
```
ROLE
roles/artifactregistry.writer
roles/cloudsql.client
roles/iam.serviceAccountUser
roles/run.admin
roles/secretmanager.secretAccessor
```

> [!CAUTION]  
> If any role is missing, the pipeline will fail at the corresponding step. Double-check all 5 are listed.

### 1.8d — Export the Service Account Key

```bash
gcloud iam service-accounts keys create gcp-sa-key.json \
  --iam-account=${SA_EMAIL}
```

This creates a `gcp-sa-key.json` file in your current directory.

**Verify the file exists and is valid JSON (PowerShell):**
```powershell
Get-Content gcp-sa-key.json | ConvertFrom-Json | Select-Object project_id, client_email
```

Should output your project ID and the service account email.

> [!WARNING]  
> **Security:** This key file is a credential. Do NOT commit it to Git. Do NOT share it. After adding it to GitHub Secrets, you can delete the local file.

---

## Step 1.9 — Set Up Secret Manager

Store the secrets that Cloud Run will inject as environment variables at runtime.

### 1.9a — Database Connection Strings

> We don't have a DB yet (that's Phase 2), but we'll create placeholder secrets now so the pipeline doesn't fail. We'll update the values in Phase 2 after creating Cloud SQL.

```bash
# Production DB connection string (placeholder — will update in Phase 2)
echo -n "Host=placeholder;Database=ENT_Prod;Username=postgres;Password=placeholder" | \
  gcloud secrets create db-connection-prod \
  --data-file=- \
  --labels=environment=production,service=ent-web

# Staging DB connection string (placeholder — will update in Phase 2)
echo -n "Host=placeholder;Database=ENT_Test;Username=postgres;Password=placeholder" | \
  gcloud secrets create db-connection-staging \
  --data-file=- \
  --labels=environment=staging,service=ent-web
```

### 1.9b — SMTP Password

```bash
# Replace YOUR_SMTP_PASSWORD with your actual Zoho SMTP password
echo -n "YOUR_SMTP_PASSWORD" | \
  gcloud secrets create smtp-password \
  --data-file=- \
  --labels=service=ent-web
```

### 1.9c — Verify Secrets

```bash
gcloud secrets list --format="table(name,labels,createTime)"
```

**Expected output:**
```
NAME                   LABELS                                    CREATE_TIME
db-connection-prod     environment=production, service=ent-web   2026-07-10T...
db-connection-staging  environment=staging, service=ent-web      2026-07-10T...
smtp-password          service=ent-web                           2026-07-10T...
```

---

## Step 1.10 — Configure GitHub Repository Secrets

Go to your GitHub repository:  
**Settings → Secrets and variables → Actions → New repository secret**

Add these 2 secrets:

### Secret 1: `GCP_PROJECT_ID`

```
Name:  GCP_PROJECT_ID
Value: ent-web-org-prod        ← your actual org project ID
```

### Secret 2: `GCP_SA_KEY`

```
Name:  GCP_SA_KEY
Value: (entire contents of gcp-sa-key.json)
```

**How to copy the key on Windows PowerShell:**
```powershell
Get-Content gcp-sa-key.json -Raw | Set-Clipboard
```

Then paste into the GitHub secret value field.

### (Optional) Delete the local key file after adding to GitHub:
```powershell
Remove-Item gcp-sa-key.json
```

---

## Step 1.11 — Final Verification Checklist

Run this all-in-one verification script:

```bash
echo "=== Project ==="
gcloud config get project

echo ""
echo "=== Organization Parent ==="
gcloud projects describe $(gcloud config get project) --format="value(parent.type):value(parent.id)"

echo ""
echo "=== Billing ==="
gcloud billing projects describe $(gcloud config get project) --format="value(billingEnabled)"

echo ""
echo "=== Enabled APIs ==="
gcloud services list --enabled \
  --filter="NAME:(run OR artifactregistry OR sqladmin OR secretmanager OR cloudbuild)" \
  --format="value(NAME)" | sort

echo ""
echo "=== Artifact Registry ==="
gcloud artifacts repositories list --location=asia-south1 --format="value(name)"

echo ""
echo "=== Service Account ==="
gcloud iam service-accounts list --filter="email:github-deployer" --format="value(email)"

echo ""
echo "=== Service Account Roles ==="
gcloud projects get-iam-policy $(gcloud config get project) \
  --flatten="bindings[].members" \
  --filter="bindings.members:github-deployer" \
  --format="value(bindings.role)" | sort

echo ""
echo "=== Secrets ==="
gcloud secrets list --format="value(name)" | sort
```

**Expected output — everything should be populated:**
```
=== Project ===
ent-web-org-prod

=== Organization Parent ===
organization:123456789012

=== Billing ===
True

=== Enabled APIs ===
artifactregistry.googleapis.com
cloudbuild.googleapis.com
run.googleapis.com
secretmanager.googleapis.com
sqladmin.googleapis.com

=== Artifact Registry ===
ent-web-images

=== Service Account ===
github-deployer@ent-web-org-prod.iam.gserviceaccount.com

=== Service Account Roles ===
roles/artifactregistry.writer
roles/cloudsql.client
roles/iam.serviceAccountUser
roles/run.admin
roles/secretmanager.secretAccessor

=== Secrets ===
db-connection-prod
db-connection-staging
smtp-password
```

> If anything is missing, go back to the corresponding step and re-run it.

---

## ✅ Phase 1 Complete

Your GCP Organization project is fully provisioned with:

| Resource | Status |
|---|---|
| Project under Organization | ✅ Created |
| Billing linked | ✅ Linked |
| 8 APIs enabled | ✅ Enabled |
| Artifact Registry (`ent-web-images`) | ✅ Created |
| Service Account (`github-deployer`) | ✅ Created with 5 IAM roles |
| Secret Manager (3 secrets) | ✅ Created (DB strings are placeholders) |
| GitHub Secrets (2 secrets) | ✅ Configured |

**Next → Phase 2:** Create Cloud SQL PostgreSQL instance and update the DB connection secrets with real values.
