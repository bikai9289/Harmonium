# Local Setup

## Purpose

Get the Web Harmonium project running locally with database, RBAC, seeded config, and route verification.

## Prerequisites

- Node and `pnpm`
- Docker Desktop running
- PostgreSQL container available
- Local workspace checked out

## Local database

Current local database assumptions:

- container name: `postgres14`
- host port: `5432`
- database: `harmonium`
- username: `postgres`
- password: `postgres`

## Environment files

Required local env values are already reflected in:

- `.env`
- `.env.development`

Important keys:

- `DATABASE_PROVIDER=postgresql`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/harmonium`
- `NEXT_PUBLIC_APP_URL`
- `AUTH_URL`
- `AUTH_SECRET`

## Setup steps

1. Install dependencies

```powershell
pnpm install
```

2. Ensure database exists

```powershell
docker exec postgres14 psql -U postgres -c "CREATE DATABASE harmonium;"
```

If it already exists, PostgreSQL will report that and no further action is needed.

3. Push schema

```powershell
pnpm db:push
```

4. Seed RBAC

```powershell
pnpm rbac:init
```

5. Seed default config values

```powershell
pnpm config:init
```

## Useful local commands

Build production output:

```powershell
pnpm build
```

Start local production server:

```powershell
pnpm start
```

Start on another port:

```powershell
$env:PORT="3003"
$env:NEXT_PUBLIC_APP_URL="http://localhost:3003"
$env:AUTH_URL="http://localhost:3003"
pnpm start
```

## Route verification

Core public routes:

- `/`
- `/keyboard`
- `/blog`
- `/sign-in`

Admin routes:

- `/admin`
- `/admin/users`
- `/admin/roles`
- `/admin/no-permission`

Expected behavior:

- `/` is the SEO landing page
- `/keyboard` is the focused practice page
- `/admin` redirects authenticated viewer users to `/admin/users`
- viewer users are redirected from `/admin/roles` to `/admin/no-permission`

## Test account flow

Recommended smoke test:

1. Register a test user
2. Sign in with email + password
3. Verify session creation
4. Open `/admin/users`
5. Confirm `/admin/roles` is blocked for viewer role

## Known local quirks

- Port `3000` may already be occupied by another project on this machine.
- In that case, run harmonium on another port and update `NEXT_PUBLIC_APP_URL` and `AUTH_URL` for that session.
- `next build` works locally after the Windows standalone workaround already added in the project.
- ESLint is not fully usable until the template is migrated to flat config.

## Recovery checklist

If local setup breaks:

1. Confirm Docker is running
2. Confirm `postgres14` is running
3. Confirm `harmonium` database exists
4. Re-run `pnpm db:push`
5. Re-run `pnpm rbac:init`
6. Re-run `pnpm config:init`
7. Re-run `pnpm build`

## Files to know

- `scripts/init-rbac.ts`
- `scripts/init-configs.ts`
- `.env`
- `.env.development`
- `src/core/auth/*`
- `src/core/rbac/*`
- `src/shared/blocks/harmonium/*`
