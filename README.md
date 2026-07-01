# SwasthSaathi

## Quick Start

- Copy env: `cp .env.local.example .env.local` and fill placeholders.
- Start: `docker compose up --build`
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/api/health

## Local (no Docker)

- Backend (Node):
  - `cd backend`
  - `npm install`
  - `npm run dev`
- Frontend (Next.js):
  - `cd healthcare-main`
  - `npm install`
  - `npm run dev`

## Scripts

- Migrate: `./scripts/migrate.sh`
- Seed: `./scripts/seed_dev.sh`
- Start dev: `./scripts/start-dev.sh`
- Start prod: `./scripts/start-prod.sh`

## Env (.env.local.example)

- Frontend: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_WEBSOCKET_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Backend: `DATABASE_URL`, `MONGO_URI`, `SECRET_KEY`, `JWT_SECRET`, `AES_256_KEY`, `AWS_*`, `REDIS_URL`
- Telehealth: `SIGNALING_SERVER_URL`, `TURN_URL`
- ML: `TF_SERVING_URL`

## Acceptance Validation (SwasthSaathi)

- Frontend loads at :3000
- Backend health at :8000/api/health
- Upload demo file at `/healthvault` -> appears in list
- WebSocket connects at `/signalling`
- AI mock at POST `/api/ai/infer` returns sample



## Troubleshooting

- CORS: backend allows `http://localhost:3000` by default
- Ports busy: stop existing services occupying 3000/8000/5432/6379/27017
- Windows: run bash scripts via Git Bash or WSL, or translate commands to PowerShell

## Root-cause Summary (short)

- Imported repo was frontend-only (Next.js) with Appwrite; lacked backend/mobile/infra and env wiring for cross-service flows.
- Added Node backend, docker-compose, env template, scripts, tests, and minimal frontend pages for file upload and signaling, plus AI mock.

## Deploy hints

- Containerize and deploy via Render/Heroku/Vercel+Railway; set envs; add persistent volumes for storage or use S3; add HTTPS and proper TURN for WebRTC.

## Smoke Test Summary

- Date: Current local run
- Tool: Playwright
- Result: 4 passed
  - frontend loads
  - backend health OK (GET /api/health)
  - upload and list works at /healthvault
  - signalling connects at /signalling

