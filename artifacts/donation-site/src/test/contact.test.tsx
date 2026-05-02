import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ContactPage } from "@/pages/contact";
import site from "@config";

function renderContact() {
  return render(
    <MemoryRouter initialEntries={["/contact"]}>
      <Routes>
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Contact page — hero", () => {
  beforeEach(() => renderContact());

  it("renders the configured eyebrow, h1, and subhead", () => {
    const c = site.copy.contact;
    expect(screen.getByText(c.hero.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: c.hero.headline }),
    ).toBeInTheDocument();
    expect(screen.getByText(c.hero.subhead)).toBeInTheDocument();
  });
});

describe("Contact page — methods card", () => {
  beforeEach(() => renderContact());

  it("renders email/phone/address pulled from site.org as the single source of truth", () => {
    const card = screen.getByTestId("contact-methods-card");
    const email = within(card).getByRole("link", {
      name: site.org.contactEmail,
    });
    expect(email).toHaveAttribute("href", `mailto:${site.org.contactEmail}`);
    if (site.org.phone) {
      expect(
        within(card).getByRole("link", { name: site.org.phone }),
      ).toBeInTheDocument();
    }
    // <address> joins line1/line2/city/state/zip with <br />, so the
    // text is split across nodes — assert against textContent instead
    // of relying on getByText finding a single matching node.
    const addressEl = card.querySelector("address");
    expect(addressEl).not.toBeNull();
    expect(addressEl!.textContent).toContain(site.org.address.line1);
    expect(addressEl!.textContent).toContain(site.org.address.city);
    expect(addressEl!.textContent).toContain(site.org.address.zip);
    expect(
      within(card).getByText(site.copy.contact.methods.responseTime),
    ).toBeInTheDocument();
  });
});

describe("Contact page — reasons list", () => {
  beforeEach(() => renderContact());

  it("renders one anchored card per configured reason", () => {
    const list = screen.getByRole("list", {
      name: /common reasons donors reach out/i,
    });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(site.copy.contact.reasons.items.length);
    for (const reason of site.copy.contact.reasons.items) {
      expect(
        within(list).getByText(reason.topic),
      ).toBeInTheDocument();
      // Each <li> uses the reason id as its DOM id so #stock-daf etc.
      // deep-link to the right card.
      expect(document.getElementById(reason.id)).not.toBeNull();
      // And the inner anchor links back to itself so the URL hash
      // updates when clicked, enabling form-topic preselection.
      expect(
        screen.getByTestId(`contact-reason-${reason.id}`),
      ).toHaveAttribute("href", `#${reason.id}`);
    }
  });
});

describe("Contact page — mailto form validation", () => {
  beforeEach(() => renderContact());

  function submit() {
    fireEvent.submit(screen.getByTestId("contact-form"));
  }

  it("shows required errors for empty name, email, and message", () => {
    submit();
    const errs = site.copy.contact.form.errors;
    expect(screen.getByText(errs.nameRequired)).toBeInTheDocument();
    expect(screen.getByText(errs.emailRequired)).toBeInTheDocument();
    expect(screen.getByText(errs.messageRequired)).toBeInTheDocument();
    // Form is still rendered (no success state yet).
    expect(screen.queryByTestId("contact-form-success")).not.toBeInTheDocument();
  });

  it("flags an invalid email when name + message are filled", () => {
    fireEvent.change(screen.getByLabelText(site.copy.contact.form.nameLabel), {
      target: { value: "Avery Donor" },
    });
    fireEvent.change(
      screen.getByLabelText(site.copy.contact.form.emailLabel),
      { target: { value: "not-an-email" } },
    );
    fireEvent.change(
      screen.getByLabelText(site.copy.contact.form.messageLabel),
      { target: { value: "Hello there." } },
    );
    submit();
    expect(
      screen.getByText(site.copy.contact.form.errors.emailInvalid),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(site.copy.contact.form.errors.emailRequired),
    ).not.toBeInTheDocument();
  });

  it("ties errors to inputs with aria-describedby for assistive tech", () => {
    submit();
    const nameInput = screen.getByLabelText(site.copy.contact.form.nameLabel);
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAttribute(
      "aria-describedby",
      "contact-name-error",
    );
    expect(document.getElementById("contact-name-error")).not.toBeNull();
  });
});

describe("Contact page — mailto form success", () => {
  it("opens a mailto: URL with the prefilled subject and body on valid submit", () => {
    renderContact();
    const f = site.copy.contact.form;
    fireEvent.change(screen.getByLabelText(f.nameLabel), {
      target: { value: "Avery Donor" },
    });
    fireEvent.change(screen.getByLabelText(f.emailLabel), {
      target: { value: "avery@example.org" },
    });
    // Subject dropdown defaults to the first reason ("stock-daf"); pick
    // a different topic to prove the value flows through.
    const reason = site.copy.contact.reasons.items.find(
      (r) => r.id === "tribute",
    );
    expect(reason).toBeTruthy();
    fireEvent.change(screen.getByLabelText(f.subjectLabel), {
      target: { value: reason!.id },
    });
    fireEvent.change(screen.getByLabelText(f.messageLabel), {
      target: { value: "I'd like to make a tribute gift." },
    });
    fireEvent.submit(screen.getByTestId("contact-form"));

    const success = screen.getByTestId("contact-form-success");
    expect(success).toBeInTheDocument();
    const link = within(success).getByTestId("contact-form-mailto-link");
    const href = link.getAttribute("href") ?? "";
    expect(href.startsWith(`mailto:${site.org.contactEmail}?`)).toBe(true);
    // Decode the query string and inspect the subject + body params so
    // we don't bake encoding details into the test.
    const qs = href.split("?")[1] ?? "";
    const params = new URLSearchParams(qs);
    const subject = params.get("subject") ?? "";
    const body = params.get("body") ?? "";
    expect(subject).toContain(site.org.shortName);
    expect(subject).toContain(reason!.topic);
    expect(subject).toContain("Avery Donor");
    expect(body).toContain("Avery Donor");
    expect(body).toContain("avery@example.org");
    expect(body).toContain(reason!.topic);
    expect(body).toContain("I'd like to make a tribute gift.");
  });
});

describe("Contact page — embed slot toggle", () => {
  it("shows the cloner embed-slot card when embedSlot.enabled is true", () => {
    const original = site.copy.contact.embedSlot.enabled;
    site.copy.contact.embedSlot.enabled = true;
    try {
      renderContact();
      expect(screen.getByTestId("contact-embed-slot")).toBeInTheDocument();
      // The mailto form should be hidden in this mode.
      expect(screen.queryByTestId("contact-form")).not.toBeInTheDocument();
    } finally {
      site.copy.contact.embedSlot.enabled = original;
    }
  });

  it("hides the embed slot and shows the mailto form when embedSlot.enabled is false", () => {
    expect(site.copy.contact.embedSlot.enabled).toBe(false);
    renderContact();
    expect(screen.queryByTestId("contact-embed-slot")).not.toBeInTheDocument();
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
  });
});

describe("Contact page — optional hours section", () => {
  it("renders configured day/hours rows when hours is set", () => {
    expect(site.copy.contact.hours).toBeTruthy();
    renderContact();
    const list = screen.getByRole("list", { name: /office hours/i });
    expect(within(list).getAllByRole("listitem")).toHaveLength(
      site.copy.contact.hours!.items.length,
    );
    for (const row of site.copy.contact.hours!.items) {
      expect(within(list).getByText(row.day)).toBeInTheDocument();
      expect(within(list).getByText(row.hours)).toBeInTheDocument();
    }
  });

  it("hides the entire hours section when hours is undefined", () => {
    const original = site.copy.contact.hours;
    site.copy.contact.hours = undefined;
    try {
      renderContact();
      expect(
        screen.queryByTestId("contact-hours-section"),
      ).not.toBeInTheDocument();
    } finally {
      site.copy.contact.hours = original;
    }
  });

  it("hides the timezone footnote when hours.timezone is empty", () => {
    const original = site.copy.contact.hours;
    if (!original) throw new Error("Demo config is missing hours.");
    site.copy.contact.hours = { ...original, timezone: undefined };
    try {
      renderContact();
      expect(
        screen.queryByTestId("contact-hours-timezone"),
      ).not.toBeInTheDocument();
      // The day/hours rows still render — only the footnote is hidden.
      expect(screen.getByTestId("contact-hours-section")).toBeInTheDocument();
    } finally {
      site.copy.contact.hours = original;
    }
  });

  it("hides the hours section when hours.items is an empty array", () => {
    const original = site.copy.contact.hours;
    if (!original) throw new Error("Demo config is missing hours.");
    site.copy.contact.hours = { ...original, items: [] };
    try {
      renderContact();
      expect(
        screen.queryByTestId("contact-hours-section"),
      ).not.toBeInTheDocument();
    } finally {
      site.copy.contact.hours = original;
    }
  });
});
