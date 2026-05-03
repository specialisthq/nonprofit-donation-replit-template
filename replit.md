# Workspace

## Overview

A frontend-only pnpm workspace monorepo with **two artifacts** that share the same donation-funnel codebase but serve different audiences:

1. **`artifacts/donation-site/`** — the pristine, public template at preview path **`/template`**. This is what lives on GitHub at <https://github.com/specialisthq/nonprofit-donation-replit-template> for any nonprofit to clone. Its footer carries a "Clone this site on Replit" link (driven by `site.cloneCta` in `site.config.ts`).
2. **`artifacts/friends-of-mag-library/`** — the user's live nonprofit site at preview path **`/`**. It started as a copy of the template and is **git-ignored** (see `.gitignore`) so the live site never leaks into the public template repo. Its `cloneCta.enabled` is `false`, so no clone link appears in its footer.

Cloners (and the live-site maintainer) customize one file per artifact (`site.config.ts`) — org info, EIN, suggested amounts, brand colors, page copy, FAQs, legal-page text, and PayPal hosted-button ID. Donations route to a PayPal hosted donate button; there is no backend.

For everything a cloner needs to know to ship their own site (PayPal setup, image guidelines, deploy, compliance checklist), see **`README.md`** at the repo root.

### Git workflow for this dual layout

- The git remote `origin` should point at <https://github.com/specialisthq/nonprofit-donation-replit-template>. Only the template (`artifacts/donation-site/`) is committed; `artifacts/friends-of-mag-library/` is in `.gitignore` and never pushed.
- To propagate template improvements into the live site, copy the changed files manually from `artifacts/donation-site/` into `artifacts/friends-of-mag-library/`. The two artifacts are independent copies on purpose.
- If `git remote -v` does not yet show `origin` pointing at the template repo, run `git remote set-url origin https://github.com/specialisthq/nonprofit-donation-replit-template` (or `git remote add origin …` if missing) before your first push.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite, `react-router-dom` for routing
- **Styling**: Tailwind CSS v4, CSS custom properties driven by `site.config.ts`
- **UI primitives**: Radix UI (accordion), lucide-react icons
- **Tests**: Vitest + Testing Library
- **Payments**: PayPal hosted donation button (cloner-configured, no server-side processing)

## Project structure

- `artifacts/donation-site/` — public template (React + Vite), preview path `/template`. Tracked in git.
- `artifacts/friends-of-mag-library/` — live Friends of MAG Library site (React + Vite), preview path `/`. **Git-ignored.** A direct copy of the template with `cloneCta.enabled = false` and a TODO comment in `site.config.ts` flagging the placeholder values to replace. Same source layout as below.
- `artifacts/donation-site/` source layout (mirrored in friends-of-mag-library):
  - `site.config.ts` — strongly-typed single source of truth for org info, branding, copy, PayPal config, suggested amounts, FAQs, legal pages, and feature flags. **The only file most cloners need to edit.**
  - `src/main.tsx` — applies theme tokens from `site.config.ts` to `:root` at boot.
  - `src/App.tsx` — react-router routes for all ten pages.
  - `src/components/`
    - `site-layout.tsx` — shared chrome (utility trust bar, header with mobile drawer, footer with config-driven legal links).
    - `primitives.tsx` — `Section`, `Container`, `Heading`, `Prose`, `Card`.
    - `button.tsx` — `Button`, `ButtonLink` with primary/accent/secondary/ghost/outline variants.
    - `accordion.tsx` — Radix-based accordion for FAQs.
    - `donation-module.tsx` — controlled donation form (one-time/monthly toggle, preset + custom amounts, dynamic CTA, trust microcopy with optional internal links).
    - `sticky-mobile-cta.tsx` — bottom-anchored mobile CTA bar that appears once the user scrolls past the donation module.
    - `legal-page-view.tsx` — shared renderer for every legal page; handles `{token}` interpolation, internal-vs-external link rendering (internal links use react-router `<Link>`), and an optional disclaimer-banner override.
    - `legal-disclaimer.tsx` — shared banner with optional `override` prop for lighter-wording variants.
  - `src/lib/paypal.ts` — `buildDonateUrl()` and `donateLinkProps()` helpers that read PayPal config.
  - `src/pages/`
    - `landing.tsx` — full landing funnel: hero with donation module, trust strip, impact proof, story block, gift-impact tiers, FAQ, secondary giving, final CTA.
    - `thank-you.tsx` — post-donation page with what-happens-next, monthly upsell deep-link, and social-share intent.
    - `about.tsx`, `impact.tsx`, `transparency.tsx`, `contact.tsx` — content pages.
    - `privacy.tsx`, `terms.tsx`, `refund-policy.tsx`, `donor-bill-of-rights.tsx` — legal pages, all built on `<LegalPageView />`.
    - `not-found.tsx` — 404.
  - `public/` — `hero.webp`, `story.webp`, `favicon.svg`, `opengraph.jpg` (cloners replace).
  - `src/test/` — Vitest suite (188 tests across 11 files covering donation module, FAQ, sticky CTA, PayPal URL builder, landing flow, thank-you, transparency, contact, refund policy, donor bill of rights, and the footer cloneCta link). The live `friends-of-mag-library` artifact mirrors the same test files.
- `scripts/` — workspace tooling.
- `README.md` — cloner-facing documentation.

## Routes

`/`, `/thank-you`, `/about`, `/impact`, `/transparency`, `/contact`, `/privacy`, `/terms`, `/refund-policy`, `/donor-bill-of-rights`

## Key Commands

- `pnpm install` — install workspace dependencies.
- `pnpm run typecheck` — typecheck all artifacts and scripts.
- `pnpm run build` — typecheck + build all packages.
- `pnpm --filter @workspace/donation-site dev` — run the template dev server (mounted at `/template`).
- `pnpm --filter @workspace/donation-site run test` — run the template Vitest suite.
- `pnpm --filter @workspace/donation-site run build` — template production build (Vite).
- `pnpm --filter @workspace/friends-of-mag-library dev` — run the live site dev server (mounted at `/`).
- `pnpm --filter @workspace/friends-of-mag-library run test` — run the live site Vitest suite.
- `pnpm --filter @workspace/friends-of-mag-library run build` — live site production build (Vite).

## Cloning this template

See **`README.md`** at the repo root for the full cloner walkthrough — prerequisites, 5-step quick start, a guided tour of every section in `site.config.ts`, PayPal setup, image guidelines, compliance checklist, recommended next steps, and deployment instructions.

For workspace conventions, see the `pnpm-workspace` skill; for the artifact pattern, the `react-vite` skill.
