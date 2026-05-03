# Nonprofit Donation Site — Free Replit Template

A complete, ready-to-launch donation website for small nonprofits. Clone it on Replit, fill in your organization's details in one file, swap a couple of images, and publish. No coding background required, no servers to run, no databases to manage. Donations go straight to your **PayPal Donate** button.

The template ships with everything a small 501(c)(3) usually needs:

- A landing page with a built-in donation module (one-time and monthly, suggested amounts, custom amount)
- Thank-you, About, Impact, Transparency, and Contact pages
- Standard legal pages (Privacy, Terms, Refund/Correction Policy, Donor Bill of Rights)
- A sticky "Donate" bar on mobile, an FAQ section, donor-trust badges, and a fully accessible design

A live demo is themed as a fictional charity called **"Brightwell Community Fund"** so you can see what every section looks like before you put your own words and images in.

---

## Who this is for

- Small US-based 501(c)(3) nonprofits that want a polished donation site without hiring a developer
- Volunteers or board members comfortable editing text in a single file
- Anyone who already has a **PayPal Donate** button (or is willing to set one up — it's free)

---

## What you'll need before you start

1. A free **Replit account** — sign up at <https://replit.com>. The free plan is fine while you build; you'll want a paid plan to publish with a custom domain.
2. A **PayPal Donate hosted button** for your nonprofit. Create one for free at <https://www.paypal.com/donate/buttons>. PayPal will walk you through verifying your nonprofit status.
3. **Two images**: one large hero photo (around 1600×900 pixels) and one optional supporting photo (around 1200×800). Save them as `.webp` if you can — they'll load faster.

You do **not** need any API keys, a database, or a credit-card processor account. PayPal handles all the payment side.

---

## Quick start (about 30 minutes)

1. **Open the template in Replit.** From this GitHub page, click **Code → Open with Replit**, or in Replit click **Create app → Import from GitHub** and paste this repo's URL.
2. **Wait a minute** for Replit to install everything and start the preview. The demo site will appear in the preview panel on the right.
3. **Open the file `site.config.ts`** inside the `artifacts/donation-site/` folder. This single file holds your org name, EIN, contact info, brand colors, all page text, suggested donation amounts, FAQ entries, board members, and legal-page wording. Everything you'd want to change lives here.
4. **Paste in your PayPal button ID** (see "Setting up PayPal" below).
5. **Replace the demo images** in `artifacts/donation-site/public/` — drag your own files into that folder using the Replit file browser, named `hero.webp` and `story.webp`.
6. **Click Publish** at the top of Replit when you're ready to go live.

---

## Editing your content

Almost every visible word, color, dollar amount, FAQ entry, and legal paragraph is in **`site.config.ts`**. The file is organized into clearly labeled sections:

| Section | What it controls |
| --- | --- |
| `org` | Your nonprofit's name, EIN, address, contact email, phone, founded year |
| `paypal` | Your PayPal hosted-button ID and how the checkout opens (new tab vs same tab) |
| `amounts` | Your suggested one-time and monthly donation amounts plus the impact label for each |
| `branding` | Brand colors, logo, hero image, supporting image |
| `typography` | Optional custom fonts |
| `copy` | All page text — headlines, mission statement, FAQ, story, board roster, legal pages |
| `social` | Optional links to your social media accounts |
| `features` | Toggles for things like the sticky mobile bar and FAQ section |

The file has comments throughout (lines starting with `//`) explaining each field with examples. If you make a mistake — a missing field, a typo — Replit will underline the problem in red so you can fix it before publishing.

### Tips for filling it in

- **Suggested amounts**: pick 4–6 amounts per mode (one-time and monthly). Use smaller numbers for monthly. Mark exactly one as the default with `default: true`.
- **Impact labels**: be concrete and honest. "Stocks a family's pantry for a week" is stronger than "Bronze donor."
- **Colors**: the template uses HSL color values. Tools like <https://hslpicker.com> let you pick a color and copy the three numbers.
- **Images**: choose photos that show one clear person, family, animal, or project — not a collage. Compress them before uploading (try <https://squoosh.app>) so your site loads quickly.

---

## Setting up PayPal

1. Sign in to your nonprofit PayPal account and go to <https://www.paypal.com/donate/buttons>.
2. Click **Create Button**, choose **Donations**, and fill in your organization name and (optional) preset amounts.
3. Under **Step 3: Customize advanced features**, set:
   - **Take donors to this URL when they finish**: `https://yourdomain.org/thank-you`
   - **Take donors to this URL when they cancel**: `https://yourdomain.org/`
4. Click **Save Changes**, then **Create Button**.
5. On the next page, switch to the **Email** tab. Your button ID is the long string of letters and numbers at the end of the donation link, after `hosted_button_id=`. Copy it.
6. Paste it into `site.config.ts`:
   ```ts
   paypal: {
     hostedButtonId: "YOUR_BUTTON_ID_HERE",
     flowMode: "newTab",
     returnUrl: "https://yourdomain.org/thank-you",
   },
   ```

**`flowMode` options**:
- `"newTab"` (recommended): PayPal opens in a new tab so your site stays visible.
- `"sameTab"`: the donor's tab is taken over by PayPal. Only use this if you've also set `returnUrl` so they come back to your thank-you page.

---

## Image guidelines

| Slot | Recommended size | Format | Target file size |
| ---- | ---------------- | ------ | ---------------- |
| Hero image | 1600×900 | WebP or AVIF | under 400 KB |
| Supporting / story | 1200×800 | WebP or AVIF | under 200 KB |
| Logo | SVG (best) or 512×512 PNG | SVG / PNG | under 30 KB |
| Social-share image | 1200×630 | JPG or PNG | under 300 KB |

Drop your files into `artifacts/donation-site/public/` (using the Replit file browser is easiest). Keep the same filenames the template uses, or update the matching paths in `site.config.ts`.

---

## Legal pages — please read

The Privacy Policy, Terms of Use, Refund/Correction Policy, and Donor Bill of Rights pages are **starting points**, not legal advice. They're sensible defaults for a small US-based 501(c)(3), but every nonprofit's situation is different.

**Before you publish**, please:

- [ ] Have your own attorney review and tailor every legal page to your state, programs, and data practices
- [ ] Update the disclaimer banners at the top of each legal page (they currently say "starter template" — you may want to soften or remove them once your counsel has signed off)
- [ ] Double-check the **Last updated** date on each page
- [ ] If you use analytics or any third-party tracking scripts, add a cookie-consent banner

---

## Publishing your site

The template is published using **Replit Deployments**:

1. In Replit, click **Publish** (top-right).
2. Choose **Static** — this site has no backend, and Static deployments are cheaper and faster for sites like this.
3. Replit builds the site and gives you a `*.replit.app` web address. Open it to confirm everything works.
4. **Custom domain**: in your Deployment settings, click **Add custom domain** and follow the DNS instructions. Replit handles HTTPS for you automatically.
5. Once your custom domain is live, update `org.siteUrl` in `site.config.ts`, and update the **Return URL** inside your PayPal hosted button settings to match.

---

## Frequently asked questions

**Do I need to know how to code?**
No. You'll be editing one configuration file — mostly replacing example text with your own words. If you can edit a Word document, you can edit this file.

**Where does the donation money go?**
Straight to your PayPal nonprofit account. This template never touches the money or stores donor data. PayPal also sends the email receipts.

**Is donor data stored anywhere on my site?**
No. The template has no backend and no database. The only thing that runs is the website itself — donor information lives in PayPal's systems.

**Can I add a Stripe / Apple Pay / Google Pay button?**
Not out of the box. The template intentionally only uses PayPal's hosted button to keep things simple and avoid needing your own payment integration. PayPal's checkout page may surface wallet options to donors automatically depending on your account.

**Can I add a real contact form (instead of `mailto:`)?**
Yes — the contact page is a `mailto:` link by default. To add a real form, sign up for a free service like Formspree, Tally, or Web3Forms and follow their embed instructions. The contact page has a clearly marked spot for the embed code.

**Can I translate it into another language?**
Yes — translate the text values inside `site.config.ts`. The template doesn't include built-in support for showing multiple languages side by side; that would require additional work.

**Is it really free?**
The template itself is free under the MIT license. Replit's free plan is enough to build and preview; you'll want a paid Replit plan to deploy with a custom domain. PayPal does not charge a setup fee for nonprofit accounts (they take a small per-donation fee — check current rates).

---

## Security notes

This is a **fully static frontend** — no server, no database, no API keys stored in code. That means:

- There are no secrets or credentials to leak from the repository.
- Your PayPal **hosted button ID** in `site.config.ts` is **safe to commit publicly** — it's the same ID PayPal embeds in donation links, and it cannot be used to access your PayPal account or move money.
- The site collects no donor information directly. All payment and personal data is entered on PayPal's pages, under PayPal's security.

If you fork this template, you can publish your fork publicly without worrying about exposing donor data — there isn't any to expose.

---

## License

MIT — use this template for any nonprofit purpose, commercial or otherwise. Attribution is appreciated but not required.
