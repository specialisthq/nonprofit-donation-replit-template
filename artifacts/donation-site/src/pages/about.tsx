import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Sparkles,
  Shield,
  Target,
  Users,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import site from "@config";
import {
  Card,
  Container,
  Heading,
  Section,
} from "@/components/primitives";
import { buttonVariants } from "@/components/button";

/**
 * Narrowed icon map keyed by the literal union from the config schema.
 * Using a `Record<ValueIcon, …>` (rather than a wide `Record<string, …>`)
 * makes the compiler shout if a cloner adds a new icon to the schema
 * without registering it here — no silent fallbacks.
 */
type ValueIcon = (typeof site.copy.about.values.items)[number]["icon"];
const VALUE_ICONS: Record<ValueIcon, LucideIcon> = {
  heart: Heart,
  users: Users,
  sparkles: Sparkles,
  handshake: HeartHandshake,
  shield: Shield,
  target: Target,
};

/**
 * Tasteful brand-colored placeholder shown when the cloner hasn't
 * provided a hero photo yet. Uses the org's monogram so the page never
 * looks broken in its default, just-cloned state.
 */
function HeroImagePlaceholder({ alt }: { alt: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--primary))]/80 to-[hsl(var(--accent))]/60 shadow-lg"
    >
      {/* soft circular highlight for visual interest */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/15 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-[hsl(var(--accent))]/30 blur-3xl"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-white text-4xl font-bold">
          {site.org.shortName.charAt(0)}
        </span>
      </div>
    </div>
  );
}

function HeroImage() {
  const cfg = site.copy.about.image;
  const alt = cfg?.alt ?? `${site.org.name}`;
  const [broken, setBroken] = useState(false);
  if (cfg?.src && !broken) {
    return (
      <img
        src={cfg.src}
        alt={alt}
        className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lg"
        onError={() => setBroken(true)}
      />
    );
  }
  return <HeroImagePlaceholder alt={alt} />;
}

/** Photo + role chip for one team member. Falls back to initials. */
function TeamMember({
  name,
  role,
  photoPath,
  bio,
}: {
  name: string;
  role: string;
  photoPath?: string;
  bio?: string;
}) {
  const [broken, setBroken] = useState(false);
  const initials = name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center gap-4">
        {photoPath && !broken ? (
          <img
            src={photoPath}
            alt={`${name}, ${role}`}
            className="h-16 w-16 shrink-0 rounded-full object-cover"
            onError={() => setBroken(true)}
          />
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-lg font-bold"
          >
            {initials || "?"}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-[hsl(var(--text))] truncate">
            {name}
          </p>
          <p className="text-sm text-[hsl(var(--text-muted))] truncate">
            {role}
          </p>
        </div>
      </div>
      {bio && (
        <p className="mt-4 text-sm text-[hsl(var(--text-muted))]">{bio}</p>
      )}
    </Card>
  );
}

export function AboutPage() {
  const a = site.copy.about;
  const showTeam = Boolean(a.team && a.team.members.length > 0);

  return (
    <>
      {/* ============== MISSION HERO ============== */}
      <Section className="py-12 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
                {a.eyebrow}
              </p>
              <Heading level={1} className="mb-5">
                {a.headline}
              </Heading>
              <p className="text-lg sm:text-xl text-[hsl(var(--text-muted))] mb-6">
                {a.subhead}
              </p>
              <p className="text-base sm:text-lg text-[hsl(var(--text))] font-medium">
                {site.org.missionOneLiner}
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <HeroImage />
            </div>
          </div>
        </Container>
      </Section>

      {/* ============== STORY ============== */}
      <Section tone="muted" className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3 text-center">
            Our story
          </p>
          <Heading level={2} className="mb-8 text-center">
            How we got here
          </Heading>
          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-[hsl(var(--text))]">
            {a.story.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </Section>

      {/* ============== VALUES ============== */}
      <Section className="py-14 sm:py-20">
        <Container>
          <div className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
              {a.values.eyebrow}
            </p>
            <Heading level={2} className="mb-4">
              {a.values.headline}
            </Heading>
            {a.values.subhead && (
              <p className="text-lg text-[hsl(var(--text-muted))]">
                {a.values.subhead}
              </p>
            )}
          </div>
          <ul
            aria-label="Our values"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {a.values.items.map((value) => {
              const Icon = VALUE_ICONS[value.icon];
              return (
                <li key={value.title}>
                  <Card className="h-full p-6">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] mb-4"
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <Heading level={3} className="text-lg mb-2">
                      {value.title}
                    </Heading>
                    <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed">
                      {value.body}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ============== TEAM (optional) ============== */}
      {showTeam && a.team && (
        <Section
          tone="muted"
          className="py-14 sm:py-20"
          data-testid="team-section"
        >
          <Container>
            <div className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
                {a.team.eyebrow}
              </p>
              <Heading level={2} className="mb-4">
                {a.team.headline}
              </Heading>
              <p className="text-lg text-[hsl(var(--text-muted))]">
                {a.team.body}
              </p>
            </div>
            <ul
              aria-label="Team members"
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {a.team.members.map((member) => (
                <li key={member.name}>
                  <TeamMember {...member} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* ============== CLOSING CTA ============== */}
      <Section className="py-16 sm:py-24">
        <Container className="max-w-3xl text-center">
          {a.closingCta.eyebrow && (
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
              {a.closingCta.eyebrow}
            </p>
          )}
          <Heading level={2} className="mb-5">
            {a.closingCta.headline}
          </Heading>
          <p className="text-lg text-[hsl(var(--text-muted))] mb-8">
            {a.closingCta.body}
          </p>
          {/*
            Closing CTA links back to the landing page (where the donation
            module lives) rather than opening PayPal directly. This keeps
            the user inside the site's funnel and lets them browse amounts
            before they hand off to PayPal.
          */}
          <Link
            to="/"
            data-testid="about-closing-cta"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            {a.closingCta.ctaLabel}
          </Link>
        </Container>
      </Section>
    </>
  );
}
