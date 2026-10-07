# JOY TRUE PROFILE — Architecture & Technical Design

## 1. System Architecture Diagram

`
+-------------------------------------------------------------------------------+
|                             CLIENT APPLICATION                                |
|   +-------------------+  +-------------------+  +--------------------------+  |
|   | Public Homepage   |  | Role Portals      |  | Candidate Mobile Portal  |  |
|   | (Light 3D Pastel) |  | (Admin/Comp/HR)   |  | (Zero-App Web Link)      |  |
|   +-------------------+  +-------------------+  +--------------------------+  |
|                              | React 19 / Vite / Tailwind v4                  |
+------------------------------+------------------------------------------------+
                               | HTTPS / JSON REST API
+------------------------------v------------------------------------------------+
|                             FASTAPI BACKEND                                   |
|   +------------------------------------------------------------------------+  |
|   | Middleware: EnterpriseSecurityMiddleware (Rate-Limiter, Anti-DDoS, CORS)| |
|   +------------------------------------------------------------------------+  |
|   | Router Layer:                                                          |  |
|   |  - /api/auth          - /api/superadmin      - /api/company            |  |
|   |  - /api/hr            - /api/verification    - /api/billing            |  |
|   |  - /api/documents     - /api/master-data     - /api/settings           |  |
|   +------------------------------------------------------------------------+  |
|   | Service Layer:                                                         |  |
|   |  - VerificationService (Sandbox + CoinCircle / Neev Rail Dispatchers)   |  |
|   |  - SecurityService (AES-256 GCM, JWT, Masking, Audit Logs)             |  |
|   |  - CommunicationService (WhatsApp Cloud, SMTP Email, SMS)              |  |
|   +------------------------------------------------------------------------+  |
|   | ORM & Persistence Layer: SQLAlchemy 2.0 Engine                         |  |
+------------------------------+------------------------------------------------+
                               | Connection Pooling (psycopg2)
+------------------------------v------------------------------------------------+
|                            DATABASE STORAGE                                   |
|   PostgreSQL 16 Enterprise Cluster (25 Core Schema Tables)                    |
|   - companies, hr_users, candidates, verification_records                     |
|   - api_configurations, api_call_logs, invoices, audit_trail_logs             |
+-------------------------------------------------------------------------------+
`

## 2. Database Schema Relationships
- **Companies** (1) -> (N) **HR Users** -> (N) **Candidates / Workforce Profiles**
- **Candidates** (1) -> (N) **Verification Records** -> (N) **API Call Logs**
- **Companies** (1) -> (N) **Invoices** / **Payment Records**
- **SuperAdmin** (1) -> (N) **API Configurations** & **System Error Logs**

## 3. Authentication & Role-Based Access Control (RBAC)
- **Token Format**: Standard JWT (JSON Web Token) with HS256 algorithm.
- **Role Scopes**:
  - superadmin: Access to all routes under /api/superadmin/*, API provider key management, master tariffs.
  - company: Access restricted to /api/company/* with company ID foreign key validation.
  - hrexecutive: Access restricted to /api/hr/* scoped to assigned company and created batches.
  - employee_link: Ephemeral access token restricted to specific candidate ID and verification submission.

## 4. Resilience & Failover Strategy
- **Dual Database Adapters**: Automated failover to SQLite (joy_verification.db) if PostgreSQL connection drops.
- **Preload Error Auto-Recovery**: Client-side event listener (ite:preloadError) detects chunk version mismatches after new production deployments and cleanly refreshes assets.
- **Lazy Module Code Splitting**: All authenticated portal modules are lazily loaded with retry wrappers (lazyWithRetry) to minimize initial landing page load times.
