# 2026-03-29 Mobile, Analytics, and Cleanup Pass

## Scope

This log covers four workstreams completed in the same pass:
- mobile and real-width keyboard polish
- sample-ready audio fallback architecture
- analytics and Google Search Console support
- cleanup of remaining public-facing template residue

## Code Changes Verified

### Responsive keyboard polish
- `src/shared/blocks/harmonium/home.tsx`
- `src/shared/blocks/harmonium/keyboard-page.tsx`

What changed:
- keyboard surfaces now use horizontal scrolling on small screens instead of crushing key widths
- the focused keyboard panel is shown before the control sidebar on mobile
- `/keyboard` keeps safe spacing under the fixed header

### Audio layer
- `src/shared/blocks/harmonium/constants.ts`
- `src/shared/blocks/harmonium/use-harmonium-player.ts`

What changed:
- note definitions were centralized
- playback now attempts real harmonium samples first
- missing sample files fall back to the previous oscillator implementation

### Analytics and GSC
- `src/extensions/analytics/google-search-console.tsx`
- `src/shared/services/analytics.ts`
- `src/app/sitemap.ts`
- `src/shared/services/settings.ts`
- `.env.example`

What changed:
- added `google-site-verification` meta tag support
- added sitemap generation for core public pages
- added admin/env config support for Google Search Console verification and analytics providers

### Template cleanup
- public page messages for blog, pricing, showcases, docs, logs, and chat were rewritten
- `common.json` encoding issue was cleaned up
- `package.json` branding metadata was updated

## Validation Notes

### Mobile and viewport validation
Method:
- code review of responsive layout behavior
- layout inspection after introducing `overflow-x-auto` and `min-w-*` safeguards
- production build verification

Limitations:
- no automated browser emulator screenshots were captured in this pass
- final touch verification on a real phone is still recommended

### Audio validation
Method:
- verified sample lookup and oscillator fallback code paths compile

Limitations:
- no real harmonium sample files exist in the repo yet
- sampled playback cannot be audibly confirmed until files are added under `public/audio/harmonium/`

## Follow-up

Recommended next checks:
1. Add one licensed sample file and confirm sampled playback on `/keyboard`.
2. Test the keyboard route on an actual phone.
3. Enter a real `GOOGLE_SITE_VERIFICATION` token and verify ownership in Search Console.
4. Enable one analytics provider and confirm page-view events after deploy.
