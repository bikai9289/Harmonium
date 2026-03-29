# Local Server Runs

Date: `2026-03-29`

## Purpose

Record the local server run attempts and what each port was used for during validation.

## Port notes

### Port 3000

- already occupied by another local project
- observed homepage title:
  `SubtitleAI - AI-Powered Subtitle Generator & Translator`
- conclusion:
  this port was not the harmonium app during validation

### Port 3001

- used for the first successful isolated harmonium validation
- verified:
  `/`
  `/blog`
  `/sign-in`
  auth sign-up and sign-in
  RBAC checks

### Port 3002

- used to verify the later build after anchor and route improvements
- verified:
  homepage and admin behavior against a newer build

### Port 3003

- used to verify the dedicated `/keyboard` route after it was created
- verified:
  `/` and `/keyboard` are distinct pages
  header and footer play links point to `/keyboard`

## Key observations

- `/#keyboard` is only a hash and cannot become a real server route
- `/keyboard` is now the correct product route for focused practice
- later validations should continue using a dedicated free port if `3000` remains occupied

## Canonical outcome

For documentation and review purposes, treat these two files as the main log:

- `doc/test-logs/2026-03-29-validation-summary.md`
- `doc/test-logs/2026-03-29-local-server-runs.md`
