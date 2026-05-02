import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { TransparencyPage } from "@/pages/transparency";
import site from "@config";

function renderTransparency() {
  return render(
    <MemoryRouter initialEntries={["/transparency"]}>
      <Routes>
        <Route path="/transparency" element={<TransparencyPage />} />
        <Route path="/contact" element={<div>contact page</div>} />
        <Route path="/refund-policy" element={<div>refund policy page</div>} />
        <Route
          path="/donor-bill-of-rights"
          element={<div>donor rights page</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Transparency page — hero", () => {
  beforeEach(() => renderTransparency());

  it("renders the eyebrow, h1 headline, and subhead from config", () => {
    const t = site.copy.transparency;
    expect(screen.getByText(t.hero.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: t.hero.headline }),
    ).toBeInTheDocument();
    expect(screen.getByText(t.hero.subhead)).toBeInTheDocument();
  });
});

describe("Transparency page — org snapshot", () => {
  beforeEach(() => renderTransparency());

  it("renders the org snapshot card with EIN sourced from site.org (no duplicate field)", () => {
    const card = screen.getByTestId("org-snapshot-card");
    expect(within(card).getByText(site.org.ein)).toBeInTheDocument();
  });

  it("renders legal name, founded year, status, and address from site.org", () => {
    const card = screen.getByTestId("org-snapshot-card");
    expect(within(card).getByText(site.org.name)).toBeInTheDocument();
    expect(
      within(card).getByText(String(site.org.foundedYear)),
    ).toBeInTheDocument();
    // "501(c)(3) public charity" appears in both the snapshot dl row and
    // the configured statusLine microcopy below it — both inside the card.
    expect(
      within(card).getAllByText(/501\(c\)\(3\) public charity/i).length,
    ).toBeGreaterThanOrEqual(1);
    // The <address> element splits lines with <br />, so they live in
    // separate text nodes. Assert against the card's combined textContent.
    const cardText = card.textContent ?? "";
    expect(cardText).toContain(site.org.address.line1);
    expect(cardText).toContain(
      `${site.org.address.city}, ${site.org.address.state}`,
    );
  });
});

describe("Transparency page — financials", () => {
  it("renders the FY label and every configured line with its value", () => {
    renderTransparency();
    const f = site.copy.transparency.financials;
    // Scope to the financials card — `FY{year}` may also appear as a
    // year chip on a filing card if a cloner has matching years.
    const card = screen.getByTestId("financials-card");
    expect(
      within(card).getByText(new RegExp(`FY${f.fiscalYear}\\b`)),
    ).toBeInTheDocument();
    const list = within(card).getByRole("list", {
      name: new RegExp(`FY${f.fiscalYear} financial breakdown`, "i"),
    });
    for (const line of f.lines) {
      expect(within(list).getByText(line.label)).toBeInTheDocument();
      expect(within(list).getByText(line.value)).toBeInTheDocument();
    }
  });

  it("renders a percent badge for each line that has one", () => {
    renderTransparency();
    const f = site.copy.transparency.financials;
    const list = screen.getByRole("list", {
      name: new RegExp(`FY${f.fiscalYear} financial breakdown`, "i"),
    });
    for (const line of f.lines) {
      if (typeof line.percent === "number") {
        expect(
          within(list).getByText(`${line.percent}%`),
        ).toBeInTheDocument();
      }
    }
  });

  it("falls back to the empty-state card when financials.lines is empty", () => {
    const original = site.copy.transparency.financials.lines;
    site.copy.transparency.financials.lines = [];
    try {
      renderTransparency();
      expect(screen.getByTestId("financials-empty")).toBeInTheDocument();
      expect(
        screen.queryByTestId("financials-card"),
      ).not.toBeInTheDocument();
    } finally {
      site.copy.transparency.financials.lines = original;
    }
  });
});

describe("Transparency page — filings", () => {
  it("renders one external link per filing", () => {
    renderTransparency();
    const items = site.copy.transparency.filings.items;
    const list = screen.getByRole("list", { name: /reports and filings/i });
    const links = within(list).getAllByRole("link");
    expect(links).toHaveLength(items.length);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("falls back to empty-state copy when filings.items is empty", () => {
    const original = site.copy.transparency.filings.items;
    site.copy.transparency.filings.items = [];
    try {
      renderTransparency();
      expect(screen.getByTestId("filings-empty")).toBeInTheDocument();
      expect(
        screen.queryByRole("list", { name: /reports and filings/i }),
      ).not.toBeInTheDocument();
    } finally {
      site.copy.transparency.filings.items = original;
    }
  });
});

describe("Transparency page — ratings (optional section)", () => {
  it("renders one external card per rating when configured", () => {
    expect(site.copy.transparency.ratings.items.length).toBeGreaterThan(0);
    renderTransparency();
    const list = screen.getByRole("list", {
      name: /charity ratings and affiliations/i,
    });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(site.copy.transparency.ratings.items.length);
    for (const rating of site.copy.transparency.ratings.items) {
      expect(within(list).getByText(rating.org)).toBeInTheDocument();
      expect(within(list).getByText(rating.label)).toBeInTheDocument();
    }
  });

  it("hides the entire ratings section when items is empty", () => {
    const original = site.copy.transparency.ratings.items;
    site.copy.transparency.ratings.items = [];
    try {
      renderTransparency();
      expect(screen.queryByTestId("ratings-section")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("list", {
          name: /charity ratings and affiliations/i,
        }),
      ).not.toBeInTheDocument();
    } finally {
      site.copy.transparency.ratings.items = original;
    }
  });
});

describe("Transparency page — governance", () => {
  it("renders every governance paragraph in order", () => {
    renderTransparency();
    for (const paragraph of site.copy.transparency.governance.body) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });

  it("renders the optional board roster link when configured", () => {
    expect(site.copy.transparency.governance.boardRoster).toBeTruthy();
    renderTransparency();
    const link = screen.getByTestId("governance-board-link");
    // For external (default demo) the href is preserved as-is; for
    // internal routes react-router resolves it. Both cases assert text.
    expect(link).toHaveTextContent(
      site.copy.transparency.governance.boardRoster!.label,
    );
  });

  it("renders external board roster as <a target=_blank>; internal as in-app Link", () => {
    const original = site.copy.transparency.governance.boardRoster;
    // Case 1: external
    site.copy.transparency.governance.boardRoster = {
      label: "External roster",
      href: "https://example.org/board",
      external: true,
    };
    try {
      const { unmount } = renderTransparency();
      const ext = screen.getByTestId("governance-board-link");
      expect(ext.tagName).toBe("A");
      expect(ext).toHaveAttribute("target", "_blank");
      expect(ext).toHaveAttribute("rel", "noopener noreferrer");
      expect(ext).toHaveAttribute("href", "https://example.org/board");
      unmount();
    } finally {
      site.copy.transparency.governance.boardRoster = original;
    }
    // Case 2: internal (no external flag)
    site.copy.transparency.governance.boardRoster = {
      label: "Internal roster",
      href: "/about",
    };
    try {
      renderTransparency();
      const intl = screen.getByTestId("governance-board-link");
      expect(intl.tagName).toBe("A");
      // react-router Link does NOT add target=_blank for internal routes
      expect(intl).not.toHaveAttribute("target");
      expect(intl).toHaveAttribute("href", "/about");
    } finally {
      site.copy.transparency.governance.boardRoster = original;
    }
  });

  it("hides the board roster link when not configured", () => {
    const original = site.copy.transparency.governance.boardRoster;
    site.copy.transparency.governance.boardRoster = undefined;
    try {
      renderTransparency();
      expect(
        screen.queryByTestId("governance-board-link"),
      ).not.toBeInTheDocument();
    } finally {
      site.copy.transparency.governance.boardRoster = original;
    }
  });
});

describe("Transparency page — donor commitments", () => {
  it("renders one card per commitment with title and body", () => {
    renderTransparency();
    const list = screen.getByRole("list", {
      name: /our commitments to donors/i,
    });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(
      site.copy.transparency.donorCommitments.items.length,
    );
    for (const item of site.copy.transparency.donorCommitments.items) {
      expect(
        within(list).getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
      expect(within(list).getByText(item.body)).toBeInTheDocument();
    }
  });

  it("renders internal links pointing at /refund-policy and /donor-bill-of-rights", () => {
    renderTransparency();
    const list = screen.getByRole("list", {
      name: /our commitments to donors/i,
    });
    const refundLink = within(list).getByRole("link", {
      name: /refund policy/i,
    });
    expect(refundLink).toHaveAttribute("href", "/refund-policy");
    const rightsLink = within(list).getByRole("link", {
      name: /donor bill of rights/i,
    });
    expect(rightsLink).toHaveAttribute("href", "/donor-bill-of-rights");
  });
});

describe("Transparency page — contact pointer", () => {
  it("renders a CTA pointing at the contact page", () => {
    renderTransparency();
    const cta = screen.getByTestId("transparency-contact-cta");
    expect(cta).toHaveAttribute(
      "href",
      site.copy.transparency.contactPointer.ctaHref,
    );
    expect(cta).toHaveTextContent(
      site.copy.transparency.contactPointer.ctaLabel,
    );
  });
});
