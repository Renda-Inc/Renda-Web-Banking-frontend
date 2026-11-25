# AGENTS.md

Working notes for anyone building on this project.

## History

This project was started in a hosted editor and moved to standalone
development on 2026-11-24. The editor is disconnected: nothing in the repo
depends on it, and the build runs on the plain Vite config in `vite.config.ts`. Work happens
directly on the `main` branch in
Renda-Inc/Renda-Web-Banking-frontend. The original source repo (first-remix-of-renda-web-individuals) was deleted
on GitHub on 2026-11-24 after the move; a local backup sits in
~/workspace/backups/ outside this repo. Do not build there.

## Architecture

- TanStack Start (React 19) with file-based routing. Routes live in
  `src/routes/`: `index.tsx` is the entry / log in screen, `app.tsx` is the
  authenticated workspace shell, and the workspace pages are
  `app.overview.tsx`, `app.finance.tsx`, `app.goals.tsx`, plus
  `app.cards.tsx`, `app.expenses.tsx`, `app.insights.tsx`, `app.taxes.tsx`
  and `app.books.tsx`. Alfie is the intelligence layer, not a chatbot page.
- Shared Renda components live in `src/components/renda/`; building blocks
  from shadcn/Radix are in `src/components/ui/`.
- `src/server.ts` is the SSR entry and error wrapper; `src/lib/error-capture.ts`
  and `src/lib/error-page.ts` support it. Client errors from the root
  boundary go through `src/lib/error-reporting.ts`.
- Style: white backgrounds, primary dark #111111, brand accent #EB8F00 used
  only as a subtle accent, black primary buttons. Calm, spacious, premium;
  no enterprise dashboard styling, no KPI card grids, no excessive gradients
  or shadows. See README.md for the full design direction.

## Conventions

- Frontend only for now: build pages, flows and interactions with local
  state and sample data. Do NOT build backend services, APIs, databases or
  connectors; critical backend work is reserved for the engineering team.
- No em dashes in user-facing copy.
- Customers are "Renda users", never "Renda people".
- No AI-generated images in deliverables unless the user explicitly asks.

## Deploy

- GitHub Pages auto-deploys on every push to `main` via
  `.github/workflows/pages.yml` (same official Pages actions pattern as the
  Renda Employee Dashboard). Live at
  https://renda-inc.github.io/Renda-Web-Banking-frontend/
- The workflow builds the SPA snapshot with RENDA_WEB_SPA=1 and
  RENDA_WEB_BASE=/Renda-Web-Banking-frontend/ (both read in vite.config.ts),
  stages `.output/public` with index.html and 404.html from `_shell.html`,
  and removes `_headers`. Local dev and server builds leave both unset.
