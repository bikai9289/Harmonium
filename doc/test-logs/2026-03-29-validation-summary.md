# Validation Summary

Date: `2026-03-29`

## Purpose

Capture the current implementation and verification status in one canonical place under `doc/`.

## Build status

- `pnpm build` passes
- local build includes `/keyboard`
- current known warning:
  `baseline-browser-mapping` data is old, but it does not block the build

## Database and setup

Verified local database assumptions:

- PostgreSQL in Docker
- database name: `harmonium`
- username: `postgres`
- password: `postgres`

Completed setup:

- `pnpm db:push`
- `pnpm rbac:init`
- `pnpm config:init`

Verified seeded totals:

- permissions: `29`
- roles: `4`
- config rows: `25`

## Auth verification

Verified successfully:

- sign-up via `POST /api/auth/sign-up/email`
- sign-in via `POST /api/auth/sign-in/email`
- session retrieval via `GET /api/auth/get-session`

Smoke test account used:

- email: `codex-check-1774770489@example.com`

## RBAC verification

Confirmed current default behavior:

- newly created user receives role `viewer`
- `viewer` can access `/admin/users`
- `viewer` cannot access `/admin/roles`
- restricted route redirects to `/admin/no-permission`

## Route verification

Verified public routes:

- `/`
- `/keyboard`
- `/blog`
- `/sign-in`

Verified route split:

- homepage title:
  `Play Harmonium Online | Web Harmonium`
- keyboard page title:
  `Web Harmonium Keyboard | Practice Mode`
- `/` and `/keyboard` do not return the same HTML

## UI verification

Verified:

- homepage CTA no longer depends on `/#keyboard`
- dedicated keyboard page exists
- keyboard page top spacing was adjusted to avoid sticking to the fixed header

Relevant file:

- `src/shared/blocks/harmonium/keyboard-page.tsx`

## Admin verification

Verified:

- `/admin` redirects signed-in `viewer` users to `/admin/users`
- `/admin/users` loads
- `/admin/roles` redirects to `/admin/no-permission`

## Canonical docs

Use these files as the current source of truth:

- `doc/development-doc-standard.md`
- `doc/harmonium-execution-checklist.md`
- `doc/harmonium-saas-plan.md`
- `doc/features/landing-page.md`
- `doc/features/admin-rbac.md`
- `doc/runbooks/local-setup.md`
- `doc/seo/homepage-keyword-brief.md`

## Remaining high-priority work

- mobile verification
- sampled harmonium audio
- analytics / Search Console
- continued polish between homepage and keyboard page
