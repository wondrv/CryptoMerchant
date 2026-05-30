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
# CryptoMerchant

CryptoMerchant is a SaaS reference implementation for a crypto payment gateway. It demonstrates a production-minded full-stack architecture with:

- NestJS backend (API, auth, RBAC, audit logging)
- Prisma + PostgreSQL persistence
- Next.js frontend with Tailwind CSS
- WebSockets for realtime invoice/withdrawal events
- Docker-based local development with healthchecks and non-root runtime

This README documents local development, containerized runs, build/test commands, and production hardening notes.

Prerequisites

- Node.js 22+ (for local dev)
- Docker & Docker Compose (recommended for local integrated runs)
- A working PostgreSQL and Redis instance (or use Docker Compose included here)

Environment

1. Copy the example environment file and fill values:

```bash
cp .env.example .env
# Edit .env: set DATABASE_URL, REDIS_URL, JWT secrets, WALLET_ENCRYPTION_KEY, APP_URL, API_URL
```

2. Important env variables

- `DATABASE_URL` — PostgreSQL connection string (required)
- `REDIS_URL` — Redis connection string (required)
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — secrets for JWT tokens
- `WALLET_ENCRYPTION_KEY` — 32-byte key for wallet encryption
- `APP_URL` / `API_URL` — public URLs used by the frontend and callbacks
- `ENABLE_SWAGGER` — toggle for Swagger (disabled in production by default)

Quick Start (Docker Compose)

```bash
# from repository root
docker compose up --build
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000/api
```

Local development (no Docker)

Open two terminals.

Terminal 1 — Backend:

```bash
npm run dev:backend
```

Terminal 2 — Frontend:

```bash
npm run dev:frontend
```

Run both in one terminal (optional):

```bash
npx concurrently "npm run dev:backend" "npm run dev:frontend"
```

Build and Tests

```bash
# Build both applications
npm run build

# Run backend tests
npm test -w @cryptomerchant/backend
```

Docker image build notes

- Dockerfiles expect to be built from the repository root (`.`) because they `COPY` top-level files like `package-lock.json` and `tsconfig.base.json` into the build context. Use `docker build -f <Dockerfile> .` from repo root.

Security & Production Hardening (high level)

- Non-root runtime: final images run as the `node` user to reduce risk.
- HTTP hardening: `helmet()`, CORS restricted to `APP_URL`, and global `express-rate-limit` are enabled in `apps/backend/src/main.ts`.
- Auth & RBAC: `RolesGuard` is fail-closed; refresh token flow verifies refresh JWT and stores hashed refresh tokens server-side; change-password revokes refresh tokens.
- Audit logging: `AuditLog` model + `AuditLoggingInterceptor` capture mutating requests (POST/PUT/PATCH/DELETE) into the DB; admin listing available at `/api/admin/audit-logs`.

Observability & Next Steps

- Audit logs are stored in the database; add metrics (Prometheus) and central logs (ELK/Grafana) for production readiness.
- Replace mock blockchain providers with real integrations and add retries/monitoring.

Troubleshooting

- Docker build errors about missing files: make sure the build context is the repository root (`.`). Example:

```bash
docker build -f apps/frontend/Dockerfile . -t cryptomerchant-frontend
```

- Editor TypeScript warnings (e.g. `baseUrl` deprecation): these are managed in `tsconfig.base.json` for the pinned TypeScript version in this repo.

Contributing

- Fork, create feature branches, and open PRs. Run `npm run format` and tests before submitting.

License

This repository is provided as a demo/reference implementation.

Maintainer

Open issues for questions or hardening suggestions.
