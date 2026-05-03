# Nonprofit Donation Funnel — Clonable Template

A frontend-only, single-config nonprofit donation site you can clone, fill in, and publish in an afternoon. Built with React + Vite. Donations route to a PayPal hosted donate button — there is no server to run, no database to set up, and no payment integration to maintain. Cloners customize **one file** (`artifacts/donation-site/site.config.ts`) and replace a couple of images.

> **How this template is developed.** The repo you're looking at is the public template (`artifacts/donation-site/`, preview path `/template`). The maintainer also runs a second artifact in the same Replit project — `artifacts/friends-of-mag-library/` at preview path `/` — which is their own live nonprofit site, started from this template. That second artifact is `.gitignore`d so it never lands in this public repo; only the generic template is pushed to GitHub. If you clone this template, you'll get just `artifacts/donation-site/` and you're free to either edit it in place or copy it into a new artifact of your own and gitignore the original.

The template ships ten pages — landing, thank-you, about, impact, transparency, contact, privacy, terms, refund/correction policy, and the standard Donor Bill of Rights — plus a fully accessible donation module, a sticky mobile CTA, FAQ accordion, donor testimonials slot, charity-rating badges slot, and a deep-linkable amount preselect (so an "I'll give $50" email link can preselect $50 on the landing page).

> **Preview**: open the project in Replit; the template renders in the preview pane at the **`/template`** path (the `/` path is reserved for the maintainer's own live site, which is git-ignored). The demo is themed as a fictional community fund called "Brightwell Community Fund" so you can see what every section looks like before you put your own copy in. If you cloned the template into a fresh project of your own, the template lives at `/` by default — just check your artifact's `previewPath` in `artifacts/donation-site/.replit-artifact/artifact.toml`.

---

## Prerequisites

1. A **Replit account** (free tier is fine for development — pick a paid plan for production hosting and custom domains).
2. A **PayPal Donate hosted button** for your nonprofit. Create one here:
   <https://www.paypal.com/donate/buttons> (you must have a verified PayPal nonprofit account; PayPal walks you through the 501(c)(3) verification).
3. Two images: a hero image (1600×900 minimum) and an optional supporting image (1200×800). WebP or AVIF preferred. See the **Image guidelines** section below.

That's it. No API keys, no database, no third-party integrations are required to ship the donation funnel itself.

---

## Quick start (5 steps)

1. **Get the code.** Either fork this repo on GitHub and import it into Replit, or click **Use Template** in Replit and start from a fresh copy.
2. **Edit `artifacts/donation-site/site.config.ts`.** Set your org name, EIN, contact email, PayPal hosted-button ID, suggested amounts, brand colors, and copy. See **Editing your content** below for a guided walkthrough of every section.
3. **Swap the demo images** in `artifacts/donation-site/public/` — replace `hero.webp` and `story.webp` with your own. Keep the same filenames or update the `branding.heroImagePath` / `branding.supportingImagePaths` paths in config.
4. **Run the dev preview.** Open the project in Replit and the `artifacts/donation-site: web` workflow runs automatically; the template will be visible in the preview pane (at `/template` in this dual-artifact project, or at `/` in a fresh clone). From the command line, you can also run `pnpm install` followed by `pnpm --filter @workspace/donation-site dev`.
5. **Deploy.** Click the **Publish** button in Replit. Once it's live, point your custom domain at the deployed URL (see **Deploying** below).

---

## Editing your content

Almost every visible word, color, image path, dollar amount, FAQ entry, board member name, financial figure, and legal-page paragraph lives in **`artifacts/donation-site/site.config.ts`**. The file is one large strongly-typed object. TypeScript will catch mistakes (missing fields, wrong shape, typos in icon names) the moment you save.

The top-level shape:

```ts
export const site: SiteConfig = {
  org:        { /* your nonprofit's identity */ },
  paypal:     { /* hosted-button ID + flow mode */ },
  amounts:    { /* one-time and monthly suggested amounts */ },
  branding:   { /* colors, logo, hero image */ },
  typography: { /* optional font families */ },
  copy:       { /* page-by-page text content */ },
  social:     { /* optional social links */ },
  features:   { /* feature flags */ },
};
```

### `org` — your nonprofit's identity

| Field | Example | Notes |
| ----- | ------- | ----- |
| `name` | `"Brightwell Community Fund"` | Used in the header, footer, page titles, legal-page intros, and donor receipts. |
| `shortName` | `"Brightwell"` | Shown in tighter spaces (e.g. mobile header). |
| `tagline` | `"Neighbors helping neighbors thrive."` | Optional one-line tagline. |
| `missionOneLiner` | `"We fund local programs that…"` | A single-sentence mission statement used in metadata and intro copy. |
| `ein` | `"12-3456789"` | Your real US EIN. Shown in the trust bar and on legal pages. |
| `foundedYear` | `2014` | Drives "since YYYY" copy where relevant. |
| `address` | `{ line1, city, state, zip, country }` | US-format mailing address. |
| `contactEmail` | `"hello@yourorg.org"` | Used everywhere a contact link or `mailto:` appears, including legal-page contact slots. |
| `phone` | `"(555) 123-4567"` | Optional. |
| `siteUrl` | `"https://give.yourorg.org"` | Optional canonical URL. Used by the thank-you page's social-share intent so the link works under your custom domain. Falls back to `window.location.origin` if omitted. |

### `paypal` — payment routing

```ts
paypal: {
  hostedButtonId: "REPLACE_WITH_YOUR_BUTTON_ID",
  flowMode: "newTab",      // or "sameTab"
  returnUrl: undefined,    // optional — see PayPal setup below
},
```

- **`hostedButtonId`** is the only required value. See **PayPal setup** below for how to find it.
- **`flowMode`**:
  - `"newTab"` opens PayPal in a new browser tab and leaves your site visible in the original tab. Recommended for most cloners — donors can return to your thank-you page manually.
  - `"sameTab"` redirects the donor's current tab to PayPal. Use this only if you've configured a `returnUrl` so PayPal can send the donor back to your `/thank-you` page after the donation completes.
- **`returnUrl`** is optional but recommended for a seamless flow. Set it to `"https://yourdomain.org/thank-you"` after you deploy, then configure the same URL inside your PayPal hosted button's settings.

### `amounts` — suggested amounts and impact labels

```ts
amounts: {
  oneTime: [
    { amount: 25,  impactLabel: "Stocks a family's pantry for a week" },
    { amount: 50,  impactLabel: "Funds one after-school session", default: true },
    { amount: 100, impactLabel: "Provides emergency rent assistance" },
    { amount: 250, impactLabel: "Sponsors a child for a month" },
    { amount: 500, impactLabel: "Supports a delivery route" },
  ],
  monthly: [ /* same shape, smaller amounts */ ],
},
```

- Use **4–6** preset amounts per mode.
- Use **smaller** amounts for monthly than for one-time.
- Mark exactly one amount per mode with `default: true` — that's the visually highlighted option.
- Impact labels should be **concrete and defensible**. Avoid vague tiers like "Bronze donor".

### `branding` — colors, logo, hero image

Colors are HSL triplets so they slot directly into Tailwind's `hsl(var(--token))` pattern. Pick from any color tool (Coolors, Paletton, etc.) and convert to HSL.

```ts
branding: {
  colors: {
    primary:            "176 64% 26%",  // your main CTA + brand color
    primaryForeground:  "40 40% 98%",   // text color on top of primary
    accent:             "32 92% 52%",   // optional accent (e.g. trust bar)
    accentForeground:   "30 60% 12%",
    surface:            "40 40% 99%",   // page background
    surfaceMuted:       "40 30% 96%",   // alternating section background
    text:               "200 22% 12%",  // body text
    textMuted:          "200 12% 38%",  // subtitles, captions
    border:             "200 16% 88%",
  },
  logoPath: "/logo.svg",                // under /public
  heroImagePath: "/hero.webp",
  supportingImagePaths: ["/story.webp"],
},
```

> **Before / after.** To rebrand from teal to deep blue, change `primary` from `"176 64% 26%"` to `"222 60% 28%"` and `primaryForeground` stays. Reload — every button, link, and CTA on every page updates. No CSS edits required.

### `copy` — page-by-page text content

`copy` is broken down per page (`landing`, `thankYou`, `about`, `impact`, `transparency`, `contact`, plus the legal pages under `copy.legal`). Each page exposes only the fields you'd actually want to edit:

- **`copy.landing`**: hero headline + subhead, eyebrow, case for support (3–4 short sentences), donation-module text, trust-strip items, charity-rating badges, story block, gift-impact tier copy, FAQ items, secondary giving (DAF / matching gifts / planned giving), final CTA.
- **`copy.thankYou`**: warm thank-you headline, what-happens-next list, share message + URL token, monthly upsell deep-link.
- **`copy.about`**: founding story, leadership team, partners, milestones.
- **`copy.impact`**: hero metrics, beneficiary stories, budget breakdown, gift-impact tiers (each tier deep-links back to landing with the right amount preselected via `?amount=NN&mode=oneTime|monthly`).
- **`copy.transparency`**: financial summary, links to your annual report and IRS Form 990, board roster.
- **`copy.contact`**: contact intro, addresses, contact methods.
- **`copy.legal`**: `disclaimer` and `disclaimerLight` banner wording, `governingState`, plus `privacy`, `terms`, `refundPolicy`, and `donorBillOfRights`. Each legal page is a `LegalPageCopy` with `title`, `lastUpdated`, `intro`, and an array of `sections`. Sections support `body` paragraphs, `bullets`, and `links`. **Tokens** like `{orgName}`, `{contactEmail}`, `{ein}`, and `{state}` interpolate automatically — write them in your config and they'll be substituted at render time.

### `social`, `analyticsHeadHtml`, and `features`

- `social`: optional `twitter`, `facebook`, `instagram`, `linkedin`, `youtube` links — shown in the footer.
- `analyticsHeadHtml`: optional raw HTML snippet (e.g. a Plausible or GA4 script tag) injected into `<head>`. Leave undefined to ship without analytics.
- `features`: feature flags to toggle the sticky mobile CTA, the FAQ section, the testimonial slot, etc.

---

## PayPal setup

1. Go to <https://www.paypal.com/donate/buttons> while signed in to your nonprofit PayPal account.
2. Click **Create Button**, choose **Donations**, and fill in your organization name and (optionally) preset amounts.
3. Under **Step 3: Customize advanced features**, set:
   - **Take donors to this URL when they finish**: `https://yourdomain.org/thank-you`
   - **Take donors to this URL when they cancel**: `https://yourdomain.org/`
4. Click **Save Changes**, then **Create Button**.
5. On the resulting page, switch to the **Email** tab. The button ID is the long alphanumeric string at the end of the donation URL (after `hosted_button_id=`). Copy it.
6. Paste it into `site.config.ts`:

   ```ts
   paypal: {
     hostedButtonId: "YOUR_BUTTON_ID_HERE",
     flowMode: "newTab",
     returnUrl: "https://yourdomain.org/thank-you", // optional but recommended
   },
   ```

7. **Switching new-tab vs same-tab**: change `flowMode` to `"sameTab"` if you want PayPal to take over the current tab. Same-tab is only a good experience if `returnUrl` is set, because otherwise donors land on PayPal's generic "thanks" page instead of yours.

---

## Image guidelines

| Slot | Recommended size | Format | Target file size |
| ---- | ---------------- | ------ | ---------------- |
| Hero image | 1600×900 (16:9) | WebP or AVIF | < 250–400 KB |
| Mobile hero crop | 1080×1350 (4:5) | WebP or AVIF | < 250 KB |
| Supporting / story | 1200×800 | WebP or AVIF | < 200 KB |
| Logo | SVG (preferred) or 512×512 PNG | SVG / PNG | < 30 KB |
| Open Graph share image | 1200×630 | JPG or PNG | < 300 KB |

To swap images:

1. Drop your file into `artifacts/donation-site/public/` (e.g. `public/hero.webp`).
2. Either keep the existing filenames in config or update `branding.heroImagePath`, `branding.supportingImagePaths`, and `branding.logoPath`.

Choose imagery that shows **one** clear beneficiary (a person, family, animal, or single project) — not a collage. Hopeful, direct, humane, never exploitative. Compress aggressively before uploading.

---

## Compliance checklist

Every legal page in this template is a **starter** — sensible defaults for a small US-based 501(c)(3), but every nonprofit's situation is different. Before you publish, **have your own counsel review and tailor**:

- [ ] **Privacy Policy** (`/privacy`) — review what data you actually collect, how you use it, retention, and donor rights in your state. Update `copy.legal.privacy` accordingly.
- [ ] **Terms of Use** (`/terms`) — review the governing-law clause (`copy.legal.governingState`), liability terms, and acceptable-use language for your jurisdiction.
- [ ] **Refund / Correction Policy** (`/refund-policy`) — review the refund window, the chargeback language, and the monthly-cancellation instructions to make sure they match your actual operations.
- [ ] **Donor Bill of Rights** (`/donor-bill-of-rights`) — the standard sector-wide ten-point Donor Bill of Rights. Reproduced as-is from AFP / AHP / CASE / Giving Institute. Review the "How we live this out" closing section to make sure each commitment is one you can actually keep.
- [ ] Update **`copy.legal.disclaimer`** and **`copy.legal.disclaimerLight`** banners (they currently say "starter template"). Once your counsel has reviewed the pages and you're confident in the language, you may want to soften or remove the banners for production.
- [ ] Confirm the **Last updated** date on every legal page.
- [ ] If you use **cookies**, **analytics**, or **third-party trackers**, add a cookie-consent banner (see Recommended next steps).

---

## Recommended next steps

These are not required to ship the donation funnel, but most production nonprofit sites add them eventually:

- **Analytics.** Drop a GA4 or Plausible snippet into `site.analyticsHeadHtml`. Both render into `<head>` automatically.
- **Newsletter integration.** The contact page has a newsletter slot. Wire it to Mailchimp, Buttondown, ConvertKit, etc. by replacing the form's `action`.
- **A/B testing.** Try defaulting to monthly vs one-time, different headline copy, different default amounts. The config-driven design makes this safe.
- **Contact form provider.** The contact form is a `mailto:` link by default. For a real form-submission flow, plug in Formspree, Basin, Web3Forms, or a serverless function.
- **Cookie consent banner.** If you add analytics or trackers, add a consent banner (Klaro, Cookiebot, Osano).
- **Social-share images.** Replace `public/opengraph.jpg` with a branded OG image so links shared on Facebook / LinkedIn / Slack look polished.

---

## Deploying

This template is deployed via **Replit Deployments**:

1. In the Replit workspace, click **Publish** (top-right).
2. Choose **Autoscale** or **Static** (this site is fully static, so Static is cheaper and faster).
3. Replit builds the site and gives you a `*.replit.app` URL. Open it to confirm everything works.
4. **Custom domain.** In the Deployment settings, click **Add custom domain** and follow the DNS instructions. Replit handles HTTPS automatically.
5. After your custom domain is live, update `org.siteUrl` in `site.config.ts` and the `returnUrl` inside your PayPal hosted button settings.

---

## Known limitations

- **No backend.** Donations are processed entirely by PayPal. The template does not store donor data, send email receipts (PayPal does that), or maintain a CRM. Wire those up separately if you need them.
- **PayPal hosted button only.** This template intentionally doesn't integrate Stripe, Apple Pay, Google Pay, Venmo (outside of PayPal's checkout), or wallet buttons directly on-page. PayPal's hosted checkout will surface those wallet options on PayPal's own page if your account supports them.
- **Contact form is a `mailto:` link.** No server-side form handling is included. See **Recommended next steps**.
- **Single language.** No i18n is wired up. Translate `site.config.ts` and duplicate routes if you need multiple languages.
- **Demo content is illustrative.** Org name, financial figures, board members, and impact stats are placeholders. Replace every value before publishing.

---

## QA pass summary (template release)

Before this template was published, the following checks were run against the demo content:

- **Build**: `pnpm run build` succeeds. Production bundle ~411 KB JS / 61 KB CSS, no TypeScript errors, no console errors in the production preview.
- **Tests**: 186 Vitest tests across 10 files pass, covering the donation module, FAQ, sticky CTA, PayPal URL builder, and every page (landing, thank-you, transparency, contact, privacy, terms, refund policy, donor bill of rights).
- **Hardcoded-content audit**: no org name, EIN, brand color, or other config-able value is hardcoded in any component or page — every visible value resolves through `site.config.ts`. Verified via repo-wide search.
- **Config-swap test**: changing `org.name` and `branding.colors.primary` propagates everywhere with no leakage.
- **Responsive layout**: landing, donor bill of rights, transparency, contact, and thank-you pages render correctly at 375 px (mobile), 768 px (tablet), and 1280 px (desktop) without horizontal scroll.
- **Navigation**: every header, footer, and inline link works. The deep-link from the impact page (`?amount=NN&mode=oneTime|monthly`) preselects the right amount on landing. The thank-you page's monthly upsell deep-links to landing in monthly mode.
- **Accessibility spot-check**: keyboard navigation through the donation flow and contact form works, focus rings are visible, accordion uses Radix `aria-` attributes, color contrast is WCAG AA on text and buttons.
- **Donation flow integration**: amount selection updates the CTA label, click opens the PayPal URL with the correct amount and target, and the manual `/thank-you` route renders the post-donation page.

Re-run these checks after you customize `site.config.ts` to confirm nothing in your content broke a layout assumption.

## License

MIT — use this template for any nonprofit purpose, commercial or otherwise. Attribution appreciated but not required.
