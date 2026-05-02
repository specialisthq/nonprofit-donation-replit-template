# Workspace

## Overview

A frontend-only pnpm workspace monorepo containing a clonable nonprofit donation funnel template. The template is a single `react-vite` artifact at `/`. Cloners customize their site by editing one file (`artifacts/donation-site/site.config.ts`) — org info, EIN, suggested amounts, brand colors, copy, and PayPal hosted-button ID. Donations route to a PayPal hosted donate button; no backend is required.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite, `react-router-dom` for routing
- **Styling**: Tailwind CSS v4, CSS custom properties driven by `site.config.ts`
- **Payments**: PayPal hosted donation button (cloner-configured, no server-side processing)

## Project structure

- `artifacts/donation-site/` — the donation site (React + Vite)
  - `site.config.ts` — single source of truth for org info, branding, copy, PayPal config, suggested amounts, FAQs, and feature flags. **This is the only file most cloners need to edit.**
  - `src/components/site-layout.tsx` — shared chrome (utility trust bar, header with mobile drawer, footer)
  - `src/components/primitives.tsx` — `Section`, `Container`, `Heading`, `Prose`, `Card`
  - `src/components/button.tsx` — `Button`, `ButtonLink` with primary/accent/secondary/ghost/outline variants
  - `src/components/accordion.tsx` — Radix-based accordion for FAQs
  - `src/components/donation-module.tsx` — controlled donation form (one-time/monthly toggle, preset + custom amounts, dynamic CTA, trust microcopy)
  - `src/components/sticky-mobile-cta.tsx` — bottom-anchored mobile CTA bar that appears once the user scrolls past the donation module
  - `src/lib/paypal.ts` — `buildDonateUrl()` and `donateLinkProps()` helpers that read PayPal config
  - `src/main.tsx` — applies theme tokens from `site.config.ts` to `:root` at boot
  - `src/pages/landing.tsx` — full landing funnel: hero with donation module, trust strip, impact proof, story block, gift-impact tiers, FAQ, secondary giving, final CTA
  - `src/pages/` — non-landing pages currently render stubs that downstream tasks replace
  - `public/hero.webp`, `public/story.webp` — landing imagery (cloners replace under `/public`)
- `scripts/` — workspace tooling

## Routes

`/`, `/thank-you`, `/about`, `/impact`, `/transparency`, `/contact`, `/privacy`, `/terms`, `/refund-policy`, `/donor-bill-of-rights`

## Key Commands

- `pnpm install` — install workspace dependencies
- `pnpm run typecheck` — typecheck all artifacts and scripts
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/donation-site run test` — run the donation-site Vitest suite (donation module, FAQ, trust strip, sticky CTA, PayPal URL builder)

## Cloning this template

After cloning, edit `artifacts/donation-site/site.config.ts`, swap images under `artifacts/donation-site/public/`, set your PayPal hosted-button ID, then publish. A full cloner README is added in the final task of the build.

See the `pnpm-workspace` skill for workspace structure and TypeScript conventions, and the `react-vite` skill for the artifact pattern.
