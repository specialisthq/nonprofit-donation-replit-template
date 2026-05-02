import { Link } from "react-router-dom";
import { Container, Heading, Section } from "@/components/primitives";

export default function NotFound() {
  return (
    <Section>
      <Container className="max-w-xl text-center">
        <Heading level={1} className="mb-4">Page not found</Heading>
        <p className="text-[hsl(var(--text-muted))] mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="text-[hsl(var(--primary))] font-semibold hover:underline">
          Return home
        </Link>
      </Container>
    </Section>
  );
}
