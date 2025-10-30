# SwasthSaathi Repair Report (Short)

## Root Causes
- Repo contained only a Next.js frontend (tutorial code). No backend/mobile/infra.
- No .env template for multi-service wiring; no Docker; no tests.

## Fixes Implemented
- Added Node.js backend (Express/TS) with routes: `/api/health`, `/api/upload`, `/api/files`, `/api/ai/infer` (mock), and WS `/signalling`.
- Added Docker Compose for Postgres, MongoDB, Redis, backend, frontend.
- Added `.env.local.example` and scripts (`migrate.sh`, `seed_dev.sh`, `start-dev.sh`, `start-prod.sh`).
- Frontend: added `/healthvault` for file upload/list via backend; `/signalling` demo for WS.
- Added Playwright config and smoke tests.

## Outstanding Risks
- Uploads stored on local FS by default; switch to S3 for production.
- Signaling is broadcast-only demo; add rooms/auth and TURN for NAT traversal.
- AI is mocked; integrate TF Serving when model available.
- Security: add JWT, input validation, rate limiting, and file type scanning before prod.
- Compliance: encryption at rest, audit logs, consent management require further work.

## Next Steps
- Implement real auth (OTP/JWT) and role-based access.
- Add migrations for full schema and proper repositories.
- Add CI pipeline and deploy manifests.
