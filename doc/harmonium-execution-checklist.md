# Harmonium Execution Checklist

## Current stage

Turn the existing SaaS template into a searchable, usable `web harmonium` MVP:

- homepage for SEO and product positioning
- dedicated `/keyboard` page for focused practice
- blog and pricing kept as reusable template assets
- auth, admin, and payment kept as future-ready infrastructure

## P0 done

- [x] Homepage replaced with a custom harmonium landing page
- [x] Dedicated `/keyboard` route created
- [x] Homepage CTA changed from `/#keyboard` to `/keyboard`
- [x] Header and footer `Play` links changed to `/keyboard`
- [x] Browser-based harmonium keyboard is playable
- [x] Keyboard shortcuts work
- [x] Click / touch playback works
- [x] Volume, octave, transpose controls work
- [x] Western / Sargam label switching works
- [x] Branding replaced with `Web Harmonium`
- [x] Two initial SEO posts added
- [x] Privacy policy and terms replaced
- [x] RBAC initialized
- [x] Default config data initialized
- [x] Auth sign-up / sign-in smoke-tested
- [x] `/admin` access path verified for `viewer`

## P0 still to finish

- [ ] Mobile layout verification on real device widths
- [ ] Replace oscillator sound with real sampled harmonium audio
- [ ] Add analytics and Search Console integration
- [ ] Clean up remaining Chinese/legacy locale content if not needed
- [ ] Replace any remaining template references outside the public flow

## P1 next

- [ ] Improve `/keyboard` page spacing and responsive tuning continuously
- [ ] Add richer practice hints on `/keyboard`
- [ ] Improve internal linking between homepage, keyboard page, and blog
- [ ] Review `/pricing` content and align it with future Pro positioning
- [ ] Add a local setup runbook and keep it current
- [ ] Add feature docs for landing page and admin RBAC

## P2 later

- [ ] MIDI support
- [ ] Recording and playback
- [ ] Saved user presets across devices
- [ ] Practice mode / lesson mode
- [ ] Premium packs or Pro features
- [ ] Better sampled sound bank / instrument variants

## Acceptance criteria

- [ ] A first-time user can understand the product from `/`
- [ ] A first-time user can reach `/keyboard` in one click
- [ ] A first-time user can play without signing in
- [ ] `/` and `/keyboard` feel meaningfully different
- [ ] Blog content supports the main keyword cluster
- [ ] Admin access is permission-gated correctly
- [ ] Local build passes

## Canonical docs to use

- `doc/development-doc-standard.md`
- `doc/features/landing-page.md`
- `doc/features/admin-rbac.md`
- `doc/runbooks/local-setup.md`
- `doc/seo/homepage-keyword-brief.md`
- `doc/test-logs/2026-03-29-validation-summary.md`
