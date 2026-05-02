import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ThankYouPage } from "@/pages/thank-you";
import { LandingPage } from "@/pages/landing";
import site from "@config";
import {
  DONATE_ANCHOR_ID,
  GIVE_MONTHLY,
  GIVE_PARAM,
  monthlyUpgradeHref,
} from "@/lib/donation-flow";

function renderThankYou(initialEntries: string[] = ["/thank-you"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Thank-you page — hero / confirmation", () => {
  beforeEach(() => renderThankYou());

  it("renders the configured warm headline and body copy", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: site.copy.thankYou.headline }),
    ).toBeInTheDocument();
    expect(screen.getByText(site.copy.thankYou.body)).toBeInTheDocument();
  });

  it("renders the receipt-emailed reassurance microcopy verbatim from config", () => {
    expect(screen.getByText(site.copy.thankYou.receiptNote)).toBeInTheDocument();
  });

  it("uses conditional, non-verification language for the eyebrow (no server-side donation verification exists)", () => {
    // Guard against accidental regressions to absolute claims like
    // "Donation confirmed" — this is a frontend-only template.
    expect(screen.queryByText(/donation\s+confirmed/i)).not.toBeInTheDocument();
  });

  it("hides the optional thank-you video slot when no videoUrl is configured", () => {
    expect(site.copy.thankYou.videoUrl).toBeFalsy();
    expect(
      screen.queryByLabelText(/short thank-you video/i),
    ).not.toBeInTheDocument();
  });
});

describe("Thank-you page — employer match", () => {
  it("renders the employer-match card with a CTA pointing at the configured href", () => {
    renderThankYou();
    const cta = screen.getByTestId("employer-match-link");
    expect(cta).toBeInTheDocument();
    const cfg = site.copy.thankYou.employerMatch!;
    expect(cta).toHaveTextContent(cfg.ctaLabel);
    expect(cta.getAttribute("href")).toBe(cfg.href);
    if (cfg.external) {
      expect(cta).toHaveAttribute("target", "_blank");
      expect(cta).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("hides the entire employer-match section when employerMatch is omitted from config", () => {
    const original = site.copy.thankYou.employerMatch;
    site.copy.thankYou.employerMatch = undefined;
    try {
      renderThankYou();
      expect(screen.queryByTestId("employer-match-link")).not.toBeInTheDocument();
    } finally {
      site.copy.thankYou.employerMatch = original;
    }
  });
});

describe("Thank-you page — impact reminder", () => {
  it("renders the configured impact tiers (or falls back gracefully)", () => {
    renderThankYou();
    const list = screen.getByLabelText(/impact reminder/i);
    const tiers =
      site.copy.thankYou.impactReminder.tiers ??
      site.amounts.oneTime
        .slice(0, 2)
        .map((a) => ({ amount: a.amount, impactLabel: a.impactLabel }));
    expect(tiers.length).toBeGreaterThan(0);
    expect(within(list).getAllByRole("listitem")).toHaveLength(tiers.length);
    for (const tier of tiers) {
      expect(within(list).getByText(`$${tier.amount}`)).toBeInTheDocument();
      expect(within(list).getByText(tier.impactLabel)).toBeInTheDocument();
    }
  });
});

describe("Thank-you page — monthly upgrade", () => {
  it("renders an upgrade card whose link goes to the landing page with ?give=monthly", () => {
    renderThankYou();
    const link = screen.getByTestId("monthly-upgrade-link");
    expect(link).toBeInTheDocument();
    const href = link.getAttribute("href") ?? "";
    expect(href).toContain(`${GIVE_PARAM}=${GIVE_MONTHLY}`);
    expect(href).toMatch(/^\/(\?|#|$)/);
    expect(href).toBe(monthlyUpgradeHref());
  });

  it("clicking the upgrade card navigates back to landing with monthly tab preselected", async () => {
    const user = userEvent.setup();
    renderThankYou();
    const link = screen.getByTestId("monthly-upgrade-link");
    await user.click(link);

    // Now the LandingPage should be mounted with monthly preselected. Scope
    // by the gift-type toggle group so we don't collide with amount buttons
    // whose impact labels happen to include the word "monthly".
    const giftType = await screen.findByRole("group", { name: /gift type/i });
    const monthlyToggle = within(giftType).getByRole("button", {
      name: new RegExp(site.copy.landing.donationModule.monthlyLabel, "i"),
    });
    expect(monthlyToggle).toHaveAttribute("aria-pressed", "true");
  });

  it("hides the monthly upgrade card when features.showMonthlyUpsell is false", () => {
    const original = site.features.showMonthlyUpsell;
    site.features.showMonthlyUpsell = false;
    try {
      renderThankYou();
      expect(screen.queryByTestId("monthly-upgrade-link")).not.toBeInTheDocument();
    } finally {
      site.features.showMonthlyUpsell = original;
    }
  });
});

describe("Thank-you page — share row", () => {
  afterEach(() => {
    // Reset the navigator.share stub between tests so detection logic
    // starts from a clean slate.
    delete (navigator as { share?: unknown }).share;
  });

  it("renders all four social share fallback links with correct intent URLs", () => {
    renderThankYou();
    const text = encodeURIComponent(site.copy.thankYou.shareText);
    const tw = screen.getByTestId("share-twitter") as HTMLAnchorElement;
    expect(tw.href).toContain("twitter.com/intent/tweet");
    expect(tw.href).toContain(`text=${text}`);
    expect(tw).toHaveAttribute("target", "_blank");
    expect(tw).toHaveAttribute("rel", "noopener noreferrer");

    const fb = screen.getByTestId("share-facebook") as HTMLAnchorElement;
    expect(fb.href).toContain("facebook.com/sharer/sharer.php");

    const li = screen.getByTestId("share-linkedin") as HTMLAnchorElement;
    expect(li.href).toContain("linkedin.com/sharing/share-offsite");

    const em = screen.getByTestId("share-email") as HTMLAnchorElement;
    expect(em.href.startsWith("mailto:")).toBe(true);
    expect(em).not.toHaveAttribute("target");
  });

  it("does NOT render the native Web Share button when navigator.share is unavailable", () => {
    expect((navigator as { share?: unknown }).share).toBeUndefined();
    renderThankYou();
    expect(
      screen.queryByTestId("native-share-button"),
    ).not.toBeInTheDocument();
  });

  it("renders the native Web Share button when supported, and invokes navigator.share with the configured payload", async () => {
    const shareSpy = vi.fn().mockResolvedValue(undefined);
    (navigator as unknown as { share: typeof shareSpy }).share = shareSpy;

    renderThankYou();
    const btn = await screen.findByTestId("native-share-button");
    await act(async () => {
      await userEvent.setup().click(btn);
    });
    expect(shareSpy).toHaveBeenCalledTimes(1);
    const payload = shareSpy.mock.calls[0][0];
    expect(payload.text).toBe(site.copy.thankYou.shareText);
    expect(payload.title).toBe(site.org.name);
    expect(payload.url).toBeTypeOf("string");
  });

  it("hides the entire share row when features.showShare is false", () => {
    const original = site.features.showShare;
    site.features.showShare = false;
    try {
      renderThankYou();
      expect(screen.queryByTestId("share-twitter")).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/share to a social network/i),
      ).not.toBeInTheDocument();
    } finally {
      site.features.showShare = original;
    }
  });
});

describe("Thank-you page — social follow row", () => {
  it("renders one icon link per configured social network with target=_blank", () => {
    renderThankYou();
    const list = screen.getByLabelText(/follow us on social media/i);
    const expected = Object.entries(site.social).filter(([, v]) => Boolean(v));
    const links = within(list).getAllByRole("link");
    expect(links).toHaveLength(expected.length);
    for (const [, href] of expected) {
      const match = links.find((a) => a.getAttribute("href") === href);
      expect(match, `expected a follow link to ${href}`).toBeTruthy();
      expect(match).toHaveAttribute("target", "_blank");
      expect(match).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});

describe("Thank-you page — newsletter placeholder", () => {
  beforeEach(() => renderThankYou());

  it("renders an inline newsletter placeholder card with disabled inputs and an explicit cloner note", () => {
    const card = screen.getByTestId("newsletter-placeholder");
    expect(card).toBeInTheDocument();
    expect(
      within(card).getByLabelText(/email address/i, { selector: "input" }),
    ).toBeDisabled();
    expect(
      within(card).getByRole("button", {
        name: site.copy.thankYou.newsletter.ctaLabel,
      }),
    ).toBeDisabled();
    expect(within(card).getByText(/placeholder/i)).toBeInTheDocument();
  });
});

describe("Thank-you page — what happens next", () => {
  it("renders an ordered list with one item per configured step", () => {
    renderThankYou();
    const steps = site.copy.thankYou.whatHappensNext.steps;
    expect(steps.length).toBeGreaterThan(0);
    for (const step of steps) {
      expect(
        screen.getByRole("heading", { level: 3, name: step.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(step.body)).toBeInTheDocument();
    }
  });
});

describe("Landing page — monthly preselect URL contract", () => {
  it("preselects the Monthly tab when the URL has ?give=monthly", () => {
    render(
      <MemoryRouter initialEntries={[`/?${GIVE_PARAM}=${GIVE_MONTHLY}`]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>,
    );
    const giftType = screen.getByRole("group", { name: /gift type/i });
    const monthlyToggle = within(giftType).getByRole("button", {
      name: new RegExp(site.copy.landing.donationModule.monthlyLabel, "i"),
    });
    expect(monthlyToggle).toHaveAttribute("aria-pressed", "true");
  });

  it("monthlyUpgradeHref deep-links to the donation module's anchor (shared anchor-id contract)", () => {
    expect(monthlyUpgradeHref()).toBe(
      `/?${GIVE_PARAM}=${GIVE_MONTHLY}#${DONATE_ANCHOR_ID}`,
    );
  });

  it("does NOT preselect monthly when the param is absent or different", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MemoryRouter>,
    );
    const giftType = screen.getByRole("group", { name: /gift type/i });
    const monthlyToggle = within(giftType).getByRole("button", {
      name: new RegExp(site.copy.landing.donationModule.monthlyLabel, "i"),
    });
    expect(monthlyToggle).toHaveAttribute("aria-pressed", "false");
  });
});
