#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:?Set DATABASE_URL in .env.local}"
psql "$DATABASE_URL" <<'SQL'
INSERT INTO demo_users (name, email) VALUES
  ('Demo Admin','admin@example.com') ON CONFLICT DO NOTHING;
SQL
echo "Seeded demo data."
