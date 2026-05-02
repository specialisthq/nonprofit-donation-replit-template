# Workspace

## Overview

A frontend-only pnpm workspace monorepo for a clonable nonprofit donation funnel template. The donation site itself is added in the next task as a single `react-vite` artifact at `/`. This template uses a PayPal hosted donation button for payment processing — no backend is required.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (added with the donation-site artifact)
- **Styling**: Tailwind CSS v4
- **Payments**: PayPal hosted donation button (cloner-configured, no server-side processing)

## Key Commands

- `pnpm install` — install workspace dependencies
- `pnpm run typecheck` — typecheck all artifacts and scripts
- `pnpm run build` — typecheck + build all packages

## Cloning this template

Once the donation-site artifact is in place, see the repo-root `README.md` for the cloner-facing setup guide (editing `site.config.ts`, swapping images, configuring the PayPal hosted button, and deploying).

See the `pnpm-workspace` skill for workspace structure and TypeScript conventions.
