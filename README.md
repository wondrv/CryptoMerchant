# CryptoMerchant

Lightweight crypto payment gateway SaaS (development repo).

Quick start
-----------

Prerequisites
- Node.js 22+ (for local dev)
- Docker & Docker Compose (for containerized run)
- PostgreSQL and Redis (used by Docker Compose or provide via env)

Environment
- Copy `.env.example` to `.env` and set secrets (`DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `WALLET_ENCRYPTION_KEY`, `APP_URL`, `API_URL`).

Run with Docker Compose (recommended)
```bash
# from repo root
docker compose up --build
# frontend: http://localhost:3000
# backend API root: http://localhost:4000/api
```

Run locally (two terminals)
Terminal A (backend):
```bash
npm run dev:backend
```
Terminal B (frontend):
```bash
npm run dev:frontend
```

Run both in one terminal (optional)
```bash
# install once
npm install -D concurrently
# run
npx concurrently "npm run dev:backend" "npm run dev:frontend"
```

Build images manually
```bash
# from repo root
docker build -f apps/frontend/Dockerfile . -t cryptomerchant-frontend
docker build -f apps/backend/Dockerfile . -t cryptomerchant-backend
```

Testing & build
```bash
# backend tests
npm test -w @cryptomerchant/backend
# build backend/frontend
npm run build
```

Useful endpoints
- Frontend UI: http://localhost:3000/
- Admin UI: http://localhost:3000/admin
- Backend API root: http://localhost:4000/api
- Swagger (if enabled): http://localhost:4000/docs
- Health check: http://localhost:4000/api/health
- Admin audit logs: GET http://localhost:4000/api/admin/audit-logs

Notes
- Dockerfiles expect to be built from the repository root so top-level files (e.g. `package-lock.json`, `tsconfig.base.json`) are available to the build context.
- The repo includes production hardening steps (non-root containers, healthchecks, rate-limiting, RBAC, audit logging). Review secrets and rotate keys before production.

License
- Internal demo code.
