#!/usr/bin/env bash
set -euo pipefail
cp .env.local.example .env.local 2>/dev/null || true
docker compose up --build
