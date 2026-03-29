# Landing Page

## Background

The project has already moved away from a generic AI SaaS homepage and now uses a custom harmonium landing page. The homepage needs to keep serving search intent, while the dedicated `/keyboard` page handles focused practice.

## Goal

Make `/` a clear SEO-first product homepage that:

- explains what Web Harmonium is
- matches the `web harmonium` / `online harmonium` query intent
- routes users cleanly into `/keyboard`
- supports future growth into blog, pricing, and light SaaS features

## Non-goals

- Do not turn `/` into the full practice interface
- Do not gate the core tool behind sign-in
- Do not overload the page with admin, billing, or dashboard concepts

## Scope

- Routes:
  `/`
  `/keyboard`
  `/blog`
  `/pricing`
- Components:
  `src/app/[locale]/(landing)/page.tsx`
  `src/shared/blocks/harmonium/home.tsx`
  `src/shared/blocks/harmonium/keyboard-page.tsx`
- Data:
  static copy
  public blog links
- Settings:
  app name, app description, logo, preview image

## UX notes

- The homepage should feel like a product landing page, not a raw instrument screen.
- The primary CTA must go to `/keyboard`, not a hash on the homepage.
- The first screen should explain value quickly and show a preview of the instrument.
- The `/keyboard` page should feel more focused and utility-driven than `/`.
- Header spacing and scroll behavior must work with the sticky navigation.

## SEO notes

- Primary intent:
  `web harmonium`
  `online harmonium`
  `play harmonium online`
- Homepage should target broad commercial-informational intent.
- `/keyboard` should target tool-intent and practice-intent variants.
- Internal links should route users from homepage to blog guides and back.
- The homepage must keep visible text around the tool preview so it can rank as a real content page.

## Data and auth

- Homepage and keyboard page do not require sign-in.
- Local settings are stored in browser storage.
- No database dependency is required for first-use playback.
- Auth remains optional and should not block the core experience.

## Acceptance checklist

- [ ] `/` and `/keyboard` are clearly different pages
- [ ] Homepage CTA points to `/keyboard`
- [ ] Header `Play` link points to `/keyboard`
- [ ] Footer `Play Online` link points to `/keyboard`
- [ ] Homepage loads cleanly on desktop and mobile
- [ ] `/keyboard` feels like a focused practice page
- [ ] Copy still aligns with keyword intent
- [ ] No sign-in is required for first play

## Risks

- If `/` and `/keyboard` become visually too similar, users will feel the extra route is fake.
- If the homepage becomes too tool-heavy, it may weaken SEO readability.
- If the homepage becomes too marketing-heavy, it may weaken product credibility.
- If sticky header spacing is not tested, the top of important sections can get hidden.
