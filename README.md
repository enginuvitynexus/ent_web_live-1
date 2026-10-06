# Enginuvity Nexus Technologies — Web Application

Production-ready enterprise web application for **Enginuvity Nexus Technologies**, built with **.NET 9 (ASP.NET Core Razor Pages)**, **Tailwind CSS**, **Docker**, and automated **GitHub Actions CI/CD** deploying to an **OVH VPS**.

---

## 🛠️ Tech Stack & Architecture

- **Backend / Web Framework:** ASP.NET Core 9.0 (C# / Razor Pages)
- **Styling & UI:** Tailwind CSS + Vanilla CSS / Modern Typography
- **Data & Identity:** Entity Framework Core (PostgreSQL via Npgsql) & ASP.NET Core Identity
- **Containerization:** Docker & Docker Compose (isolated container per application)
- **Web Server & Reverse Proxy:** Nginx (Host reverse proxy with security headers, Gzip, and SSL readiness)
- **CI/CD:** GitHub Actions automated build, test, and zero-downtime VPS deployment
- **Hosting / Infrastructure:** OVH Cloud VPS hardened with UFW, Fail2ban, and SSH key policies

---

## 📁 Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD pipeline deploying to VPS
├── Ent.Web/                      # ASP.NET Core Web Application
│   ├── Data/                     # EF Core DbContext & Database Seeder
│   ├── Models/                   # Domain & Identity models
│   ├── Pages/                    # Razor Pages (Services, Industries, Admin, Blog, Careers)
│   ├── Services/                 # Email & Background services
│   ├── Styles/                   # Tailwind CSS root stylesheet (app.css)
│   ├── wwwroot/                  # Static assets (compiled CSS, JS, images, icons)
│   ├── Dockerfile                # Multi-stage production build container
│   ├── Program.cs                # Application bootstrap & dependency injection
│   └── appsettings.json          # Configuration file
├── docker-compose.yml            # Local & VPS container orchestration
├── Ent.sln                       # .NET Solution file
└── README.md                     # Project documentation
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 20+ & npm](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/) (Optional, for containerized run)

### 1. Clone the Repository
```bash
git clone https://github.com/enginuvitynexus/ent_web_live.git
cd ent_web_live
```

### 2. Install Frontend Dependencies & Build CSS
```bash
cd Ent.Web
npm install
npm run build:css
cd ..
```

### 3. Run Locally with .NET CLI
```bash
dotnet restore Ent.sln
dotnet run --project Ent.Web/Ent.Web.csproj
```
Open `http://localhost:5000` or `https://localhost:5001` in your browser.

### 4. Or Run with Docker Compose
```bash
docker compose up -d --build
```
Access the application at `http://localhost:5000`.

---

## 🚢 Production Deployment & CI/CD

This repository is configured with an automated **GitHub Actions CI/CD pipeline** (`.github/workflows/deploy.yml`).

### How Deployment Works:
1. Every `git push` or merged PR to the **`main`** branch triggers the workflow.
2. **Build & Validate Job:**
   - Sets up .NET 9 SDK and Node.js.
   - Installs dependencies, compiles Tailwind CSS assets, and validates the build.
3. **Deploy to VPS Job:**
   - Connects securely to the VPS via SSH.
   - Syncs code to the application workspace directory.
   - Rebuilds and launches the Docker container (`ent_web_live`).
   - Runs automated HTTP health checks against the local endpoint.

### Required GitHub Repository Secrets
Configured in `Settings -> Secrets and variables -> Actions`:

| Secret Name | Purpose |
| :--- | :--- |
| `VPS_HOST` | Production VPS IP address or domain |
| `VPS_USERNAME` | Deployment user account |
| `VPS_SSH_KEY` | Dedicated OpenSSH Private Key for CI/CD |

---

## 🛡️ VPS Hardening & Security Architecture

The host server is hardened according to CIS Benchmark and NIST standards:
- **Dedicated User:** Non-root administrative and deployment account.
- **SSH Hardening:** Direct `root` login disabled (`PermitRootLogin no`); login whitelisted to authorized deploy user only.
- **Firewall (UFW):** Strict stateful default-deny policy; only ports `22` (SSH), `80` (HTTP), and `443` (HTTPS) allowed.
- **Intrusion Defense (Fail2ban):** Active SSH jail automatically banning brute-force attempts.
- **Docker Log Rotation:** Container logs capped at `50MB` with `3` rolling archives in `/etc/docker/daemon.json` to prevent disk exhaustion.
- **Kernel Tuning (Sysctl):** TCP SYN flood defense, RP spoof filtering, and ICMP redirect attack protection enabled.
- **Reverse Proxy (Nginx):** Masked server tokens (`server_tokens off;`), TLS 1.2/1.3 enforcement, and security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`).

---

## 📜 License & Copyright

© 2026 **Enginuvity Nexus Technologies**. All Rights Reserved.
