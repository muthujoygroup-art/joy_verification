# JOY TrueProfile (Joy Verification Platform)

> Sovereign Indian Enterprise Workforce Verification, Automated Onboarding, and Statutory Labor Compliance Platform for the **Muthu Joy Group**.

---

## 🏛️ Platform Overview

**JOY TrueProfile** automates employee background verification (BGV), statutory compliance (CLRA Form XVI), and credential management into a **10-minute automated digital process** compliant with the **DPDP Act 2023** and **ISO 27001**.

### Core Platform Capabilities:
- **81 Neev Sovereign Verification APIs**: Live and fallback mock engines covering Identity, Tax, Banking, EPFO UAN Moonlighting, Transportation, Court Records, and Corporate KYB.
- **DigiLocker Digital Vault**: Direct XML extraction and tamper-evident storage with strict `Map`-based citizen profile deduplication.
- **Government Document Redirect Hub**: 1-click fallback redirection to 8 sovereign portals (Instant e-PAN, myAadhaar, EPFO Member/UMANG, ESIC, Sarathi Parivahan, ECI Voter, Passport Seva, NFSA).
- **5 Multi-Tenant Role Portals**: Dedicated workspaces for Super Admin, Company Admin, HR Executive, Candidate / Employee, and Vendor / Contractor.
- **Verifiable Digital Credentials**: Tamper-evident SHA-256 certificate hashing and anti-counterfeit dynamic QR verification codes.

---

## 📁 Structured Project Directory Map

```text
Verification/
├── src/                                     # React 19 Frontend
│   ├── components/                          # Reusable UI & Modal components
│   │   ├── landing/                         # Main landing page interactive showcases
│   │   ├── statutory/                       # Statutory registers & CLRA compliance
│   │   ├── FullJoiningFormModal.jsx         # 15-Tab Onboarding & Verification Wizard
│   │   ├── DigiLockerSectionView.jsx        # DigiLocker Digital Vault
│   │   ├── ComprehensiveBgvReportModal.jsx  # Comprehensive 10-Page BGV Dossier
│   │   └── OfficialVerificationCertificateModal.jsx # Verifiable Certificate
│   ├── config/                              # Configuration & Statutory Constants
│   │   └── officialDocumentPortals.jsx      # Government Redirect Hub & Banner
│   ├── context/                             # Global State Management
│   │   └── AppContext.jsx                   # Central App Context & Multi-Tenant State
│   ├── data/                                # Master dropdown options & India locations
│   ├── services/                            # Axios API client & PDF export utilities
│   ├── utils/                               # Diagnostic playbooks, rules & sound engine
│   └── views/                               # 5 Portal Views & Landing Page
│
├── backend/                                 # FastAPI Backend Architecture
│   └── app/
│       ├── main.py                          # Application entry point & security middleware
│       ├── config.py                        # Pydantic Settings & environment variables
│       ├── database.py                      # SQLAlchemy session engine & connection pooling
│       ├── models/                          # 21 Relational ORM Data Models
│       ├── routers/                         # REST API Controllers (auth, hr, company, etc.)
│       └── services/                        # 81-API verification, DigiLocker, & report services
│
├── database/                                # Relational SQL Schemas & Seed Dumps
│   ├── schema.sql                           # Clean relational schema definitions
│   └── database_cpanel_schema_and_data.sql  # Production MySQL dump & seed data
│
├── docs/                                    # Documentation, Specs, Manuals & Presentations
│   ├── specifications/                      # Neev 81 APIs specs, Excel & PDF integration guides
│   ├── manuals/                             # Master legal, compliance & feature blueprint DOCX
│   ├── templates/                           # Master onboarding form fields & feature matrices
│   ├── presentations/                       # Master pitch decks (PPTX & PDF)
│   └── architecture/                        # Markdown architecture, security & testing docs
│
├── scripts/                                 # Startup & maintenance automation scripts
│   └── start_servers.bat                    # Dual-server startup script
│
├── _archive/                                # Archived & Legacy Assets
│   ├── scratch_scripts/                     # Legacy extraction & audit scratch scripts
│   ├── capture_tools/                       # Screenshot capture & slide export scripts
│   ├── presentation_generators/             # Python-pptx corporate presentation generators
│   ├── legacy_presentations/                # Archived pitch decks & intermediate PPTX files
│   ├── extracted_neev_data/                 # Historical Neev guide extraction dumps
│   └── legacy_docs/                         # Archived API docs & reference guides
│
├── MIGRATION_AND_PROJECT_MASTER_CONTEXT.md  # Comprehensive Master Project Context & Runbook
├── GEMINI.md / AGENTS.md                    # Antigravity IDE workspace rules & directives
├── package.json                             # Frontend dependencies & scripts
├── passenger_wsgi.py                        # Python WSGI entry point for cPanel Passenger
├── requirements.txt                         # Backend Python dependencies
└── vite.config.js                           # Vite build & proxy configuration
```

---

## 🚀 Running the Project Locally

### 1. Start the FastAPI Backend (Port 8000)
```powershell
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
- **API Root**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)

### 2. Start the Vite Frontend (Port 5173)
```powershell
npx vite --port 5173
```
- **Local Application URL**: [http://localhost:5173](http://localhost:5173)

### 3. Production Build Validation
```powershell
npm run build
```

---

## 🔑 Default Demo Credentials

| Role Portal | URL Path | Email | Password |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `/superadmin` | `superadmin@joyverification.com` | `SuperAdmin@2026` |
| **Company Admin** | `/company` | `admin@enterprise.com` | `Admin@2026` |
| **HR Executive** | `/hr` | `hr@enterprise.com` | `Hr@2026` |
| **Candidate / Employee** | `/employee` | `candidate@joyverification.com` | `Candidate@2026` |
| **Vendor / Contractor** | `/vendor` | `vendor@joyverification.com` | `Vendor@2026` |
