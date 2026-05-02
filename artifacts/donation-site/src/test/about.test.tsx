import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AboutPage } from "@/pages/about";
import { LandingPage } from "@/pages/landing";
import site from "@config";

function renderAbout(initialEntries: string[] = ["/about"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("About page — mission hero", () => {
  beforeEach(() => renderAbout());

  it("renders the configured eyebrow, headline, and subhead", () => {
    expect(
      screen.getByText(site.copy.about.eyebrow, { selector: "p" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: site.copy.about.headline }),
    ).toBeInTheDocument();
    expect(screen.getByText(site.copy.about.subhead)).toBeInTheDocument();
  });

  it("includes the org's mission one-liner directly from org config (single source of truth)", () => {
    expect(screen.getByText(site.org.missionOneLiner)).toBeInTheDocument();
  });

  it("renders an accessible hero image (real <img> when src is set, otherwise a labeled placeholder)", () => {
    const cfg = site.copy.about.image;
    const expectedAlt = cfg?.alt ?? site.org.name;
    if (cfg?.src) {
      const img = screen.getByRole("img", { name: expectedAlt });
      expect(img).toHaveAttribute("src", cfg.src);
    } else {
      // Placeholder uses role="img" + aria-label so it remains accessible
      // even when no photo has been provided yet.
      expect(screen.getByRole("img", { name: expectedAlt })).toBeInTheDocument();
    }
  });
});

describe("About page — story block", () => {
  it("renders every configured story paragraph in order", () => {
    renderAbout();
    for (const paragraph of site.copy.about.story) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });
});

describe("About page — values section", () => {
  beforeEach(() => renderAbout());

  it("renders one card per configured value with title and body", () => {
    const list = screen.getByRole("list", { name: /our values/i });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(site.copy.about.values.items.length);
    for (const value of site.copy.about.values.items) {
      expect(
        within(list).getByRole("heading", { level: 3, name: value.title }),
      ).toBeInTheDocument();
      expect(within(list).getByText(value.body)).toBeInTheDocument();
    }
  });

  it("renders the section heading and (when set) subhead", () => {
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: site.copy.about.values.headline,
      }),
    ).toBeInTheDocument();
    if (site.copy.about.values.subhead) {
      expect(
        screen.getByText(site.copy.about.values.subhead),
      ).toBeInTheDocument();
    }
  });
});

describe("About page — team section (optional)", () => {
  it("renders one card per team member when team is configured", () => {
    expect(site.copy.about.team).toBeTruthy();
    renderAbout();
    const list = screen.getByRole("list", { name: /team members/i });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(site.copy.about.team!.members.length);
    for (const member of site.copy.about.team!.members) {
      expect(within(list).getByText(member.name)).toBeInTheDocument();
      expect(within(list).getByText(member.role)).toBeInTheDocument();
    }
  });

  it("hides the entire team section when team is omitted from config", () => {
    const original = site.copy.about.team;
    site.copy.about.team = undefined;
    try {
      renderAbout();
      expect(screen.queryByTestId("team-section")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("list", { name: /team members/i }),
      ).not.toBeInTheDocument();
    } finally {
      site.copy.about.team = original;
    }
  });

  it("hides the team section when team.members is an empty array", () => {
    const original = site.copy.about.team;
    if (!original) {
      throw new Error("Demo config is missing a `team` block — adjust this test.");
    }
    site.copy.about.team = { ...original, members: [] };
    try {
      renderAbout();
      expect(screen.queryByTestId("team-section")).not.toBeInTheDocument();
    } finally {
      site.copy.about.team = original;
    }
  });

  it("falls back to an initials chip when a team member has no photoPath", () => {
    expect(site.copy.about.team).toBeTruthy();
    const allMembersHaveNoPhoto = site.copy.about.team!.members.every(
      (m) => !m.photoPath,
    );
    expect(allMembersHaveNoPhoto).toBe(true);
    renderAbout();
    // No <img> tags should appear inside the team list when nobody has a photo.
    const list = screen.getByRole("list", { name: /team members/i });
    expect(within(list).queryAllByRole("img")).toHaveLength(0);
  });
});

describe("About page — closing CTA", () => {
  it("renders a primary CTA that points back to the landing page (donation flow)", () => {
    renderAbout();
    const cta = screen.getByTestId("about-closing-cta");
    expect(cta).toHaveAttribute("href", "/");
    expect(cta).toHaveTextContent(site.copy.about.closingCta.ctaLabel);
  });
});
