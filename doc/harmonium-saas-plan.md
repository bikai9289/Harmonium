# Harmonium Project Plan

## Conclusion

This project should not start as a heavy SaaS app.

The best path is:

**SEO tool site in front + light SaaS infrastructure behind it**

That means:

- `/` should sell the value and capture search intent
- `/keyboard` should let users practice immediately
- sign-in, billing, admin, and settings stay available for later monetization
- the first milestone is validation, not subscription revenue

## Product positioning

Recommended positioning:

**The fastest free online harmonium for practice**

Chinese interpretation:

一个打开就能练、适合搜索流量进入、后续可扩展成轻 SaaS 的在线 harmonium 工具站。

## Why not heavy SaaS first

Users searching `web harmonium` or `play harmonium online` usually want:

- immediate access
- no install
- no dashboard friction
- quick playback

They usually do not want:

- account creation before first use
- abstract SaaS marketing copy
- an empty workspace before they hear any sound

So the first product loop should be:

1. user searches
2. lands on `/`
3. clicks into `/keyboard`
4. plays immediately
5. reads guides if needed
6. only later encounters sign-in or paid features

## Site structure

### Public pages

- `/`
  SEO homepage
- `/keyboard`
  focused practice page
- `/blog`
  supporting content
- `/pricing`
  future monetization page
- `/privacy-policy`
- `/terms-of-service`

### Reused template capabilities

- auth
- admin
- settings
- billing
- blog/content
- SEO metadata

## Data strategy

For the current MVP:

- no login required for core playback
- settings stored in local storage
- database used for auth, admin, and future SaaS features

This keeps the first-use experience fast while still preserving the template's longer-term value.

## MVP feature scope

### Must have

- clickable keyboard
- physical keyboard mapping
- touch support
- volume control
- octave switch
- transpose
- Western / Sargam labels
- homepage + keyboard page split
- basic supporting blog content

### Should come next

- sampled harmonium sound
- mobile tuning
- analytics
- Search Console setup
- stronger internal linking

### Later

- MIDI
- recording
- saved user presets
- lesson / guided practice modes
- premium content or Pro features

## SEO strategy

### Main keywords

- `web harmonium`
- `online harmonium`
- `play harmonium online`

### Supporting keywords

- `harmonium keyboard notes`
- `virtual harmonium`
- `sargam notes harmonium`
- `how to play harmonium online`

### Content strategy

Start with a small number of strong pages:

- homepage
- keyboard page
- 2 supporting guides

Then expand only after Search Console and engagement data justify it.

## Monetization

Do not rush monetization before traffic and retention are validated.

Possible later models:

- Pro subscription
- one-time premium practice packs
- lesson packs
- better instrument sounds
- saved presets / recording export

## Recommended execution order

1. ship a clear homepage
2. ship a real `/keyboard` practice route
3. verify auth/admin/RBAC foundations
4. publish two supporting SEO articles
5. connect analytics and GSC
6. improve sound quality
7. only then consider premium features

## Current project truth

As of now, the repo already has:

- custom homepage
- dedicated `/keyboard`
- initial blog posts
- RBAC initialized
- default config initialized
- admin path tested
- auth sign-up / sign-in tested

So the project has already moved beyond planning and into execution.
