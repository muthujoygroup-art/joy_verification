# Antigravity IDE Workspace Instructions: JOY TrueProfile

## Project Overview
JOY TrueProfile is an enterprise-grade sovereign Indian identity verification, candidate onboarding, and statutory compliance platform built for the **Muthu Joy Group**.

## Master Context & Complete Conversation History
> **CRITICAL**: The complete architectural blueprints, conversation history, API specifications (Neev 81 APIs), database schemas, role matrices, DigiLocker flows, and runbooks are documented in:
> `MIGRATION_AND_PROJECT_MASTER_CONTEXT.md` (located at the project root).
> Always refer to `MIGRATION_AND_PROJECT_MASTER_CONTEXT.md` whenever developing or refactoring features.

## Architecture & Conventions
1. **Frontend**: React 19 + Vite + Tailwind CSS v4. Central state is managed in `src/context/AppContext.jsx`.
2. **Backend**: Python FastAPI with modular routers in `backend/app/routers/` and services in `backend/app/services/`.
3. **Official Portals**: All government redirect links are centralized in `src/config/officialDocumentPortals.jsx`.
4. **Verification Engine**: `backend/app/services/live_verification_service.py` handles live/mock Neev API calls.
5. **DigiLocker Integration**: Strict deduplication by candidate ID/hash must be maintained in all DigiLocker views.

## Running the Application
- **Backend**: `python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000`
- **Frontend**: `npx vite --port 5173`
- **Build**: `npm run build`
