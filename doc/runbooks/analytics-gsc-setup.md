# Analytics and GSC Setup

## Purpose

This runbook explains how to enable Google Search Console verification and optional analytics providers for Web Harmonium.

## Search Console Verification

1. Open Google Search Console and add your site property.
2. Choose the HTML meta tag verification method.
3. Copy the verification token only, not the full `<meta>` element.
4. Save it in one of these places:
   - Admin setting: `google_site_verification`
   - Environment variable: `GOOGLE_SITE_VERIFICATION`
5. Deploy the site and confirm the page source contains:
   - `<meta name="google-site-verification" content="...">`

## Sitemap

The project now exposes a static sitemap at `/sitemap.xml`.

Included routes:
- `/`
- `/keyboard`
- `/blog`
- `/pricing`
- `/showcases`
- `/updates`

After deployment, submit `[app_url]/sitemap.xml` inside Search Console.

## Analytics Providers

Supported config keys:
- `google_analytics_id`
- `clarity_id`
- `plausible_domain`
- `plausible_src`
- `openpanel_client_id`
- `vercel_analytics_enabled`

You can configure them via admin settings or environment variables.

## Recommended First Pass

For the first validation cycle, keep the stack simple:
- enable Google Search Console verification
- enable one analytics provider only
- confirm page views on `/`, `/keyboard`, and `/blog`

## Notes

- Analytics and verification meta tags are injected through the shared analytics service.
- If no sample audio files exist yet, the keyboard will continue to work with oscillator fallback.
