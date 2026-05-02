import { afterEach, describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TermsPage } from "@/pages/terms";
import { StubPage } from "@/pages/stub";
import { SiteLayout } from "@/components/site-layout";
import { site } from "@/../site.config";

function renderTerms() {
  return render(
    <MemoryRouter initialEntries={["/terms"]}>
      <SiteLayout>
        <TermsPage />
      </SiteLayout>
    </MemoryRouter>,
  );
}

describe("TermsPage", () => {
  it("renders the title as an h1", () => {
    renderTerms();
    const title = screen.getByTestId("terms-title");
    expect(title.tagName).toBe("H1");
    expect(title).toHaveTextContent(site.copy.legal.terms.title);
  });

  it("renders the last-updated date from config", () => {
    renderTerms();
    expect(screen.getByTestId("terms-last-updated")).toHaveTextContent(
      site.copy.legal.terms.lastUpdated,
    );
  });

  it("renders the org name, EIN, and contact email in the header", () => {
    renderTerms();
    const main = screen.getByRole("main");
    expect(main.textContent).toContain(site.org.name);
    expect(main.textContent).toContain(site.org.ein);
    const headerEmail = screen.getByTestId("terms-header-email");
    expect(headerEmail).toHaveTextContent(site.org.contactEmail);
    expect(headerEmail).toHaveAttribute(
      "href",
      `mailto:${site.org.contactEmail}`,
    );
  });

  it("renders the shared legal disclaimer banner prominently", () => {
    renderTerms();
    const banner = screen.getByTestId("legal-disclaimer");
    expect(banner).toHaveTextContent(site.copy.legal.disclaimer.heading);
    expect(banner).toHaveTextContent(site.copy.legal.disclaimer.body);
  });

  it("renders the intro with {contactEmail} interpolated", () => {
    renderTerms();
    const intro = screen.getByTestId("terms-intro");
    expect(intro.textContent).toContain(site.org.contactEmail);
    expect(intro.textContent).not.toContain("{contactEmail}");
  });

  it("renders every configured section with heading + body", () => {
    renderTerms();
    for (const section of site.copy.legal.terms.sections) {
      const node = screen.getByTestId(`terms-section-${section.id}`);
      expect(node).toBeInTheDocument();
      const h2 = within(node).getByRole("heading", { level: 2 });
      expect(h2).toHaveTextContent(section.heading);
    }
  });

  it("renders bullet lists when sections have bullets", () => {
    renderTerms();
    const sectionsWithBullets = site.copy.legal.terms.sections.filter(
      (s) => s.bullets && s.bullets.length > 0,
    );
    expect(sectionsWithBullets.length).toBeGreaterThan(0);
    for (const section of sectionsWithBullets) {
      const node = screen.getByTestId(`terms-section-${section.id}`);
      const list = within(node).getByRole("list");
      const items = within(list).getAllByRole("listitem");
      expect(items).toHaveLength(section.bullets!.length);
    }
  });

  it("interpolates {orgName} into prose (no raw token visible)", () => {
    renderTerms();
    const main = screen.getByRole("main");
    expect(main.textContent).not.toContain("{orgName}");
    expect(main.textContent).toContain(site.org.name);
  });

  it("interpolates {state} into the governing-law section", () => {
    renderTerms();
    const node = screen.getByTestId("terms-section-governing-law");
    expect(node.textContent).not.toContain("{state}");
    expect(node.textContent).toContain(site.copy.legal.governingState);
  });

  it("calls out PayPal as the third-party payment processor", () => {
    renderTerms();
    const node = screen.getByTestId("terms-section-donations");
    expect(node.textContent).toContain("PayPal");
  });

  it("links to the contact page from the final section", () => {
    renderTerms();
    const link = screen.getByTestId("terms-contact-link");
    expect(link).toHaveAttribute("href", "/contact");
    const email = screen.getByTestId("terms-contact-email");
    expect(email).toHaveAttribute("href", `mailto:${site.org.contactEmail}`);
  });

  it("uses semantic section anchors for each section", () => {
    renderTerms();
    for (const section of site.copy.legal.terms.sections) {
      const node = screen.getByTestId(`terms-section-${section.id}`);
      expect(node).toHaveAttribute("id", section.id);
    }
  });
});

describe("Terms page — route + navigation (E2E-style)", () => {
  function renderApp(initialPath: string) {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <SiteLayout>
          <Routes>
            <Route path="/" element={<div data-testid="home-stub">home</div>} />
            <Route path="/terms" element={<TermsPage />} />
            <Route
              path="/refund-policy"
              element={
                <StubPage title="Refund / correction policy" legal />
              }
            />
            <Route
              path="/donor-bill-of-rights"
              element={<StubPage title="Donor bill of rights" legal />}
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

  it("loads /terms via the router with disclaimer visible", () => {
    renderApp("/terms");
    expect(screen.getByTestId("terms-title")).toBeInTheDocument();
    expect(screen.getByTestId("legal-disclaimer")).toBeInTheDocument();
  });

  it("navigates from the footer Terms link to /terms", () => {
    renderApp("/");
    const links = screen
      .getAllByRole("link", { name: /terms of use/i })
      .filter((el) => el.getAttribute("href") === "/terms");
    expect(links.length).toBeGreaterThan(0);
    fireEvent.click(links[0]);
    expect(screen.getByTestId("terms-title")).toBeInTheDocument();
  });

  it("navigates from /terms to /contact via the in-text link", () => {
    renderApp("/terms");
    fireEvent.click(screen.getByTestId("terms-contact-link"));
    expect(screen.getByTestId("contact-stub")).toBeInTheDocument();
  });

  it("uses the same disclaimer wording as the other legal pages", () => {
    for (const path of ["/terms", "/refund-policy", "/donor-bill-of-rights"]) {
      const { unmount } = renderApp(path);
      const banner = screen.getByTestId("legal-disclaimer");
      expect(banner).toHaveTextContent(site.copy.legal.disclaimer.heading);
      expect(banner).toHaveTextContent(site.copy.legal.disclaimer.body);
      unmount();
    }
  });
});

describe("Terms page — responsive viewport smoke", () => {
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
        <MemoryRouter initialEntries={["/terms"]}>
          <SiteLayout>
            <TermsPage />
          </SiteLayout>
        </MemoryRouter>,
      );
      expect(screen.getByTestId("terms-title")).toBeInTheDocument();
      expect(screen.getByTestId("legal-disclaimer")).toBeInTheDocument();
      expect(screen.getByTestId("terms-intro")).toBeInTheDocument();
      expect(screen.getByTestId("terms-contact-link")).toHaveAttribute(
        "href",
        "/contact",
      );
    });
  }
});
