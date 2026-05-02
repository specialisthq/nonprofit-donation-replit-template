import { afterEach, describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DonorBillOfRightsPage } from "@/pages/donor-bill-of-rights";
import { PrivacyPage } from "@/pages/privacy";
import { RefundPolicyPage } from "@/pages/refund-policy";
import { TermsPage } from "@/pages/terms";
import { SiteLayout } from "@/components/site-layout";
import { site } from "@/../site.config";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/donor-bill-of-rights"]}>
      <SiteLayout>
        <DonorBillOfRightsPage />
      </SiteLayout>
    </MemoryRouter>,
  );
}

describe("DonorBillOfRightsPage", () => {
  it("renders the title as an h1", () => {
    renderPage();
    const title = screen.getByTestId("donor-rights-title");
    expect(title.tagName).toBe("H1");
    expect(title).toHaveTextContent(
      site.copy.legal.donorBillOfRights.title,
    );
  });

  it("renders the last-updated date from config", () => {
    renderPage();
    expect(screen.getByTestId("donor-rights-last-updated")).toHaveTextContent(
      site.copy.legal.donorBillOfRights.lastUpdated,
    );
  });

  it("renders the org name + EIN + email in the header", () => {
    renderPage();
    const main = screen.getByRole("main");
    expect(main.textContent).toContain(site.org.name);
    expect(main.textContent).toContain(site.org.ein);
    expect(screen.getByTestId("donor-rights-header-email")).toHaveAttribute(
      "href",
      `mailto:${site.org.contactEmail}`,
    );
  });

  it("renders the lighter sector-standard disclaimer (not the default starter wording)", () => {
    renderPage();
    const banner = screen.getByTestId("legal-disclaimer");
    expect(banner).toHaveTextContent(site.copy.legal.disclaimerLight.heading);
    expect(banner).toHaveTextContent(site.copy.legal.disclaimerLight.body);
    expect(banner).not.toHaveTextContent(site.copy.legal.disclaimer.heading);
  });

  it("renders the org-voice intro with {orgName} interpolated", () => {
    renderPage();
    const intro = screen.getByTestId("donor-rights-intro");
    expect(intro.textContent).toContain(site.org.name);
    expect(intro.textContent).not.toContain("{orgName}");
  });

  it("renders all ten standard rights, each with plain-language commentary", () => {
    renderPage();
    for (let i = 1; i <= 10; i++) {
      const node = screen.getByTestId(`donor-rights-section-right-${i}`);
      expect(node).toBeInTheDocument();
      const h2 = within(node).getByRole("heading", { level: 2 });
      expect(h2.textContent ?? "").toMatch(
        new RegExp(`^(I{1,3}|IV|V|VI{0,3}|IX|X)\\.`),
      );
      const paragraphs = within(node).getAllByText(/.+/i, {
        selector: "p",
      });
      expect(paragraphs.length).toBeGreaterThanOrEqual(2);
      const plain = paragraphs.some((p) =>
        /in plain language/i.test(p.textContent ?? ""),
      );
      expect(plain).toBe(true);
    }
  });

  it("attributes the bill of rights to AFP, AHP, CASE, and Giving Institute", () => {
    renderPage();
    const node = screen.getByTestId("donor-rights-section-attribution");
    const text = node.textContent ?? "";
    expect(text).toMatch(/Association of Fundraising Professionals/i);
    expect(text).toMatch(/Association for Healthcare Philanthropy/i);
    expect(text).toMatch(/Council for Advancement and Support of Education/i);
    expect(text).toMatch(/Giving Institute/i);
  });

  it("renders a 'How we live this out' closing section with internal links", () => {
    renderPage();
    const node = screen.getByTestId("donor-rights-section-how-we-live-it");
    expect(node).toBeInTheDocument();
    const linkList = screen.getByTestId(
      "donor-rights-section-how-we-live-it-links",
    );
    const links = within(linkList).getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(4);

    const hrefs = links.map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        "/transparency",
        "/privacy",
        "/refund-policy",
        "/terms",
      ]),
    );
  });

  it("renders internal closing-section links as react-router Link (no full-page reload semantics)", () => {
    renderPage();
    const linkList = screen.getByTestId(
      "donor-rights-section-how-we-live-it-links",
    );
    for (const link of within(linkList).getAllByRole("link")) {
      expect(link).not.toHaveAttribute("target", "_blank");
    }
  });

  it("links to the contact page from the closing contact slot", () => {
    renderPage();
    expect(screen.getByTestId("donor-rights-contact-link")).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByTestId("donor-rights-contact-email")).toHaveAttribute(
      "href",
      `mailto:${site.org.contactEmail}`,
    );
  });

  it("uses semantic anchors on every section", () => {
    renderPage();
    for (const section of site.copy.legal.donorBillOfRights.sections) {
      const node = screen.getByTestId(
        `donor-rights-section-${section.id}`,
      );
      expect(node).toHaveAttribute("id", section.id);
    }
  });

  it("does not leak any unresolved {token} placeholders", () => {
    renderPage();
    const main = screen.getByRole("main");
    expect(main.textContent).not.toMatch(
      /\{(orgName|contactEmail|state|ein|shortName)\}/,
    );
  });
});

describe("Donor bill of rights — route + navigation (E2E-style)", () => {
  function renderApp(initialPath: string) {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <SiteLayout>
          <Routes>
            <Route path="/" element={<div data-testid="home-stub">home</div>} />
            <Route
              path="/donor-bill-of-rights"
              element={<DonorBillOfRightsPage />}
            />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route
              path="/transparency"
              element={
                <div data-testid="transparency-stub">transparency</div>
              }
            />
            <Route
              path="/contact"
              element={<div data-testid="contact-stub">contact</div>}
            />
          </Routes>
        </SiteLayout>
      </MemoryRouter>,
    );
  }

  it("loads /donor-bill-of-rights via the router with disclaimer visible", () => {
    renderApp("/donor-bill-of-rights");
    expect(screen.getByTestId("donor-rights-title")).toBeInTheDocument();
    expect(screen.getByTestId("legal-disclaimer")).toBeInTheDocument();
  });

  it("navigates from the footer link to /donor-bill-of-rights", () => {
    renderApp("/");
    const links = screen
      .getAllByRole("link", { name: /donor bill of rights/i })
      .filter((el) => el.getAttribute("href") === "/donor-bill-of-rights");
    expect(links.length).toBeGreaterThan(0);
    fireEvent.click(links[0]);
    expect(screen.getByTestId("donor-rights-title")).toBeInTheDocument();
  });

  it("internal closing links navigate to /privacy, /refund-policy, /transparency, and /terms", () => {
    const targets: { name: RegExp; testId: string; route: string }[] = [
      {
        name: /donor privacy: we never sell/i,
        testId: "privacy-title",
        route: "/privacy",
      },
      {
        name: /cancel a monthly gift anytime/i,
        testId: "refund-title",
        route: "/refund-policy",
      },
      {
        name: /transparent financials/i,
        testId: "transparency-stub",
        route: "/transparency",
      },
      {
        name: /terms of use/i,
        testId: "terms-title",
        route: "/terms",
      },
    ];

    for (const t of targets) {
      const { unmount } = renderApp("/donor-bill-of-rights");
      const linkList = screen.getByTestId(
        "donor-rights-section-how-we-live-it-links",
      );
      const link = within(linkList).getByRole("link", { name: t.name });
      expect(link).toHaveAttribute("href", t.route);
      fireEvent.click(link);
      expect(screen.getByTestId(t.testId)).toBeInTheDocument();
      unmount();
    }
  });

  it("navigates from /donor-bill-of-rights to /contact via the in-text link", () => {
    renderApp("/donor-bill-of-rights");
    fireEvent.click(screen.getByTestId("donor-rights-contact-link"));
    expect(screen.getByTestId("contact-stub")).toBeInTheDocument();
  });
});

describe("Donor bill of rights — responsive viewport smoke", () => {
  const originalWidth = window.innerWidth;
  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalWidth,
    });
  });

  for (const width of [375, 768, 1280]) {
    it(`renders core elements at ${width}px width`, () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: width,
      });
      act(() => {
        window.dispatchEvent(new Event("resize"));
      });
      render(
        <MemoryRouter initialEntries={["/donor-bill-of-rights"]}>
          <SiteLayout>
            <DonorBillOfRightsPage />
          </SiteLayout>
        </MemoryRouter>,
      );
      expect(screen.getByTestId("donor-rights-title")).toBeInTheDocument();
      expect(screen.getByTestId("legal-disclaimer")).toBeInTheDocument();
      expect(screen.getByTestId("donor-rights-intro")).toBeInTheDocument();
      expect(
        screen.getByTestId("donor-rights-section-right-1"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("donor-rights-section-right-10"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(
          "donor-rights-section-how-we-live-it-links",
        ),
      ).toBeInTheDocument();
    });
  }
});
