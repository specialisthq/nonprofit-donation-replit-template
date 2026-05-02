import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PrivacyPage } from "@/pages/privacy";
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
});
