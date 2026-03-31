# Play Web Harmonium

Play Web Harmonium is a browser-based **Web Harmonium** built for daily practice. It helps users play Web Harmonium online with keyboard shortcuts, touch controls, Sargam labels, octave switching, transpose, and beginner-friendly guides.

[Visit Website](https://playharmonium.com/) | [Open Keyboard](https://playharmonium.com/keyboard) | [Read the Blog](https://playharmonium.com/blog)

## Why This Project Exists

People searching for **Web Harmonium** usually want a playable instrument in the browser, not a gated SaaS homepage. This project is designed to match that intent: load fast, let people start playing immediately, and support the tool with SEO-friendly educational content.

## What You Can Do

- Play Web Harmonium online without installing software
- Use keyboard shortcuts or touch controls
- Switch between Sargam and Western note labels
- Adjust octave, transpose, and volume in the browser
- Read Web Harmonium guides and beginner articles
- Extend the project later with auth, pricing, admin, and premium features

## Product Pages

- Homepage: [https://playharmonium.com/](https://playharmonium.com/)
- Keyboard page: [https://playharmonium.com/keyboard](https://playharmonium.com/keyboard)
- Blog: [https://playharmonium.com/blog](https://playharmonium.com/blog)

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- next-intl
- Drizzle ORM
- PostgreSQL
- Tailwind CSS

## Local Development

1. Install dependencies with `pnpm install`
2. Start PostgreSQL and set `DATABASE_URL`
3. Run `pnpm db:push`
4. Seed defaults with `pnpm rbac:init` and `pnpm config:init`
5. Start the app with `pnpm dev`

## Deployment

- Production domain: [playharmonium.com](https://playharmonium.com)
- GitHub repository: [bikai9289/Harmonium](https://github.com/bikai9289/Harmonium)
- Recommended hosting: Vercel

## Docs

Project planning, setup notes, and test logs live under [`doc/`](./doc).
