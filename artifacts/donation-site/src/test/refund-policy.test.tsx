import { afterEach, describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RefundPolicyPage } from "@/pages/refund-policy";
import { StubPage } from "@/pages/stub";
import { SiteLayout } from "@/components/site-layout";
import { site } from "@/../site.config";

function renderRefund() {
  return render(
    <MemoryRouter initialEntries={["/refund-policy"]}>
      <SiteLayout>
        <RefundPolicyPage />
      </SiteLayout>
    </MemoryRouter>,
  );
}

describe("RefundPolicyPage", () => {
  it("renders the title as an h1", () => {
    renderRefund();
    const title = screen.getByTestId("refund-title");
    expect(title.tagName).toBe("H1");
    expect(title).toHaveTextContent(site.copy.legal.refundPolicy.title);
  });

  it("renders the last-updated date from config", () => {
    renderRefund();
    expect(screen.getByTestId("refund-last-updated")).toHaveTextContent(
      site.copy.legal.refundPolicy.lastUpdated,
    );
  });

  it("renders the org name, EIN, and contact email in the header", () => {
    renderRefund();
    const main = screen.getByRole("main");
    expect(main.textContent).toContain(site.org.name);
    expect(main.textContent).toContain(site.org.ein);
    const headerEmail = screen.getByTestId("refund-header-email");
    expect(headerEmail).toHaveAttribute(
      "href",
      `mailto:${site.org.contactEmail}`,
    );
  });

  it("renders the shared legal disclaimer banner with consistent wording", () => {
    renderRefund();
    const banner = screen.getByTestId("legal-disclaimer");
    expect(banner).toHaveTextContent(site.copy.legal.disclaimer.heading);
    expect(banner).toHaveTextContent(site.copy.legal.disclaimer.body);
  });

  it("interpolates {orgName} and {contactEmail} into the intro", () => {
    renderRefund();
    const intro = screen.getByTestId("refund-intro");
    expect(intro.textContent).toContain(site.org.name);
    expect(intro.textContent).toContain(site.org.contactEmail);
    expect(intro.textContent).not.toContain("{orgName}");
    expect(intro.textContent).not.toContain("{contactEmail}");
  });

  it("renders every configured section with heading + body", () => {
    renderRefund();
    for (const section of site.copy.legal.refundPolicy.sections) {
      const node = screen.getByTestId(`refund-section-${section.id}`);
      expect(node).toBeInTheDocument();
      const h2 = within(node).getByRole("heading", { level: 2 });
      expect(h2).toHaveTextContent(section.heading);
    }
  });

  it("explains how to request a correction with bullets", () => {
    renderRefund();
    const node = screen.getByTestId("refund-section-request-correction");
    const linkList = screen.getByTestId(
      "refund-section-request-correction-links",
    );
    const lists = within(node).getAllByRole("list");
    const bulletList = lists.find((l) => l !== linkList);
    expect(bulletList).toBeDefined();
    const items = within(bulletList!).getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  it("links to PayPal's automatic-payments page in the cancel-monthly section", () => {
    renderRefund();
    const linkList = screen.getByTestId(
      "refund-section-cancel-monthly-links",
    );
    const paypalAuto = within(linkList).getByRole("link", {
      name: /manage your paypal automatic payments/i,
    });
    expect(paypalAuto).toHaveAttribute(
      "href",
      "https://www.paypal.com/myaccount/autopay/",
    );
    expect(paypalAuto).toHaveAttribute("target", "_blank");
    expect(paypalAuto).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("links to PayPal's recurring-payment cancellation help article", () => {
    renderRefund();
    const linkList = screen.getByTestId(
      "refund-section-cancel-monthly-links",
    );
    const helpArticle = within(linkList).getByRole("link", {
      name: /cancel a recurring payment/i,
    });
    expect(helpArticle).toHaveAttribute(
      "href",
      "https://www.paypal.com/us/cshelp/article/how-do-i-cancel-an-automatic-payment-or-recurring-payment-help193",
    );
    expect(helpArticle).toHaveAttribute("target", "_blank");
  });

  it("addresses tax-receipt corrections after a refund", () => {
    renderRefund();
    const node = screen.getByTestId("refund-section-tax-receipts");
    expect(node.textContent?.toLowerCase()).toContain("tax");
    expect(node.textContent?.toLowerCase()).toContain("acknowledgment");
  });

  it("addresses refund eligibility & timeline", () => {
    renderRefund();
    const node = screen.getByTestId("refund-section-eligibility");
    expect(node.textContent?.toLowerCase()).toMatch(
      /3.{0,3}5 business days|business days/i,
    );
  });

  it("renders the email refund-request mailto with subject line", () => {
    renderRefund();
    const linkList = screen.getByTestId(
      "refund-section-request-correction-links",
    );
    const emailLink = within(linkList).getByRole("link", {
      name: /email a refund request/i,
    });
    const href = emailLink.getAttribute("href") ?? "";
    expect(href.startsWith("mailto:")).toBe(true);
    expect(href).toContain(site.org.contactEmail);
    expect(href.toLowerCase()).toContain("subject=refund");
  });

  it("links to the contact page from the final contact section", () => {
    renderRefund();
    const link = screen.getByTestId("refund-contact-link");
    expect(link).toHaveAttribute("href", "/contact");
    const email = screen.getByTestId("refund-contact-email");
    expect(email).toHaveAttribute("href", `mailto:${site.org.contactEmail}`);
  });

  it("uses semantic anchors on each section", () => {
    renderRefund();
    for (const section of site.copy.legal.refundPolicy.sections) {
      const node = screen.getByTestId(`refund-section-${section.id}`);
      expect(node).toHaveAttribute("id", section.id);
    }
  });

  it("does not leak any unresolved {token} placeholders", () => {
    renderRefund();
    const main = screen.getByRole("main");
    expect(main.textContent).not.toMatch(/\{(orgName|contactEmail|state|ein|shortName)\}/);
  });
});

describe("Refund policy page — route + navigation (E2E-style)", () => {
  function renderApp(initialPath: string) {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <SiteLayout>
          <Routes>
            <Route path="/" element={<div data-testid="home-stub">home</div>} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
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

  it("loads /refund-policy via the router with disclaimer visible", () => {
    renderApp("/refund-policy");
    expect(screen.getByTestId("refund-title")).toBeInTheDocument();
    expect(screen.getByTestId("legal-disclaimer")).toBeInTheDocument();
  });

  it("navigates from the footer Refund Policy link to /refund-policy", () => {
    renderApp("/");
    const links = screen
      .getAllByRole("link", { name: /refund policy/i })
      .filter((el) => el.getAttribute("href") === "/refund-policy");
    expect(links.length).toBeGreaterThan(0);
    fireEvent.click(links[0]);
    expect(screen.getByTestId("refund-title")).toBeInTheDocument();
  });

  it("navigates from /refund-policy to /contact via the in-text link", () => {
    renderApp("/refund-policy");
    fireEvent.click(screen.getByTestId("refund-contact-link"));
    expect(screen.getByTestId("contact-stub")).toBeInTheDocument();
  });

  it("uses the same disclaimer wording as the other legal pages", () => {
    for (const path of ["/refund-policy", "/donor-bill-of-rights"]) {
      const { unmount } = renderApp(path);
      const banner = screen.getByTestId("legal-disclaimer");
      expect(banner).toHaveTextContent(site.copy.legal.disclaimer.heading);
      expect(banner).toHaveTextContent(site.copy.legal.disclaimer.body);
      unmount();
    }
  });
});

describe("Refund policy page — responsive viewport smoke", () => {
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
        <MemoryRouter initialEntries={["/refund-policy"]}>
          <SiteLayout>
            <RefundPolicyPage />
          </SiteLayout>
        </MemoryRouter>,
      );
      expect(screen.getByTestId("refund-title")).toBeInTheDocument();
      expect(screen.getByTestId("legal-disclaimer")).toBeInTheDocument();
      expect(screen.getByTestId("refund-intro")).toBeInTheDocument();
      expect(screen.getByTestId("refund-contact-link")).toHaveAttribute(
        "href",
        "/contact",
      );
    });
  }
});
