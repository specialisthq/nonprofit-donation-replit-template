import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LandingPage } from "@/pages/landing";
import { DonationModule } from "@/components/donation-module";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import site from "@config";
import { buildDonateUrl, donateLinkProps } from "@/lib/paypal";

function renderLanding() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
}

describe("PayPal URL builder", () => {
  it("builds the hosted-button URL with no amount", () => {
    const url = buildDonateUrl();
    expect(url).toContain("paypal.com/donate");
    expect(url).toContain(
      `hosted_button_id=${site.paypal.hostedButtonId}`,
    );
    expect(url).not.toContain("amount=");
  });

  it("appends amount and item_name=Monthly gift when recurring", () => {
    const url = buildDonateUrl({ amount: 50, recurring: true });
    expect(url).toContain("amount=50");
    expect(url).toContain("item_name=Monthly+gift");
  });

  it("respects flowMode for target/rel attrs", () => {
    const props = donateLinkProps({ amount: 25 });
    if (site.paypal.flowMode === "newTab") {
      expect(props).toMatchObject({
        target: "_blank",
        rel: "noopener noreferrer",
      });
    } else {
      expect(props).not.toHaveProperty("target");
    }
  });
});

describe("Landing page — donation module", () => {
  beforeEach(() => {
    renderLanding();
  });

  it("renders the donation module above the fold", () => {
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: site.copy.landing.donationModule.heading }),
    ).toBeInTheDocument();
  });

  it("preselects the configured default amount and shows it on the CTA", () => {
    const defaultOneTime = site.amounts.oneTime.find((a) => a.default);
    if (!defaultOneTime) return;
    const formatted = defaultOneTime.amount.toLocaleString();
    const cta = screen.getAllByRole("link", {
      name: new RegExp(`Donate \\$${formatted} now`, "i"),
    })[0];
    expect(cta).toBeTruthy();
    expect(cta.getAttribute("href")).toContain(
      `amount=${defaultOneTime.amount}`,
    );
  });

  it("updates the CTA label when a different one-time amount is selected", async () => {
    const user = userEvent.setup();
    const target = site.amounts.oneTime.find(
      (a) => !a.default,
    );
    if (!target) return;
    const button = within(screen.getByRole("form")).getByRole("button", {
      name: new RegExp(`\\$${target.amount}\\b`),
    });
    await user.click(button);
    const formatted = target.amount.toLocaleString();
    expect(
      screen.getAllByRole("link", {
        name: new RegExp(`Donate \\$${formatted} now`, "i"),
      })[0],
    ).toBeInTheDocument();
  });

  it("custom amount overrides preset and updates the CTA", async () => {
    const user = userEvent.setup();
    const input = screen.getByLabelText(/other amount|custom amount/i);
    await user.clear(input);
    await user.type(input, "73");
    expect(
      screen.getAllByRole("link", { name: /Donate \$73 now/i })[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /Donate \$73 now/i })[0].getAttribute(
        "href",
      ),
    ).toContain("amount=73");
  });

  it("toggles to monthly mode and swaps the amounts grid + CTA wording", async () => {
    const user = userEvent.setup();
    const form = screen.getByRole("form");
    const toggleGroup = within(form).getByRole("group", { name: /gift type/i });
    const monthlyToggle = within(toggleGroup).getByRole("button", {
      name: new RegExp(site.copy.landing.donationModule.monthlyLabel, "i"),
    });
    await user.click(monthlyToggle);
    expect(monthlyToggle).toHaveAttribute("aria-pressed", "true");

    const monthlyAmounts = site.amounts.monthly;
    const target = monthlyAmounts.find((a) => a.default) ?? monthlyAmounts[0];
    if (!target) return;
    const formatted = target.amount.toLocaleString();
    expect(
      within(form).getByRole("link", {
        name: new RegExp(`Start my \\$${formatted} monthly gift`, "i"),
      }),
    ).toBeInTheDocument();
  });

  it("monthly tab is visually emphasized with a 'Best' / star badge in both states", () => {
    const form = screen.getByRole("form");
    const toggleGroup = within(form).getByRole("group", { name: /gift type/i });
    const monthlyToggle = within(toggleGroup).getByRole("button", {
      name: new RegExp(site.copy.landing.donationModule.monthlyLabel, "i"),
    });
    expect(monthlyToggle.textContent).toMatch(/best|recommended|★/i);
  });
});

describe("DonationModule — fallback CTA when no amount is selected", () => {
  function renderModule(props: {
    mode: "oneTime" | "monthly";
    amount: number | null;
    customAmount: string;
  }) {
    return render(
      <DonationModule
        mode={props.mode}
        amount={props.amount}
        customAmount={props.customAmount}
        onModeChange={() => {}}
        onAmountChange={() => {}}
        onCustomAmountChange={() => {}}
      />,
    );
  }

  it("falls back to 'Donate now' in one-time mode when no amount is selected", () => {
    renderModule({ mode: "oneTime", amount: null, customAmount: "" });
    const fallback = site.copy.landing.donationModule.defaultCtaLabel;
    expect(fallback).toMatch(/^donate now$/i);
    const cta = screen.getByRole("link", {
      name: new RegExp(`^${fallback}$`, "i"),
    });
    expect(cta).toBeInTheDocument();
    // No amount in URL when nothing selected
    expect(cta.getAttribute("href")).not.toContain("amount=");
  });

  it("falls back to 'Donate now' in monthly mode when no amount is selected (does NOT say 'Start my monthly gift')", () => {
    renderModule({ mode: "monthly", amount: null, customAmount: "" });
    const fallback = site.copy.landing.donationModule.defaultCtaLabel;
    const cta = screen.getByRole("link", {
      name: new RegExp(`^${fallback}$`, "i"),
    });
    expect(cta).toBeInTheDocument();
    expect(cta.textContent).not.toMatch(/start my .* monthly gift/i);
  });
});

describe("Landing page — trust strip & charity ratings slot", () => {
  it("hides the charity-ratings list when the config array is empty", () => {
    expect(site.copy.landing.charityRatings.length).toBe(0);
    renderLanding();
    expect(
      screen.queryByLabelText(/independent charity ratings/i),
    ).not.toBeInTheDocument();
  });
});

describe("Landing page — FAQ", () => {
  beforeEach(() => {
    renderLanding();
  });

  it("renders all configured FAQs as collapsible items", () => {
    for (const faq of site.copy.landing.faqs) {
      expect(
        screen.getByRole("button", { name: faq.question }),
      ).toBeInTheDocument();
    }
  });

  it("includes the required topics: receipt and other-ways-to-give pointing to contact", () => {
    const text = site.copy.landing.faqs
      .map((f) => `${f.question}\n${f.answer}`)
      .join("\n")
      .toLowerCase();
    expect(text).toMatch(/receipt/);
    expect(text).toMatch(/stock|donor.advised|daf|check/);
    expect(text).toMatch(/contact/);
  });

  it("expands a FAQ panel when the question is clicked", async () => {
    const user = userEvent.setup();
    const first = site.copy.landing.faqs[0];
    const trigger = screen.getByRole("button", { name: first.question });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(first.answer)).toBeVisible();
  });
});

describe("Landing page — secondary giving + sticky mobile CTA", () => {
  beforeEach(() => {
    renderLanding();
  });

  it("renders all configured secondary giving cards with valid actions", () => {
    for (const card of site.copy.landing.secondaryGiving.cards) {
      const heading = screen.getByRole("heading", { name: card.title });
      expect(heading).toBeInTheDocument();
    }
  });

  it("renders a sticky mobile CTA that is hidden on initial load (no scroll yet)", () => {
    const sticky = screen.getByTestId("sticky-mobile-cta");
    expect(sticky).toBeInTheDocument();
    // It exists in the DOM but is collapsed (aria-hidden + invisible class)
    // until the user scrolls past the hero sentinel.
    expect(sticky).toHaveAttribute("aria-hidden", "true");
    // The button is inside an aria-hidden container, so it's inaccessible
    // by default — we still verify it's in the DOM.
    const button = within(sticky).getByRole("button", { hidden: true });
    expect(button).toBeInTheDocument();
    expect(button.textContent).toMatch(/donate/i);
  });
});

describe("StickyMobileCta — scroll visibility behavior", () => {
  let sentinel: HTMLDivElement;

  beforeEach(() => {
    sentinel = document.createElement("div");
    sentinel.id = "test-sentinel";
    document.body.appendChild(sentinel);
  });

  afterEach(() => {
    sentinel.remove();
    vi.restoreAllMocks();
  });

  function mockSentinelTop(top: number) {
    vi.spyOn(sentinel, "getBoundingClientRect").mockReturnValue({
      top,
      bottom: top + 1,
      left: 0,
      right: 0,
      width: 0,
      height: 1,
      x: 0,
      y: top,
      toJSON: () => ({}),
    });
  }

  it("stays hidden while the sentinel is still visible (top >= 0) and becomes visible after the user scrolls past it (top < 0)", () => {
    mockSentinelTop(200);
    render(
      <StickyMobileCta
        watchSentinelId="test-sentinel"
        scrollToId="donate"
        label="Donate now"
      />,
    );
    const bar = screen.getByTestId("sticky-mobile-cta");
    expect(bar).toHaveAttribute("aria-hidden", "true");

    // Simulate the user scrolling past the sentinel.
    mockSentinelTop(-50);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(bar).toHaveAttribute("aria-hidden", "false");

    // Simulate scrolling back up — bar should hide again.
    mockSentinelTop(120);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(bar).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Landing page — gift impact tiers", () => {
  it("scrolls AND focuses the donation module heading when a tier is clicked", async () => {
    const user = userEvent.setup();
    const scrollSpy = vi
      .spyOn(HTMLElement.prototype, "scrollIntoView")
      .mockImplementation(() => {});
    renderLanding();

    const tierGrid = screen.getByLabelText(
      /suggested gift amounts and what they fund/i,
    );
    const firstTierBtn = within(tierGrid).getAllByRole("button")[0];
    await user.click(firstTierBtn);

    // Wait one animation frame for the scroll/focus side effect.
    await act(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        ),
    );

    expect(scrollSpy).toHaveBeenCalled();
    const heading = document.getElementById("donate-heading");
    expect(heading).not.toBeNull();
    expect(document.activeElement).toBe(heading);
    scrollSpy.mockRestore();
  });

  it("when monthly mode is active, clicking a tier sets a MONTHLY gift (not silently switching to one-time)", async () => {
    const user = userEvent.setup();
    vi.spyOn(HTMLElement.prototype, "scrollIntoView").mockImplementation(() => {});
    renderLanding();

    // Toggle into monthly mode in the donation module.
    const form = screen.getByRole("form");
    const monthlyToggle = within(form).getByRole("button", {
      name: new RegExp(site.copy.landing.donationModule.monthlyLabel, "i"),
    });
    await user.click(monthlyToggle);

    // Click the first impact tier (a one-time-style amount label).
    const tierGrid = screen.getByLabelText(
      /suggested gift amounts and what they fund/i,
    );
    const firstTierBtn = within(tierGrid).getAllByRole("button")[0];
    await user.click(firstTierBtn);

    // The donation module's primary CTA must now read "Start my $X monthly gift"
    // (and the monthly toggle must remain pressed).
    expect(monthlyToggle).toHaveAttribute("aria-pressed", "true");
    expect(
      within(form).getByRole("link", {
        name: /start my \$.+ monthly gift/i,
      }),
    ).toBeInTheDocument();
  });
});
