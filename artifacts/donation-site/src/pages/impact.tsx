import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Home,
  Quote,
  Shield,
  Sparkles,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import site from "@config";
import { Card, Container, Heading, Section } from "@/components/primitives";
import { buttonVariants } from "@/components/button";
import { donationTierHref } from "@/lib/donation-flow";
import { cn } from "@/lib/utils";

/**
 * Curated lucide icon enum for program cards. Narrowly typed off the schema
 * so adding a new icon to the config without registering it here is a
 * compile error — no silent fallbacks.
 */
type ProgramIcon = NonNullable<
  (typeof site.copy.impact.programs.items)[number]["icon"]
>;
const PROGRAM_ICONS: Record<ProgramIcon, LucideIcon> = {
  utensils: Utensils,
  graduationCap: GraduationCap,
  home: Home,
  handshake: HeartHandshake,
  users: Users,
  shield: Shield,
  sparkles: Sparkles,
};

/** Visual tones for the money-goes bar segments. */
const TONE_CLASSES: Record<
  NonNullable<
    (typeof site.copy.impact.moneyGoes.breakdown)[number]["tone"]
  >,
  { bar: string; dot: string }
> = {
  primary: {
    bar: "bg-[hsl(var(--primary))]",
    dot: "bg-[hsl(var(--primary))]",
  },
  accent: {
    bar: "bg-[hsl(var(--accent))]",
    dot: "bg-[hsl(var(--accent))]",
  },
  muted: {
    bar: "bg-[hsl(var(--text-muted))]/40",
    dot: "bg-[hsl(var(--text-muted))]/60",
  },
};
const DEFAULT_TONE_ROTATION: Array<keyof typeof TONE_CLASSES> = [
  "primary",
  "muted",
  "accent",
];

/**
 * Tasteful brand-colored placeholder shown when no beneficiary photo is
 * configured. Mirrors the about page's hero placeholder pattern so cloners
 * get a clean page even before they've added their own assets.
 */
function BeneficiaryImagePlaceholder({ alt }: { alt: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--primary))]/80 to-[hsl(var(--accent))]/60 shadow-lg"
    >
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

function BeneficiaryImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [broken, setBroken] = useState(false);
  if (src && !broken) {
    return (
      <img
        src={src}
        alt={alt}
        className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lg"
        onError={() => setBroken(true)}
      />
    );
  }
  return <BeneficiaryImagePlaceholder alt={alt} />;
}

function ProgramCard({
  program,
}: {
  program: (typeof site.copy.impact.programs.items)[number];
}) {
  const Icon = program.icon ? PROGRAM_ICONS[program.icon] : Sparkles;
  return (
    <Card className="h-full p-6 flex flex-col">
      <span
        aria-hidden="true"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] mb-4"
      >
        <Icon className="h-6 w-6" />
      </span>
      <Heading level={3} className="text-lg sm:text-xl mb-2">
        {program.name}
      </Heading>
      <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed mb-5 flex-1">
        {program.summary}
      </p>
      <ul
        aria-label={`${program.name} outcomes`}
        className="grid grid-cols-2 gap-3 border-t border-[hsl(var(--border))] pt-4"
      >
        {program.outcomes.map((outcome) => (
          <li key={outcome.label}>
            <div className="text-2xl font-bold text-[hsl(var(--primary))] tracking-tight">
              {outcome.value}
            </div>
            <div className="text-xs text-[hsl(var(--text-muted))] leading-snug">
              {outcome.label}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function MoneyGoesBar({
  breakdown,
}: {
  breakdown: typeof site.copy.impact.moneyGoes.breakdown;
}) {
  return (
    <>
      {/* Stacked bar — decorative; data is in the labeled legend below. */}
      <div
        aria-hidden="true"
        className="flex h-6 w-full overflow-hidden rounded-full bg-[hsl(var(--surface-muted))] ring-1 ring-[hsl(var(--border))]"
      >
        {breakdown.map((segment, i) => {
          const tone =
            segment.tone ??
            DEFAULT_TONE_ROTATION[i % DEFAULT_TONE_ROTATION.length];
          return (
            <div
              key={segment.label}
              style={{ width: `${segment.percent}%` }}
              className={TONE_CLASSES[tone].bar}
            />
          );
        })}
      </div>
      <ul
        aria-label="Where every dollar goes"
        className="mt-5 grid gap-3 sm:grid-cols-3"
      >
        {breakdown.map((segment, i) => {
          const tone =
            segment.tone ??
            DEFAULT_TONE_ROTATION[i % DEFAULT_TONE_ROTATION.length];
          return (
            <li
              key={segment.label}
              className="flex items-center gap-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-3"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "inline-block h-3 w-3 shrink-0 rounded-full",
                  TONE_CLASSES[tone].dot,
                )}
              />
              <div className="min-w-0">
                <div className="text-base font-semibold text-[hsl(var(--text))]">
                  {segment.percent}%{" "}
                  <span className="font-normal text-[hsl(var(--text-muted))]">
                    {segment.label}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function ImpactPage() {
  const i = site.copy.impact;

  return (
    <>
      {/* ============== HERO + METRICS STRIP ============== */}
      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16 mb-10 sm:mb-14">
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
                {i.hero.eyebrow}
              </p>
              <Heading level={1} className="mb-5">
                {i.hero.headline}
              </Heading>
              <p className="text-lg sm:text-xl text-[hsl(var(--text-muted))]">
                {i.hero.subhead}
              </p>
            </div>
            <Card className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-transparent p-8 sm:p-10 shadow-lg">
              <div className="text-6xl sm:text-7xl font-bold tracking-tight">
                {i.hero.supportingMetric.value}
              </div>
              <div className="mt-3 text-base sm:text-lg font-semibold">
                {i.hero.supportingMetric.label}
              </div>
              {i.hero.supportingMetric.context && (
                <div className="mt-2 text-sm opacity-80">
                  {i.hero.supportingMetric.context}
                </div>
              )}
            </Card>
          </div>
          {i.metrics.length > 0 && (
            <ul
              aria-label="Headline impact metrics"
              data-testid="impact-metrics-strip"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {i.metrics.map((m) => (
                <li
                  key={`${m.value}-${m.label}`}
                  className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5 text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-[hsl(var(--primary))] tracking-tight">
                    {m.value}
                  </div>
                  <div className="mt-1.5 text-sm font-semibold text-[hsl(var(--text))]">
                    {m.label}
                  </div>
                  {m.context && (
                    <div className="mt-1 text-xs text-[hsl(var(--text-muted))]">
                      {m.context}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {/* ============== PROGRAMS ============== */}
      <Section tone="muted" className="py-14 sm:py-20">
        <Container>
          <div className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
              {i.programs.eyebrow}
            </p>
            <Heading level={2} className="mb-4">
              {i.programs.headline}
            </Heading>
            {i.programs.subhead && (
              <p className="text-lg text-[hsl(var(--text-muted))]">
                {i.programs.subhead}
              </p>
            )}
          </div>
          <ul
            aria-label="Our programs"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {i.programs.items.map((program) => (
              <li key={program.name}>
                <ProgramCard program={program} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ============== WHERE YOUR MONEY GOES ============== */}
      <Section className="py-14 sm:py-20">
        <Container className="max-w-4xl">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
              {i.moneyGoes.eyebrow}
            </p>
            <Heading level={2} className="mb-4">
              {i.moneyGoes.headline}
            </Heading>
            {i.moneyGoes.subhead && (
              <p className="text-lg text-[hsl(var(--text-muted))]">
                {i.moneyGoes.subhead}
              </p>
            )}
          </div>
          <MoneyGoesBar breakdown={i.moneyGoes.breakdown} />
          {i.moneyGoes.note && (
            <p className="mt-5 text-sm text-[hsl(var(--text-muted))] text-center">
              {i.moneyGoes.note}
            </p>
          )}
          <div className="mt-6 text-center">
            <Link
              to={i.moneyGoes.transparencyLink.href}
              data-testid="impact-transparency-link"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--primary))] hover:underline"
            >
              {i.moneyGoes.transparencyLink.label}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </Section>

      {/* ============== BENEFICIARY STORY ============== */}
      <Section tone="muted" className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="order-2 lg:order-1">
              <BeneficiaryImage
                src={i.beneficiary.imagePath}
                alt={i.beneficiary.imageAlt ?? i.beneficiary.headline}
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
                {i.beneficiary.eyebrow}
              </p>
              <Heading level={2} className="mb-5">
                {i.beneficiary.headline}
              </Heading>
              <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[hsl(var(--text))] mb-6">
                {i.beneficiary.body.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
              <figure className="rounded-xl border-l-4 border-[hsl(var(--accent))] bg-[hsl(var(--surface))] p-5 shadow-sm">
                <Quote
                  aria-hidden="true"
                  className="h-5 w-5 text-[hsl(var(--accent))] mb-2"
                />
                <blockquote className="text-base sm:text-lg italic text-[hsl(var(--text))] leading-relaxed">
                  &ldquo;{i.beneficiary.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-sm">
                  <span className="font-semibold text-[hsl(var(--text))]">
                    {i.beneficiary.attribution}
                  </span>
                  {i.beneficiary.role && (
                    <span className="text-[hsl(var(--text-muted))]">
                      {" "}
                      — {i.beneficiary.role}
                    </span>
                  )}
                </figcaption>
              </figure>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============== TIER RECAP ============== */}
      <Section className="py-14 sm:py-20">
        <Container>
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
              {i.tierRecap.eyebrow}
            </p>
            <Heading level={2} className="mb-4">
              {i.tierRecap.headline}
            </Heading>
            {i.tierRecap.subhead && (
              <p className="text-lg text-[hsl(var(--text-muted))]">
                {i.tierRecap.subhead}
              </p>
            )}
          </div>
          {/*
            Tier values are pulled directly from `site.amounts.oneTime` so they
            always match the landing donation module — single source of truth.
            Each tile is a react-router <Link> built with `donationTierHref()`,
            which the landing page reads on mount to preselect the amount.
          */}
          <ul
            aria-label="Impact tier recap"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {site.amounts.oneTime.map((tier) => (
              <li key={tier.amount}>
                <Link
                  to={donationTierHref(tier.amount)}
                  data-testid={`impact-tier-${tier.amount}`}
                  className={cn(
                    "group flex h-full w-full flex-col rounded-2xl border-2 bg-[hsl(var(--surface))] p-5 text-left transition-all",
                    "hover:border-[hsl(var(--primary))] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--primary))]",
                    tier.default
                      ? "border-[hsl(var(--primary))]"
                      : "border-[hsl(var(--border))]",
                  )}
                >
                  {tier.default && (
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[hsl(var(--accent))]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--accent-foreground))] mb-2">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Most chosen
                    </span>
                  )}
                  <div className="text-3xl font-bold text-[hsl(var(--primary))]">
                    ${tier.amount}
                  </div>
                  <div className="mt-1.5 text-base font-semibold text-[hsl(var(--text))]">
                    {tier.impactLabel}
                  </div>
                  <div className="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--primary))]">
                    Give ${tier.amount}
                    <ChevronRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ============== CLOSING CTA ============== */}
      <Section tone="muted" className="py-16 sm:py-24">
        <Container className="max-w-3xl text-center">
          {i.closingCta.eyebrow && (
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
              {i.closingCta.eyebrow}
            </p>
          )}
          <Heading level={2} className="mb-5">
            {i.closingCta.headline}
          </Heading>
          <p className="text-lg text-[hsl(var(--text-muted))] mb-8">
            {i.closingCta.body}
          </p>
          {/*
            Closing CTA links back to the landing page (where the donation
            module lives) rather than opening PayPal directly. Keeps the
            visitor inside the funnel and lets them pick an amount before
            handing off to PayPal.
          */}
          <Link
            to="/"
            data-testid="impact-closing-cta"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            {i.closingCta.ctaLabel}
          </Link>
        </Container>
      </Section>
    </>
  );
}
