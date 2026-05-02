import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ImpactPage } from "@/pages/impact";
import { LandingPage } from "@/pages/landing";
import site from "@config";
import {
  AMOUNT_PARAM,
  GIVE_MONTHLY,
  GIVE_PARAM,
  donationTierHref,
} from "@/lib/donation-flow";

function renderImpact(initialEntries: string[] = ["/impact"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/impact" element={<ImpactPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function renderLandingAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Impact page — hero", () => {
  beforeEach(() => renderImpact());

  it("renders the configured eyebrow, headline, and subhead", () => {
    expect(
      screen.getByText(site.copy.impact.hero.eyebrow, { selector: "p" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: site.copy.impact.hero.headline,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(site.copy.impact.hero.subhead),
    ).toBeInTheDocument();
  });

  it("renders the supporting metric value, label, and context", () => {
    const m = site.copy.impact.hero.supportingMetric;
    // The supporting metric value (e.g. "94¢") may legitimately repeat in
    // the metrics strip below; assert presence rather than uniqueness.
    expect(screen.getAllByText(m.value).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(m.label)).toBeInTheDocument();
    if (m.context) {
      expect(screen.getByText(m.context)).toBeInTheDocument();
    }
  });
});

describe("Impact page — metrics strip", () => {
  it("renders one card per configured metric (also feeds the landing fallback)", () => {
    renderImpact();
    const strip = screen.getByTestId("impact-metrics-strip");
    const items = within(strip).getAllByRole("listitem");
    expect(items).toHaveLength(site.copy.impact.metrics.length);
    for (const m of site.copy.impact.metrics) {
      expect(within(strip).getByText(m.value)).toBeInTheDocument();
      expect(within(strip).getByText(m.label)).toBeInTheDocument();
    }
  });
});

describe("Impact page — programs", () => {
  beforeEach(() => renderImpact());

  it("renders one card per program with its name, summary, and outcomes", () => {
    const list = screen.getByRole("list", { name: /our programs/i });
    // Count programs by their level-3 headings (each card has exactly one);
    // querying nested listitems would also pick up the per-program outcome
    // <li> elements, which are intentional but not what we're counting.
    const programHeadings = within(list).getAllByRole("heading", { level: 3 });
    expect(programHeadings).toHaveLength(site.copy.impact.programs.items.length);
    for (const program of site.copy.impact.programs.items) {
      expect(
        within(list).getByRole("heading", { level: 3, name: program.name }),
      ).toBeInTheDocument();
      expect(within(list).getByText(program.summary)).toBeInTheDocument();
      const outcomes = within(list).getByRole("list", {
        name: new RegExp(`${program.name} outcomes`, "i"),
      });
      for (const outcome of program.outcomes) {
        expect(within(outcomes).getByText(outcome.value)).toBeInTheDocument();
        expect(within(outcomes).getByText(outcome.label)).toBeInTheDocument();
      }
    }
  });

  it("renders the section heading and (when set) subhead", () => {
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: site.copy.impact.programs.headline,
      }),
    ).toBeInTheDocument();
    if (site.copy.impact.programs.subhead) {
      expect(
        screen.getByText(site.copy.impact.programs.subhead),
      ).toBeInTheDocument();
    }
  });
});

describe("Impact page — money-goes breakdown", () => {
  beforeEach(() => renderImpact());

  it("renders one labeled segment per breakdown item", () => {
    const legend = screen.getByRole("list", { name: /where every dollar goes/i });
    const items = within(legend).getAllByRole("listitem");
    expect(items).toHaveLength(site.copy.impact.moneyGoes.breakdown.length);
    for (const segment of site.copy.impact.moneyGoes.breakdown) {
      expect(within(legend).getByText(segment.label)).toBeInTheDocument();
      // Use a word-boundary regex so e.g. "4%" doesn't accidentally match
      // inside "94%". `\b` treats the digit's start as a boundary because
      // it's preceded by whitespace in the rendered "94% Programs" text.
      expect(
        within(legend).getByText(new RegExp(`\\b${segment.percent}%`)),
      ).toBeInTheDocument();
    }
  });

  it("links to the transparency page for the full financials", () => {
    const link = screen.getByTestId("impact-transparency-link");
    expect(link).toHaveAttribute(
      "href",
      site.copy.impact.moneyGoes.transparencyLink.href,
    );
    expect(link).toHaveTextContent(
      site.copy.impact.moneyGoes.transparencyLink.label,
    );
  });
});

describe("Impact page — beneficiary story", () => {
  beforeEach(() => renderImpact());

  it("renders the headline, every body paragraph, and the pull-quote", () => {
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: site.copy.impact.beneficiary.headline,
      }),
    ).toBeInTheDocument();
    for (const paragraph of site.copy.impact.beneficiary.body) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    // Quote may be rendered with curly quotes; assert the quote substring
    // appears inside the blockquote element.
    const quote = screen.getByRole("blockquote");
    expect(quote).toHaveTextContent(site.copy.impact.beneficiary.quote);
    expect(
      screen.getByText(site.copy.impact.beneficiary.attribution),
    ).toBeInTheDocument();
  });

  it("renders an accessible image (real <img> when src is set, otherwise a labeled placeholder)", () => {
    const cfg = site.copy.impact.beneficiary;
    const expectedAlt = cfg.imageAlt ?? cfg.headline;
    if (cfg.imagePath) {
      const img = screen.getByRole("img", { name: expectedAlt });
      expect(img).toHaveAttribute("src", cfg.imagePath);
    } else {
      expect(
        screen.getByRole("img", { name: expectedAlt }),
      ).toBeInTheDocument();
    }
  });
});

describe("Impact page — tier recap", () => {
  beforeEach(() => renderImpact());

  it("renders one tile per one-time tier with the correct deep-link href", () => {
    const list = screen.getByRole("list", { name: /impact tier recap/i });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(site.amounts.oneTime.length);
    for (const tier of site.amounts.oneTime) {
      const tile = screen.getByTestId(`impact-tier-${tier.amount}`);
      expect(tile).toHaveAttribute("href", donationTierHref(tier.amount));
      expect(tile).toHaveTextContent(`$${tier.amount}`);
      expect(tile).toHaveTextContent(tier.impactLabel);
    }
  });
});

describe("Impact page — closing CTA", () => {
  it("renders a primary CTA pointing back to the landing page (donation flow)", () => {
    renderImpact();
    const cta = screen.getByTestId("impact-closing-cta");
    expect(cta).toHaveAttribute("href", "/");
    expect(cta).toHaveTextContent(site.copy.impact.closingCta.ctaLabel);
  });
});

describe("donationTierHref + landing deep-link contract", () => {
  it("builds a path-relative URL with the amount param and donate anchor", () => {
    const url = donationTierHref(100);
    expect(url).toContain(`${AMOUNT_PARAM}=100`);
    expect(url).toMatch(/#donate$/);
    expect(url).not.toContain(`${GIVE_PARAM}=`);
  });

  it("includes give=monthly when monthly is requested", () => {
    const url = donationTierHref(20, { monthly: true });
    expect(url).toContain(`${AMOUNT_PARAM}=20`);
    expect(url).toContain(`${GIVE_PARAM}=${GIVE_MONTHLY}`);
  });

  it("preselects a one-time amount on the landing page when arriving via ?amount=", () => {
    // Pick a non-default tier so we can prove the URL — not the config —
    // drove the selection.
    const tier = site.amounts.oneTime.find((a) => !a.default);
    if (!tier) {
      throw new Error("Demo config needs at least one non-default one-time tier");
    }
    renderLandingAt(`/?${AMOUNT_PARAM}=${tier.amount}#donate`);
    const form = screen.getByRole("form");
    const pressedButtons = within(form)
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "true");
    // Exactly one preset amount tile should be pressed.
    const pressedAmount = pressedButtons.find((b) =>
      b.textContent?.includes(`$${tier.amount}`),
    );
    expect(pressedAmount).toBeTruthy();
  });

  it("preselects the Monthly tab AND a monthly amount when arriving with both params", () => {
    const tier = site.amounts.monthly[0];
    renderLandingAt(
      `/?${AMOUNT_PARAM}=${tier.amount}&${GIVE_PARAM}=${GIVE_MONTHLY}#donate`,
    );
    const form = screen.getByRole("form");
    // Scope the "Monthly" lookup to the gift-type toggle group so we don't
    // accidentally hit the monthly-upgrade card or other "Monthly" mentions
    // elsewhere on the landing page.
    const giftType = within(form).getByRole("group", { name: /gift type/i });
    const monthlyToggle = within(giftType).getByRole("button", {
      name: new RegExp(site.copy.landing.donationModule.monthlyLabel, "i"),
    });
    expect(monthlyToggle).toHaveAttribute("aria-pressed", "true");
    // A monthly amount tile matching the URL should be pressed
    const pressedAmounts = within(form)
      .getAllByRole("button")
      .filter(
        (b) =>
          b.getAttribute("aria-pressed") === "true" &&
          b.textContent?.includes(`$${tier.amount}`),
      );
    expect(pressedAmounts.length).toBeGreaterThanOrEqual(1);
  });

  it("populates the custom-amount input when ?amount= doesn't match any preset tier", () => {
    const arbitrary = 73;
    renderLandingAt(`/?${AMOUNT_PARAM}=${arbitrary}#donate`);
    const customInput = screen.getByPlaceholderText(
      site.copy.landing.donationModule.customPlaceholder,
    ) as HTMLInputElement;
    expect(customInput.value).toBe(String(arbitrary));
  });
});
