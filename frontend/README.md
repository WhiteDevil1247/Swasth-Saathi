# HealthSaathi Frontend (Go Live Ready)

This is a lightweight React SPA that runs from a single HTML file using CDN React + Babel. No build step is required, so it works perfectly with VS Code "Go Live" or any static hosting.

## Structure
- index.html — entry file; open this with Go Live
- styles.css — futuristic UI (glassmorphism, hover animations, glowing cursor)
- app.js — React app with hash router and placeholder pages for all SRS features
- config.js — runtime settings (API base URL, Google Maps key)

## Routes (hash-based)
- #home — Landing + feature cards
- #general — General section overview (QR, NGOs, Hospitals, Checkups)
- #accessible — Accessibility overview (Navigator, QR, NGOs, Community)
- #healthvault — HealthVault Locker
- #qr — Generate offline emergency QR card
- #ai — AI Health Companion
- #navigator — Hospital Navigator
- #telehealth — Teleconsultation
- #emergency — Emergency Mode
- #ngo — NGO & Support Hub (browse + connect)
- #hospitals — Browse hospitals and book appointment
- #checkups — Schedule and view regular checkups
- #community — Simple community posts
- #timeline — AI Health Timeline
- #score — Personalized Health Score
- #voice-gesture — Voice & Gesture Navigation
- #audio — Audio Health Reports
- #sign-language — Sign-Language Calls
- #qr — Offline Emergency QR Card
- #geo-alerts — Geo-Health Alerts
- #schemes — Health Scheme Auto-Matcher
- #admin — Admin Panel

## How to Run
1. Open frontend/index.html in VS Code.
2. Use the "Go Live" feature (or any static server) to preview.
3. Navigate via the top navbar or change the URL hash.

## Backend Setup
1. In backend/.env (copy from .env.example):
   - PORT=8000
   - FRONTEND_ORIGIN=http://localhost:3000
   - FRONTEND_ORIGINS=http://127.0.0.1:5500,http://localhost:5500
   - JWT_SECRET=REPLACE_WITH_SECURE_RANDOM
   - Optional: MONGO_URI=mongodb+srv://...
2. From backend/, run:
   - npm install
   - npm run dev

## Frontend Config
Edit frontend/config.js:
- API_BASE: 'http://localhost:8000'
- GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_KEY'

## Deployment Plan
- Frontend: host static folder (frontend/) on Netlify, GitHub Pages, or S3/CloudFront.
- Backend: deploy Node app (backend/) to Render, Railway, Fly.io, or AWS. Set env vars and (optionally) MONGO_URI. Add your frontend domain to FRONTEND_ORIGINS.

## Notes
- The legacy Next.js app remains under healthcare-main (unchanged) for reference.
- The backend stays under backend.
- You can iterate page-by-page in app.js, replacing placeholders with real logic and API calls.
