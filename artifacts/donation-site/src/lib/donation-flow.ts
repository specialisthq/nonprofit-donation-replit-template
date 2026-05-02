/**
 * Shared cross-page contract for the donation flow.
 *
 * The thank-you page (and any other page that wants to deep-link a donor
 * back to the landing donation module preset to "Monthly") MUST use these
 * constants so the contract stays in one place. The landing page's donation
 * module reads the same names off the URL search params on mount.
 */

import site from "@config";

/** URL search-param name used to preselect a gift type on the landing page. */
export const GIVE_PARAM = "give";

/** Value of `?give=...` that means "preselect the Monthly tab". */
export const GIVE_MONTHLY = "monthly";

/** URL search-param name used to preselect a specific dollar amount. */
export const AMOUNT_PARAM = "amount";

/** Stable id of the donation module's anchor on the landing page. */
export const DONATE_ANCHOR_ID = "donate";

/**
 * Build a URL that lands the donor on the home page with the donation module
 * preselected to monthly mode and scrolled to the form.
 *
 * Output is a path-relative string (e.g. "/?give=monthly#donate") so it works
 * inside react-router's <Link to> and is safe whether the app is mounted at
 * "/" or at a sub-path under BASE_URL.
 */
export function monthlyUpgradeHref(): string {
  return `/?${GIVE_PARAM}=${GIVE_MONTHLY}#${DONATE_ANCHOR_ID}`;
}

/**
 * Build a URL that lands the donor on the home page with the donation module
 * preset to a specific dollar amount (and optionally to Monthly mode), and
 * scrolled to the form. Used by the impact page's "tier recap" cards and any
 * other cross-page deep-link to a pre-chosen gift amount.
 *
 * If the amount matches a preset suggested amount the tile is highlighted;
 * otherwise the landing page falls back to populating the custom-amount
 * input — so arbitrary deep-links remain usable, not just preset ones.
 */
export function donationTierHref(
  amount: number,
  opts?: { monthly?: boolean },
): string {
  const params = new URLSearchParams();
  params.set(AMOUNT_PARAM, String(amount));
  if (opts?.monthly) params.set(GIVE_PARAM, GIVE_MONTHLY);
  return `/?${params.toString()}#${DONATE_ANCHOR_ID}`;
}

/**
 * Best-effort absolute URL of the public-facing landing page, used by social
 * share intents (Twitter / Facebook / LinkedIn) and the Web Share API.
 *
 * Resolution order:
 *   1. `site.org.siteUrl` from config (canonical, set by the cloner — works
 *      even when the page is shared from a staging URL, an iframe, or any
 *      context where window.location is misleading).
 *   2. window.location.origin + BASE_URL when running in a browser.
 *   3. "/" as a final fallback (e.g. during a unit-test snapshot).
 */
export function landingShareUrl(): string {
  const configured = site.org.siteUrl?.trim();
  if (configured) {
    return configured.endsWith("/") ? configured : `${configured}/`;
  }
  if (typeof window === "undefined") return "/";
  const base = (
    (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/"
  ) as string;
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  return `${window.location.origin}${cleanBase}`;
}

/** Plain-text social-share message used by all share buttons on /thank-you. */
export function shareText(): string {
  return site.copy.thankYou.shareText;
}
