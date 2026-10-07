# JOY TRUE PROFILE — API Documentation & Catalog

## 1. Base URL
- Production Base URL: https://test2.joycorporatesolutions.com/api
- Interactive OpenAPI Docs: https://test2.joycorporatesolutions.com/api/docs

## 2. Core API Modules

### Authentication (/api/auth)
- POST /api/auth/login: Authenticate users by role (superadmin, company, hrexecutive). Returns JWT token and profile payload.
- POST /api/auth/verify-token: Validate active session token.
- POST /api/auth/logout: Invalidate session.

### SuperAdmin Management (/api/superadmin)
- GET /api/superadmin/dashboard-stats: Real-time operational metrics, total companies, verified profiles, active gateways.
- GET /api/superadmin/companies: List all registered organizations.
- POST /api/superadmin/companies: Create a new enterprise organization.
- PUT /api/superadmin/companies/{id}/status: Activate, suspend, or update tariffs.
- GET /api/superadmin/api-configs: List third-party verification API providers (Sandbox, CoinCircle, Neev).
- PUT /api/superadmin/api-configs/{id}: Update provider keys, rate limits, and routing priority.

### Company Portal (/api/company)
- GET /api/company/dashboard: Company overview, labor quota, verification success rate.
- GET /api/company/hr-team: List all HR recruiters in company.
- POST /api/company/hr-team: Invite/create HR executive with role permissions.
- GET /api/company/workforce: List all workforce candidates and verification statuses.
- GET /api/company/invoices: Monthly postpaid billing statements with GST breakdown.

### HR Workstation (/api/hr)
- GET /api/hr/candidates: List candidate verification pipeline.
- POST /api/hr/candidates: Create single candidate profile.
- POST /api/hr/candidates/bulk-import: Excel/CSV batch import (up to 1,000 hires).
- POST /api/hr/candidates/{id}/dispatch-link: Generate and send PIN-protected magic link via WhatsApp / SMS / Email.
- GET /api/hr/candidates/{id}/report: Download cryptographic PDF audit dossier.

### Verification Engine (/api/verification)
- GET /api/verification/candidate/{token}: Retrieve candidate verification metadata for web link.
- POST /api/verification/verify-otp: Authenticate candidate 4-digit PIN / SMS OTP.
- POST /api/verification/execute-check: Trigger specific check (adhaar, pan, epfo, ank, ace_liveness, court_records).
- POST /api/verification/submit-complete: Finalize self-verification and generate digital QR gate pass.
