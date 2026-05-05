# PlayHarmonium

PlayHarmonium is a free web harmonium for browser-based practice. It gives learners a clean keyboard layout with touch controls, computer-key shortcuts, Sargam labels, transpose, and beginner-friendly guides without making them install anything first.

[PlayHarmonium](https://playharmonium.com/) | [Feature overview](https://playharmonium.com/#features)

![PlayHarmonium keyboard preview](public/github-preview.png)

## Why This Project Exists

Most people searching for an online harmonium want to start playing right away, not land on a generic marketing page. This project keeps the instrument front and center while still supporting tutorials, blog content, and future product expansion.

## What You Can Do

- Play a full browser harmonium without installing software
- Use touch controls, keyboard shortcuts, or Web MIDI input
- Switch between Sargam and western note labels
- Adjust octave, transpose, and volume for daily practice
- Open a focused keyboard page for distraction-free sessions
- Read beginner guides that explain notes, layout, and practice flow

## Product Pages

- Website: [https://playharmonium.com/](https://playharmonium.com/)
- Keyboard page: [https://playharmonium.com/keyboard](https://playharmonium.com/keyboard)
- Beginner guide: [https://playharmonium.com/blog/harmonium-keyboard-notes-for-beginners](https://playharmonium.com/blog/harmonium-keyboard-notes-for-beginners)
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

### Requirements

- Node.js 20 or newer
- pnpm 10.33.0, matching the `packageManager` field
- PostgreSQL for the default database setup

Enable pnpm through Corepack if it is not already available:

```bash
corepack enable
corepack prepare pnpm@10.33.0 --activate
```

### Install And Run

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

   Then update `DATABASE_URL` and generate a real auth secret:

   ```bash
   openssl rand -base64 32
   ```

3. Start PostgreSQL and create the database named in `DATABASE_URL`.

4. Push the Drizzle schema:

   ```bash
   pnpm db:push
   ```

5. Seed required defaults:

   ```bash
   pnpm rbac:init
   pnpm config:init
   ```

6. Start the development server:

   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000).

### Useful Commands

- `pnpm lint` checks the codebase with ESLint.
- `pnpm build` creates a production build.
- `pnpm start` serves the production build after `pnpm build`.
- `pnpm db:studio` opens Drizzle Studio for local database inspection.

### Troubleshooting

- If install fails after switching branches, remove `node_modules` and run `pnpm install` again.
- If the app cannot connect to the database, confirm PostgreSQL is running and `DATABASE_URL` points to an existing database.
- If auth-related pages fail locally, confirm `AUTH_SECRET` is set before starting `pnpm dev`.

## Deployment

- Production domain: [playharmonium.com](https://playharmonium.com)
- GitHub repository: [bikai9289/Harmonium](https://github.com/bikai9289/Harmonium)
- Recommended hosting: Vercel
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`

Set the same production environment variables in Vercel, especially `NEXT_PUBLIC_APP_URL`, `DATABASE_PROVIDER`, `DATABASE_URL`, and `AUTH_SECRET`.

## Docs

Project planning, setup notes, and test logs live under `doc/` locally and are not committed to this repository.
