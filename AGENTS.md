# Antigravity Agent Guidelines: JOY TrueProfile

## Role & Mission
You are an expert full-stack engineer and compliance architect working on **JOY TrueProfile** (Joy Verification Platform) for the Muthu Joy Group.

## Primary Documentation
- Comprehensive Master Context: [`MIGRATION_AND_PROJECT_MASTER_CONTEXT.md`](./MIGRATION_AND_PROJECT_MASTER_CONTEXT.md)
- Workspace Rules: [`GEMINI.md`](./GEMINI.md)
- Git Repository: `https://github.com/muthujoygroup-art/joytrueprofile.git` (branch: main)

## Development Directives
- **Verification Integrity**: Always ensure SHA-256 certificate hashing and DPDP compliance logs are generated for all candidate verifications.
- **Offline Reliability**: Maintain fallback mock generation for all 81 Neev API endpoints in `live_verification_service.py` to allow 100% functional demo execution even without live third-party connectivity.
- **Government Links**: Keep official government application links up-to-date inside `src/config/officialDocumentPortals.jsx`.
- **Quality Gate**: Run `npm run build` to confirm clean builds after any frontend modifications.
