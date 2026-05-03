# Donation Site — Replit Template for Nonprofits

A complete, accessible, production-ready donation website for small US-based
501(c)(3) nonprofits. Built with React + Vite + Tailwind, designed to be
forked, configured in a single file (`site.config.ts`), and deployed.

Donations are processed through a **PayPal Donate hosted button**, so you do
not need to run a backend or store payment data yourself.

---

## Quick start (clone from GitHub on Replit)

1. **Import this repo into Replit** — on Replit, click *Create app → Import
   from GitHub* and paste this repository's URL.
2. Replit will install dependencies and start the dev server automatically.
   Open the preview to see the site.
3. Edit `artifacts/donation-site/site.config.ts` — this single file controls
   your org name, EIN, address, colors, copy, suggested amounts, board, FAQ,
   legal pages, etc. There are inline comments throughout marked
   `// CLONER NOTE` to guide you.
4. **Set your PayPal hosted button id** in `site.config.ts`:
   ```ts
   paypal: {
     hostedButtonId: "YOUR_REAL_BUTTON_ID", // replace the placeholder
     ...
   }
   ```
   Get this from <https://www.paypal.com/donate/buttons>. Until you replace
   the placeholder, the dev console will print a warning and donations will
   fail at PayPal.
5. **Set the PayPal button's Return URL** to `https://<your-domain>/thank-you`
   so donors land on the thank-you page after giving.
6. Replace `public/favicon.svg`, `public/hero.webp`, `public/story.webp`, and
   `public/opengraph.jpg` with your own assets.
7. Click **Publish** in Replit to deploy.

---

## What's in the box

- **Pages**: Landing, About, Impact, Transparency, Contact, Thank-you,
  Privacy, Terms, Refund Policy, Donor Bill of Rights, 404.
- **Donation module** with one-time / monthly toggle, suggested amounts,
  custom amount, and trust microcopy.
- **Sticky mobile CTA** that appears after the hero scrolls off.
- **Mailto-based contact form** (no backend required); swap in Formspree,
  Tally, etc. by editing `src/pages/contact.tsx` (search for `EMBED_SLOT`).
- **Legal pages** wired to the same config so updates apply everywhere.
- **186 unit tests** (`pnpm test`) covering every page.

---

## Common tasks

| Task | Where to edit |
| --- | --- |
| Org name, EIN, address, contact info | `site.config.ts` → `org` |
| Brand colors and fonts | `site.config.ts` → `branding`, `typography` |
| Suggested donation amounts and impact labels | `site.config.ts` → `amounts` |
| All page copy (headlines, subheads, body) | `site.config.ts` → `copy` |
| Social links | `site.config.ts` → `social` |
| Show/hide monthly upsell, share, sticky CTA | `site.config.ts` → `features` |
| Drop in analytics (GA, Plausible, etc.) | `site.config.ts` → `analyticsHeadHtml` |
| Add a real backend form | `src/pages/contact.tsx` (`EMBED_SLOT` comment) |

---

## Scripts

Run from `artifacts/donation-site/`:

```bash
pnpm dev         # start the Vite dev server
pnpm build       # production build to dist/public
pnpm serve       # preview the production build
pnpm typecheck   # TypeScript check (no emit)
pnpm test        # run the vitest unit suite
```

---

## A note on the legal pages

The Privacy, Terms, Refund, and Donor Bill of Rights pages are sensible
starting points for a small US-based 501(c)(3) — **they are not legal
advice**. Have your own counsel review and tailor every legal page to your
jurisdiction, programs, and data practices before publishing.
