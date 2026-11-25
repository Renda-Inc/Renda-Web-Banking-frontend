# AGENTS.md

Working notes for anyone building on this project.

## History

This project was started in a hosted editor and moved to standalone
development on 2026-11-24. The editor is disconnected: nothing in the repo
depends on it, and the build runs on the plain Vite config in `vite.config.ts`. Work happens
directly on the `main` branch in
Renda-Inc/Renda-Web-Banking-frontend. The original source repo (first-remix-of-renda-web-individuals) was deleted
on GitHub on 2026-11-24 after the move, and no copy of it is retained.
This repo is the only Renda Web Banking codebase.

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

## Design foundation (user direction, 2026-11-24)

- Thesis: Revolut web meets the Apertra/Airbnb philosophy. Warm off-white
  canvas, content as large-radius white cards with soft shadows, hairlines
  only as genuine dividers, real faces and photos for people and goals,
  pill controls, generous spacing. Never KPI tiles, dense tables or admin
  styling; this is a consumer product for regular folks, it needs emotion.
- Type: SF Pro for UI and data; SF Pro Rounded (`font-display`) for
  greetings, page titles and Alfie's voice. No webfont stand-ins.
- Dark mode base is #1E1E1E (cards #262626, surfaces #2C2C2C), neutral, no
  blue tint.
- Layout: the side nav rail stays exactly as it is. The banking canvas sits
  left, next to the rail; the Alfie panel is a wide workspace (432px),
  not a thin chat strip.
- Sequence: design the individual banking side first, to the user's
  satisfaction, then apply the same foundation to business banking.
  Business mode and data stay in the code, undesigned, until then.
- Account names are "Smart Spend" and "Sense Save" (two words).

## Full redesign v2 (user approved, 2026-11-24)

The user approved Muse's full-redesign proposal ("Alfie's home, money
lives in it") and it was built the same night:

- Overview: Alfie's brief is the hero for individuals, plain-language
  sentences with inline actions; confirming an action shows a receipt in
  place ("Done. $74 is on its way to Sense Save."). The statistics
  snapshot is business-only now.
- Alfie panel is a working surface: brief, an action with an in-panel
  receipt, a "This week" watch list, earlier items, prompts, composer.
- Finance: Smart Spend is a dark hero card; Statistics is one calm panel
  of plain numbers (Money in / Money out / All movement), the coloured
  stat tiles are gone; subscriptions are soft hover rows.
- Goals: cards stand on the canvas (no wrapper panel), photo-first, each
  with one Alfie sentence under the progress bar.
- Insights is now "This week with Alfie", a story page, not charts.
- Entry: one Log In button (individual), an Alfie line under it, and
  Business Banking as a quiet text link.
- Persona is consistent: Angels Adeyemi, angels@renda.ca, initials AA
  everywhere (finance data, cards, nav rail).

## Business side designed (user direction, 2026-11-24)

The business side is now designed to the same foundation, in the same
app and mode system (the user asked for the business banking side built
out with "the other business stuff from the original", plus a Business
Banking button back on the entry screen):

- Entry: Log In (individual) and Business Banking are both proper
  buttons again; the Alfie line sits under them.
- Business Overview: Alfie's brief is the hero for Northline Studio too
  (revenue ahead of forecast, payroll covered, GST due in 12 days) with
  the Move $8,400 to Tax Reserve action and in-place receipt. The old
  statistics snapshot section is gone for both modes.
- SmartReserve goals: standalone cards, one Alfie sentence per reserve.
- Expenses summary is one calm panel of plain numbers, not tiles.
- Expenses, Taxes and Books: left-aligned canvas, SF Pro Rounded
  titles, same panel language. Business Finance and team Cards inherit
  the v2 treatment (dark first account card, plain statistics).

## Business suite navigation (user decision, 2026-11-24)

Expenses, Books and Tax Readiness are NOT in the side rail. The rail's
business utility icons were removed entirely. The suite is a floating dock: a dark pill bar (Expenses / Books /
Tax Readiness, active one white) stuck to the bottom of the banking
column on EVERY business screen, rendered by the app shell after the
Outlet. The user chose the dock over an in-flow top bar because a top
bar made business page headers sit lower than individual ones; the dock
takes no layout space, so headers align exactly across modes. A slide-in suite drawer was mocked and rejected by the user (it
also rendered broken: fixed-position elements inside the pages' animated
`rise` container get positioned against that container, not the
viewport). Do not re-add rail icons for these screens.
