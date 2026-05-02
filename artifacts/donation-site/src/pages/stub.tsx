import { Container, Heading, Section } from "@/components/primitives";
import { ButtonLink } from "@/components/button";
import { donateLinkProps } from "@/lib/paypal";

export function StubPage({ title }: { title: string }) {
  return (
    <Section>
      <Container className="max-w-2xl text-center">
        <p className="text-sm uppercase tracking-wide text-[hsl(var(--primary))] font-semibold mb-3">
          Coming up next
        </p>
        <Heading level={1} className="mb-4">{title}</Heading>
        <p className="text-lg text-[hsl(var(--text-muted))] mb-8">
          This page is part of the donation site template and will be filled in by the next task in the build.
        </p>
        <ButtonLink {...donateLinkProps()} variant="primary" size="lg">
          Donate now
        </ButtonLink>
      </Container>
    </Section>
  );
}
