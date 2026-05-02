import { Link } from "react-router-dom";
import { site } from "@/../site.config";
import { Container, Heading, Prose, Section } from "@/components/primitives";
import { LegalDisclaimer } from "@/components/legal-disclaimer";

export function PrivacyPage() {
  const p = site.copy.legal.privacy;
  const { org } = site;

  return (
    <Section className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <header className="mb-8">
          <Heading level={1} data-testid="privacy-title">
            {p.title}
          </Heading>
          <p
            className="mt-3 text-sm text-[hsl(var(--text-muted))]"
            data-testid="privacy-last-updated"
          >
            Last updated: {p.lastUpdated}
          </p>
          <p className="mt-2 text-sm text-[hsl(var(--text-muted))]">
            {org.name} · EIN {org.ein}
          </p>
        </header>

        <div className="mb-10">
          <LegalDisclaimer />
        </div>

        <Prose>
          <p data-testid="privacy-intro">{p.intro}</p>

          {p.sections.map((s) => (
            <section key={s.id} id={s.id} data-testid={`privacy-section-${s.id}`}>
              <h2>{s.heading}</h2>
              {s.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {s.bullets && s.bullets.length > 0 && (
                <ul>
                  {s.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
              {s.id === "contact" && (
                <p>
                  <Link to="/contact" data-testid="privacy-contact-link">
                    Visit our contact page
                  </Link>{" "}
                  for our current email address, mailing address, and other
                  ways to reach us.
                </p>
              )}
            </section>
          ))}
        </Prose>
      </Container>
    </Section>
  );
}
