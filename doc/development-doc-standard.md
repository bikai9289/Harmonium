# Web Harmonium Development Doc Standard

## Goal

Keep documentation light, searchable, and directly useful for shipping. This project does not need a heavy enterprise process, but it does need stable rules so product, SEO, design, and engineering stay aligned.

## Recommended doc structure

- `doc/harmonium-saas-plan.md`
  Use for the high-level product direction and business model.
- `doc/harmonium-execution-checklist.md`
  Use for short-term launch tasks and operational checklists.
- `doc/development-doc-standard.md`
  Use as the documentation rulebook for the repo.
- `doc/features/<feature-name>.md`
  One file per meaningful feature or page group.
- `doc/seo/<topic>.md`
  Keyword intent, page angle, internal links, and content brief.
- `doc/runbooks/<topic>.md`
  Operational steps such as deploy, database init, GSC submission, or admin bootstrap.
- `doc/adr/<yyyymmdd>-<decision>.md`
  Short architecture decision records for choices that will matter later.

## What every feature doc should contain

Each feature file should be short and follow the same order:

1. Background
   Why we are doing this now.
2. Goal
   The user outcome we want.
3. Non-goals
   What this task will not solve.
4. Scope
   Routes, components, data, and settings affected.
5. UX notes
   What the page should feel like and any interaction expectations.
6. SEO notes
   Target query, title angle, internal links, structured data if needed.
7. Data and auth
   Whether it needs database, roles, settings, or analytics.
8. Acceptance checklist
   What must be true before we call it done.
9. Risks
   Things likely to break or confuse users.

## Suggested template

```md
# <Feature name>

## Background

## Goal

## Non-goals

## Scope
- Routes:
- Components:
- Data:
- Settings:

## UX notes

## SEO notes

## Data and auth

## Acceptance checklist
- [ ] Page loads on desktop and mobile
- [ ] Copy matches search intent
- [ ] Auth / RBAC behavior is correct
- [ ] Analytics or events are defined if needed
- [ ] Empty/loading/error states are acceptable

## Risks
```

## Rules for this project

- One feature, one doc. Do not mix unrelated changes into the same file.
- Write docs for decisions, not for obvious code.
- Keep docs ahead of implementation when the change affects SEO, routing, auth, payment, or data.
- If a change alters user flow, update the relevant feature doc in the same PR.
- If a change alters roles or settings, update both the feature doc and the runbook.
- If a page is built for SEO, the doc must include primary keyword, secondary keywords, and the exact page intent.

## Minimum docs required before coding

For a small UI tweak:
- A short task note in the relevant feature doc is enough.

For a new page or workflow:
- Feature doc
- Acceptance checklist

For anything involving auth, billing, or admin:
- Feature doc
- Runbook update
- ADR if the design choice is likely to stick

For anything involving SEO landing pages:
- Feature doc
- SEO brief
- Internal link plan

## Good defaults for Web Harmonium

- Product docs should optimize for search intent first, SaaS expansion second.
- UX notes should say what happens above the fold, what the primary CTA does, and where it scrolls.
- RBAC notes should explicitly say which role can access which admin page.
- SEO docs should avoid vague targets like "music keywords" and instead name exact queries.
- Runbooks should assume a new teammate can use them without asking for missing steps.

## Current practical conventions

- Use `doc/features/landing-page.md` for homepage and play-surface changes.
- Use `doc/features/admin-rbac.md` for admin access and role behavior.
- Use `doc/seo/homepage-keyword-brief.md` for keyword and content decisions.
- Use `doc/runbooks/local-setup.md` for database init, seed commands, and local startup.

## Suggested next docs to add

- `doc/features/landing-page.md`
- `doc/features/admin-rbac.md`
- `doc/runbooks/local-setup.md`
- `doc/seo/homepage-keyword-brief.md`