import type { ReactNode } from "react";
import { site, type LegalPageCopy } from "@/../site.config";
import { Container, Heading, Prose, Section } from "@/components/primitives";
import { LegalDisclaimer } from "@/components/legal-disclaimer";

function interpolate(input: string, vars: Record<string, string>): string {
  return input.replace(/\{(\w+)\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : `{${key}}`,
  );
}

export function LegalPageView({
  copy,
  prefix,
  contactSlot,
}: {
  copy: LegalPageCopy;
  /**
   * Page-scoped test-id prefix (e.g. "privacy", "terms"). Used so
   * each page's tests can target its own elements unambiguously.
   */
  prefix: string;
  /**
   * Optional rich React node injected at the bottom of the section
   * whose `id` is "contact". Lets each page render a Link to
   * /contact alongside the configured contact email.
   */
  contactSlot?: ReactNode;
}) {
  const { org } = site;
  const vars: Record<string, string> = {
    orgName: org.name,
    shortName: org.shortName,
    ein: org.ein,
    contactEmail: org.contactEmail,
    state: site.copy.legal.governingState,
  };
  const fill = (s: string) => interpolate(s, vars);

  return (
    <Section className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <header className="mb-8">
          <Heading level={1} data-testid={`${prefix}-title`}>
            {copy.title}
          </Heading>
          <p
            className="mt-3 text-sm text-[hsl(var(--text-muted))]"
            data-testid={`${prefix}-last-updated`}
          >
            Last updated: {copy.lastUpdated}
          </p>
          <p className="mt-2 text-sm text-[hsl(var(--text-muted))]">
            {org.name} · EIN {org.ein} ·{" "}
            <a
              href={`mailto:${org.contactEmail}`}
              data-testid={`${prefix}-header-email`}
              className="underline decoration-dotted underline-offset-2 hover:text-[hsl(var(--primary))]"
            >
              {org.contactEmail}
            </a>
          </p>
        </header>

        <div className="mb-10">
          <LegalDisclaimer />
        </div>

        <Prose>
          <p data-testid={`${prefix}-intro`}>{fill(copy.intro)}</p>

          {copy.sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              data-testid={`${prefix}-section-${s.id}`}
            >
              <h2>{s.heading}</h2>
              {s.body.map((paragraph, i) => (
                <p key={i}>{fill(paragraph)}</p>
              ))}
              {s.bullets && s.bullets.length > 0 && (
                <ul>
                  {s.bullets.map((bullet, i) => (
                    <li key={i}>{fill(bullet)}</li>
                  ))}
                </ul>
              )}
              {s.links && s.links.length > 0 && (
                <ul data-testid={`${prefix}-section-${s.id}-links`}>
                  {s.links.map((link) => {
                    const href = fill(link.href);
                    return (
                      <li key={href}>
                        <a
                          href={href}
                          {...(link.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {fill(link.label)}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
              {s.id === "contact" && contactSlot}
            </section>
          ))}
        </Prose>
      </Container>
    </Section>
  );
}
