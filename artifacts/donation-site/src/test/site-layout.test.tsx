import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteLayout } from "@/components/site-layout";
import site from "@config";

function renderLayout() {
  return render(
    <MemoryRouter>
      <SiteLayout>
        <div>child</div>
      </SiteLayout>
    </MemoryRouter>,
  );
}

describe("SiteLayout footer cloneCta", () => {
  const baseline = site.cloneCta;

  it("renders the clone link when cloneCta.enabled is true", () => {
    const original = site.cloneCta;
    (site as { cloneCta?: typeof original }).cloneCta = {
      label: baseline?.label ?? "Clone this site on Replit",
      replitImportUrl:
        baseline?.replitImportUrl ??
        "https://replit.com/github.com/specialisthq/nonprofit-donation-replit-template",
      enabled: true,
    };
    try {
      renderLayout();
      const link = screen.getByRole("link", { name: site.cloneCta!.label });
      expect(link).toHaveAttribute("href", site.cloneCta!.replitImportUrl);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    } finally {
      (site as { cloneCta?: typeof original }).cloneCta = original;
    }
  });

  it("hides the clone link when cloneCta.enabled is false", () => {
    const original = site.cloneCta;
    const label = baseline?.label ?? "Clone this site on Replit";
    (site as { cloneCta?: typeof original }).cloneCta = {
      label,
      replitImportUrl:
        baseline?.replitImportUrl ??
        "https://replit.com/github.com/specialisthq/nonprofit-donation-replit-template",
      enabled: false,
    };
    try {
      renderLayout();
      expect(screen.queryByRole("link", { name: label })).not.toBeInTheDocument();
    } finally {
      (site as { cloneCta?: typeof original }).cloneCta = original;
    }
  });
});
