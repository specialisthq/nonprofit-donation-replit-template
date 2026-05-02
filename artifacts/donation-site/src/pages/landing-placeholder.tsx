import site from "@config";
import { Container, Heading, Section } from "@/components/primitives";
import { ButtonLink } from "@/components/button";
import { donateLinkProps } from "@/lib/paypal";

export function LandingPlaceholder() {
  const { copy, org } = site;
  return (
    <Section className="pt-10 sm:pt-16">
      <Container className="max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[hsl(var(--primary))] mb-3">
          {copy.landing.eyebrow}
        </p>
        <Heading level={1} className="mb-5">
          {copy.landing.headline}
        </Heading>
        <p className="text-lg sm:text-xl text-[hsl(var(--text-muted))] mb-8">
          {copy.landing.subhead}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink {...donateLinkProps()} variant="primary" size="lg">
            Donate now
          </ButtonLink>
          <ButtonLink {...donateLinkProps({ recurring: true })} variant="outline" size="lg">
            Give monthly
          </ButtonLink>
        </div>
        <p className="mt-10 text-sm text-[hsl(var(--text-muted))]">
          Donation site coming together — landing page is built in the next task.
          <br />
          {org.name} • EIN {org.ein}
        </p>
      </Container>
    </Section>
  );
}
