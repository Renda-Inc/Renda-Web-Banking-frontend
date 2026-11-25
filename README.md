# Renda Web Banking

Renda Web Application

We are building Renda Web, the desktop experience of Renda.

Renda is not a traditional online bank. It is an intelligence-first financial platform built around Alfie, our proprietary financial intelligence system. The web experience should feel like an extension of the mobile app, designed specifically for larger screens while maintaining the same simplicity, warmth, and elegance.

This is not an enterprise dashboard, an admin portal, or a traditional online banking website. We are designing what we believe the future of banking should feel like.

The interface should be calm, intelligent, spacious, and intentionally minimal.

Design Language

Follow the existing Renda design system throughout the application.

Typography: SF Pro Rounded

Primary dark color: #111111

Brand accent: #EB8F00

White backgrounds with generous whitespace

Black primary buttons

Orange used only as subtle accents for icons, highlights, active states, and small interface details

The interface should feel premium without feeling cold.

Avoid excessive gradients, unnecessary shadows, glowing effects, or decorative elements.

Everything should feel purposeful.

Initial Entry Screen

The first screen should not immediately display the application.

Instead, create a welcoming entry page.

Center the content both vertically and horizontally.

Display:

THIS IS RENDA WEB

Below it:

"Your intelligent financial workspace. Access your Renda account securely from any modern browser while enjoying the same intelligence-first experience designed for desktop."

Below the copy, display a single primary black button:

Log In

This should be the only primary action on the screen.

The page should feel calm, elegant, and uncluttered.

When the user clicks Log In, transition into the authenticated web application.

Overall Application Layout

Do not build a traditional dashboard.

Avoid:

Left sidebar navigation

Large KPI cards

Charts everywhere

Analytics-first layouts

Enterprise software styling

Information overload

Instead, design the application like a modern workspace.

Think of the experience as opening a beautiful notebook or operating system rather than opening banking software.

Header

Create a clean, fixed header.

Left

Renda logo.

Center

Primary navigation.

Replace "Home" with Overview.

Navigation should include:

Overview

Finance

Goals

Alfie

These should appear as elegant navigation tabs rather than traditional menu links.

The active page should display a subtle orange underline or indicator.

Right

Display:

Search

Notifications

User avatar

The right side should remain minimal.

Profile Menu

Selecting the user avatar opens a refined dropdown.

Include:

My Profile

My Cards

My Renda Plan

Help

Settings

Log Out

The dropdown should match the premium dropdown menus already used throughout the Renda website.

Rounded corners.

Generous spacing.

Soft shadow.

Elegant transitions.

Main Workspace

Beneath the header should be one large content canvas.

Do not divide the page into dozens of equal cards.

Each page should feel like its own workspace.

Allow generous spacing and breathing room.

The layout should prioritize focus over density.

Overview

The Overview page should act as the user's financial home.

Rather than overwhelming the user with balances, transactions, and charts, the experience should surface only what is most meaningful.

The layout should feel intentional, calm, and intelligent.

Think less "dashboard" and more "personal financial workspace."

Finance

Finance will become the dedicated area for day-to-day banking activity.

Leave space for future functionality while maintaining the same clean design language.

Goals

Goals will become the home for savings goals and financial progress.

The layout should encourage motivation and long-term planning rather than simply displaying numbers.

Alfie

Alfie should be treated differently from every other page.

It is not another feature.

It is the intelligence layer of Renda.

The Alfie page should feel like entering a dedicated workspace where users interact naturally with their financial intelligence assistant.

Avoid designing this like a chatbot.

Instead, create an environment centered around thoughtful conversations, proactive insights, recommendations, and intelligent actions.

This page should become the emotional centerpiece of the application.

Motion

Animations should be subtle and purposeful.

Examples include:

Smooth page transitions

Gentle hover states

Soft fades

Elegant dropdown animations

Avoid flashy motion.

Avoid excessive animations.

Every movement should feel deliberate.

Responsive Behaviour

Design responsively for:

Desktop

Laptop

Tablet

The desktop version should make intelligent use of additional screen space while preserving the simplicity of the mobile experience.

Human-Centered Design

Do not generate a generic AI SaaS interface.

Avoid visual patterns commonly associated with AI-generated dashboards, including:

Uniform card grids

Perfectly symmetrical layouts everywhere

Generic feature boxes

Oversized gradient blobs

Repetitive icon cards

Dense information panels

Template-style dashboards

Instead, create an interface that feels intentionally designed by an experienced product design team.

Use asymmetry where appropriate.

Vary component sizes naturally.

Use generous whitespace to establish rhythm.

Allow sections to breathe.

Create clear visual hierarchy through typography and spacing rather than decoration.

The experience should feel warm, refined, timeless, and unmistakably human.

Inspiration

Draw inspiration from the craftsmanship and restraint of:

Apple

Arc Browser

Mercury

Linear

Notion

Monzo

Do not imitate their layouts directly.

Instead, adopt the same design philosophy:

Clarity over complexity.

Intelligence over information density.

Calm over clutter.

Thoughtful interactions over excessive features.

The final result should feel like the future of personal banking—a desktop experience that is elegant, approachable, and centered on helping people make better financial decisions, not simply manage transactions.

## Development

Renda Web Banking is the desktop web banking experience for Renda customers (individuals). It is a TanStack Start (React 19) app with file-based routing, Tailwind CSS 4 and shadcn/Radix components.

```sh
bun install
bun run dev
```

Build:

```sh
bun run build
```

Routes live in `src/routes/` (see `src/routes/README.md`). The entry screen is `src/routes/index.tsx`; the authenticated workspace is under `src/routes/app.*.tsx` (Overview, Finance, Goals, Alfie, Cards, Expenses, Insights, Taxes, Books).

Frontend only for now: pages, flows and interactions run with local state and sample data. Real banking backend integration is reserved for the engineering team.
