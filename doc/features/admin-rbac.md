# Admin RBAC

## Background

RBAC and default config seeding are already in place. The current seeded roles are `super_admin`, `admin`, `editor`, and `viewer`. New users currently receive the `viewer` role by default.

## Goal

Keep `/admin` safe and predictable by ensuring:

- unauthenticated users are redirected to sign-in
- authenticated users with `admin.access` can enter admin
- lower-privilege users only reach the pages they are allowed to see
- restricted pages redirect to `/admin/no-permission`

## Non-goals

- Do not build custom tenant-level roles yet
- Do not add a complex permission editor workflow in this phase
- Do not expose admin controls to anonymous users

## Scope

- Routes:
  `/admin`
  `/admin/users`
  `/admin/roles`
  `/admin/no-permission`
  other admin subpages
- Components and logic:
  `src/app/[locale]/(admin)/layout.tsx`
  `src/app/[locale]/(admin)/admin/page.tsx`
  `src/core/rbac/permission.ts`
  `src/shared/services/rbac.ts`
  `scripts/init-rbac.ts`
  `scripts/init-configs.ts`
- Data:
  `role`
  `permission`
  `role_permission`
  `user_role`
  `config`

## UX notes

- `/admin` should feel intentionally protected, not broken.
- Redirects should be consistent:
  anonymous user -> sign-in
  signed-in but restricted user -> no-permission
- Users with minimal access should still see at least one meaningful admin page.

## SEO notes

- None. Admin pages should stay blocked from public indexing.

## Data and auth

- Database is required.
- Better Auth session must be available.
- `requireAdminAccess` protects the admin layout.
- `requirePermission` protects specific subpages.
- Current default behavior:
  new users receive `viewer`
  `viewer` can access `/admin/users`
  `viewer` cannot access `/admin/roles`

## Acceptance checklist

- [ ] `pnpm rbac:init` succeeds
- [ ] `pnpm config:init` succeeds
- [ ] Unauthenticated `/admin` access redirects to sign-in
- [ ] Viewer can access `/admin/users`
- [ ] Viewer is redirected from `/admin/roles` to `/admin/no-permission`
- [ ] Admin layout branding reflects Web Harmonium config values
- [ ] No admin route is publicly exposed without auth

## Risks

- If initial role config changes silently, new-user access patterns may drift.
- If layout-level and page-level permission checks diverge, users may see inconsistent redirects.
- If docs are not kept current, manual role testing becomes error-prone.
