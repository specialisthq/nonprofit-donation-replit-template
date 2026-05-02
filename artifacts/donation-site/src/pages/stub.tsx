import { Container, Heading, Section } from "@/components/primitives";
import { ButtonLink } from "@/components/button";
import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { donateLinkProps } from "@/lib/paypal";

export function StubPage({
  title,
  legal = false,
}: {
  title: string;
  legal?: boolean;
}) {
  return (
    <Section>
      <Container className={legal ? "max-w-3xl" : "max-w-2xl text-center"}>
        <p className="text-sm uppercase tracking-wide text-[hsl(var(--primary))] font-semibold mb-3">
          Coming up next
        </p>
        <Heading level={1} className="mb-4">{title}</Heading>
        <p className="text-lg text-[hsl(var(--text-muted))] mb-8">
          This page is part of the donation site template and will be filled in by the next task in the build.
        </p>
        {legal && (
          <div className="mb-8">
            <LegalDisclaimer />
          </div>
        )}
        {!legal && (
          <ButtonLink {...donateLinkProps()} variant="primary" size="lg">
            Donate now
          </ButtonLink>
        )}
      </Container>
    </Section>
  );
}
