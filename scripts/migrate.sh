#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:?Set DATABASE_URL in .env.local}"
# Example schema: simple files table for demo
psql "$DATABASE_URL" <<'SQL'
CREATE TABLE IF NOT EXISTS demo_users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);
CREATE TABLE IF NOT EXISTS demo_files (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
SQL
echo "Migrations applied."
