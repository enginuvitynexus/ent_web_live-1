# The 4-Phase Migration Roadmap

This document outlines the architectural migration plan to transition the Enginuvity Nexus Technologies (ENT) platform from its current monolithic PHP structure into a highly scalable, modern .NET 9 ecosystem. Based on the analysis of the current database schema (which encompasses Auth/RBAC, Blog, Careers, HR/Attendance, LMS, and Project Management), the migration is structured into four distinct phases to minimize disruption.

## User Review Required

> [!WARNING]
> This roadmap represents a massive architectural shift. Please review the microservice boundaries in Phase 2 carefully to ensure they align with your business domain requirements. 

## Open Questions

> [!IMPORTANT]
> 1. **LMS System:** The current LMS uses a completely separate user system (`lms_users`) from the admin panel (`admin_users`). In the new architecture, should these be unified under a single Identity Provider (Phase 1), or should the LMS remain completely distinct?
> 2. **Legacy Data Migration:** How should we handle the migration of existing data (especially passwords, which may use a different hashing algorithm in the current PHP setup compared to ASP.NET Core Identity)?

---

## Phase 1: The Public & Admin Core (The Facade)

**Goal:** Decouple the public website and administrative panels into a single, clean ASP.NET Core Razor Pages application, establishing a unified frontend.

**Current Situation:**
- Public website is a collection of static `.html` files and minimal `.php` (e.g., `blog-feed.php`, `send-email.php`).
- Admin panel is a folder of heavy monolithic PHP scripts (`user-management.php`, `projects.php`, etc.).

**Proposed Steps:**
1. **Initialize ASP.NET Core Project:** Create a new ASP.NET Core Razor Pages application to serve as the unified presentation layer.
2. **Migrate Public Pages:** Port the existing static HTML/CSS/JS (including the vanilla JS interactive visual effects) into Razor Views (`.cshtml`). Ensure minimal server-side logic for maximum performance.
3. **Implement ASP.NET Core Identity:** 
   - Replace the legacy `admin_users`, `roles`, and `permissions` tables with standard ASP.NET Core Identity tables.
   - Implement the existing RBAC matrix (Super Admin, Admin, Editor, Project Manager, Engineer, Finance, Client) using Identity Claims and Policies.
4. **Port Admin Shell:** Recreate the admin layout and navigation in Razor Pages, protected by the new Identity authorization policies. At this stage, complex domain logic will temporarily remain pointing to legacy systems or be stubbed out.

---

## Phase 2: Microservice Decomposition & Event Bus

**Goal:** Break down the heavy internal PHP logic into isolated, domain-specific .NET 9 Microservices and introduce an asynchronous event broker.

**Current Situation:**
- Domain logic is tightly coupled in PHP files (e.g., `daily-tasks-admin.php`, `project-view.php`).
- Direct, synchronous database queries are used throughout.

**Proposed Steps:**
1. **Event Broker Setup:** Provision RabbitMQ (via a free CloudAMQP tier) to handle cross-service communication asynchronously.
2. **Develop Domain Microservices (ASP.NET Core Web APIs):**
   - **Auth/User Service:** Handles user profiles, role assignments, and token generation.
   - **Work Management/PMS Service:** Migrates `projects`, `project_modules`, and the `project_activity_log`. Handles the Kanban logic and module assignments.
   - **HR Service:** Migrates the `job_listings`, `job_applications`, `job_types`, and `daily_task_updates`.
   - **LMS Service (Optional/Separate):** Handles `lms_courses`, `lms_modules`, and `lms_enrollments`.
3. **API Gateway (BFF):** Introduce an API Gateway (like YARP or Ocelot) if necessary, or have the Razor Pages app communicate directly with the microservices via internal HTTP clients.
4. **Refactor Razor Pages:** Update the Admin Razor Pages to consume data from these new .NET 9 microservices instead of direct database access.

---

## Phase 3: Dual-Environment Database Setup

**Goal:** Configure two separate operational environments (Test/Staging and Production) using Logical Database Separation to optimize costs.

**Current Situation:**
- Database configuration relies on single connection strings in `config.php`.

**Proposed Steps:**
1. **Database Provisioning:** Deploy a single managed database engine (e.g., Azure SQL, AWS RDS SQL Server, or managed PostgreSQL).
2. **Logical Separation:** Create two distinct databases within the same server instance: `ENT_Prod` and `ENT_Test`.
3. **Configuration Management:** 
   - Utilize ASP.NET Core `appsettings.json` and Environment Variables (`ASPNETCORE_ENVIRONMENT`).
   - Define `appsettings.Development.json` pointing to `ENT_Test`.
   - Define `appsettings.Production.json` pointing to `ENT_Prod`.
4. **EF Core Migrations:** Implement Entity Framework Core for schema management, ensuring both `ENT_Test` and `ENT_Prod` can be independently migrated and seeded.

---

## Phase 4: CI/CD Pipeline Automation

**Goal:** Establish a GitHub Actions automation robot for continuous integration and continuous deployment.

**Current Situation:**
- Deployments appear manual or unstructured.

**Proposed Steps:**
1. **GitHub Actions Workflow Setup:** Create `.github/workflows/main.yml`.
2. **Continuous Integration (CI):**
   - On `push` to `main` or `develop` branches.
   - Restore .NET dependencies, run `dotnet build`.
   - Execute automated unit and integration tests.
3. **Containerization:**
   - Write `Dockerfile`s for the Razor Pages frontend and each .NET 9 Microservice.
   - Pipeline step to `docker build` the images.
4. **Artifact Registry:** 
   - Push the built Docker images to a secure cloud registry (e.g., GitHub Container Registry, Azure Container Registry, or Docker Hub).
5. **Continuous Deployment (CD):**
   - Pipeline step to trigger deployment to the hosting environment (e.g., Azure App Service, AWS ECS, or a VPS running Docker Compose), updating the live containers seamlessly.
