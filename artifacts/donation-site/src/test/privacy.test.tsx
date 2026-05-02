import { afterEach, describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PrivacyPage } from "@/pages/privacy";
import { StubPage } from "@/pages/stub";
import { SiteLayout } from "@/components/site-layout";
import { site } from "@/../site.config";

function renderPrivacy() {
  return render(
    <MemoryRouter initialEntries={["/privacy"]}>
      <SiteLayout>
        <PrivacyPage />
      </SiteLayout>
    </MemoryRouter>,
  );
}

describe("PrivacyPage", () => {
  it("renders the title as an h1", () => {
    renderPrivacy();
    const title = screen.getByTestId("privacy-title");
    expect(title.tagName).toBe("H1");
    expect(title).toHaveTextContent(site.copy.legal.privacy.title);
  });

  it("renders the last-updated date from config", () => {
    renderPrivacy();
    const lastUpdated = screen.getByTestId("privacy-last-updated");
    expect(lastUpdated).toHaveTextContent(site.copy.legal.privacy.lastUpdated);
  });

  it("renders the org name and EIN", () => {
    renderPrivacy();
    const main = screen.getByRole("main");
    expect(main.textContent).toContain(site.org.name);
    expect(main.textContent).toContain(site.org.ein);
  });

  it("renders the legal disclaimer banner prominently", () => {
    renderPrivacy();
    const banner = screen.getByTestId("legal-disclaimer");
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent(site.copy.legal.disclaimer.heading);
    expect(banner).toHaveTextContent(site.copy.legal.disclaimer.body);
  });

  it("renders the intro paragraph", () => {
    renderPrivacy();
    expect(screen.getByTestId("privacy-intro")).toHaveTextContent(
      site.copy.legal.privacy.intro,
    );
  });

  it("renders every configured section with heading + body", () => {
    renderPrivacy();
    for (const section of site.copy.legal.privacy.sections) {
      const node = screen.getByTestId(`privacy-section-${section.id}`);
      expect(node).toBeInTheDocument();
      const h2 = within(node).getByRole("heading", { level: 2 });
      expect(h2).toHaveTextContent(section.heading);
      for (const paragraph of section.body) {
        expect(node.textContent).toContain(paragraph);
      }
    }
  });

  it("renders bullet lists when sections have bullets", () => {
    renderPrivacy();
    const sectionsWithBullets = site.copy.legal.privacy.sections.filter(
      (s) => s.bullets && s.bullets.length > 0,
    );
    expect(sectionsWithBullets.length).toBeGreaterThan(0);
    for (const section of sectionsWithBullets) {
      const node = screen.getByTestId(`privacy-section-${section.id}`);
      const list = within(node).getByRole("list");
      const items = within(list).getAllByRole("listitem");
      expect(items).toHaveLength(section.bullets!.length);
      section.bullets!.forEach((b, i) => {
        expect(items[i].textContent).toContain(b);
      });
    }
  });

  it("links to the contact page from the final section", () => {
    renderPrivacy();
    const link = screen.getByTestId("privacy-contact-link");
    expect(link).toHaveAttribute("href", "/contact");
  });

  it("uses semantic section anchors for each policy section", () => {
    renderPrivacy();
    for (const section of site.copy.legal.privacy.sections) {
      const node = screen.getByTestId(`privacy-section-${section.id}`);
      expect(node).toHaveAttribute("id", section.id);
    }
  });

  it("includes a 'never sell' commitment in the policy text", () => {
    renderPrivacy();
    const main = screen.getByRole("main");
    expect(main.textContent?.toLowerCase()).toContain("never sell");
  });

  it("addresses PayPal as the payment processor", () => {
    renderPrivacy();
    const main = screen.getByRole("main");
    expect(main.textContent).toContain("PayPal");
  });

  it("renders the contact email in the page header and final section", () => {
    renderPrivacy();
    const headerEmail = screen.getByTestId("privacy-header-email");
    expect(headerEmail).toHaveTextContent(site.org.contactEmail);
    expect(headerEmail).toHaveAttribute(
      "href",
      `mailto:${site.org.contactEmail}`,
    );
    const contactEmail = screen.getByTestId("privacy-contact-email");
    expect(contactEmail).toHaveTextContent(site.org.contactEmail);
    expect(contactEmail).toHaveAttribute(
      "href",
      `mailto:${site.org.contactEmail}`,
    );
  });

  it("does not hard-code the org name in policy prose", () => {
    expect(site.copy.legal.privacy.intro).not.toContain(site.org.name);
    for (const section of site.copy.legal.privacy.sections) {
      for (const paragraph of section.body) {
        expect(paragraph).not.toContain(site.org.name);
      }
    }
  });
});

describe("Privacy page — route + navigation (E2E-style)", () => {
  function renderApp(initialPath: string) {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <SiteLayout>
          <Routes>
            <Route path="/" element={<div data-testid="home-stub">home</div>} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route
              path="/terms"
              element={<StubPage title="Terms of use" legal />}
            />
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

  it("loads /privacy via the router with the disclaimer visible", () => {
    renderApp("/privacy");
    expect(screen.getByTestId("privacy-title")).toBeInTheDocument();
    expect(screen.getByTestId("legal-disclaimer")).toBeInTheDocument();
  });

  it("navigates from the footer Privacy link to /privacy", () => {
    renderApp("/");
    const privacyLinks = screen
      .getAllByRole("link", { name: /privacy policy/i })
      .filter((el) => el.getAttribute("href") === "/privacy");
    expect(privacyLinks.length).toBeGreaterThan(0);
    fireEvent.click(privacyLinks[0]);
    expect(screen.getByTestId("privacy-title")).toBeInTheDocument();
  });

  it("navigates from /privacy to /contact via the in-text link", () => {
    renderApp("/privacy");
    fireEvent.click(screen.getByTestId("privacy-contact-link"));
    expect(screen.getByTestId("contact-stub")).toBeInTheDocument();
  });

  it("shares the disclaimer wording across all four legal pages", () => {
    for (const path of [
      "/privacy",
      "/terms",
      "/refund-policy",
      "/donor-bill-of-rights",
    ]) {
      const { unmount } = renderApp(path);
      const banner = screen.getByTestId("legal-disclaimer");
      expect(banner).toHaveTextContent(site.copy.legal.disclaimer.heading);
      expect(banner).toHaveTextContent(site.copy.legal.disclaimer.body);
      unmount();
    }
  });
});

describe("Privacy page — responsive viewport smoke", () => {
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
        <MemoryRouter initialEntries={["/privacy"]}>
          <SiteLayout>
            <PrivacyPage />
          </SiteLayout>
        </MemoryRouter>,
      );
      expect(screen.getByTestId("privacy-title")).toBeInTheDocument();
      expect(screen.getByTestId("legal-disclaimer")).toBeInTheDocument();
      expect(screen.getByTestId("privacy-intro")).toBeInTheDocument();
      expect(screen.getByTestId("privacy-contact-link")).toHaveAttribute(
        "href",
        "/contact",
      );
    });
  }
});
