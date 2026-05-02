import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  ChevronRight,
  HeartHandshake,
  Lock,
  Quote,
  ShieldCheck,
  Share2,
  Sparkles,
} from "lucide-react";
import site, {
  type SecondaryGivingCard,
  type SuggestedAmount,
  type TrustStripItem,
} from "@config";
import { Container, Heading, Section, Card } from "@/components/primitives";
import { ButtonLink } from "@/components/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/accordion";
import {
  DonationModule,
  type DonationMode,
} from "@/components/donation-module";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import { cn } from "@/lib/utils";

const HERO_SENTINEL_ID = "hero-end";
const DONATE_ANCHOR = "donate";

const TRUST_STRIP_ICONS = {
  lock: Lock,
  shield: ShieldCheck,
  award: Award,
} as const;

function findDefault(items: SuggestedAmount[]): number | null {
  return items.find((a) => a.default)?.amount ?? items[1]?.amount ?? null;
}

export function LandingPage() {
  const { copy, branding, org } = site;
  const landing = copy.landing;

  const [mode, setMode] = useState<DonationMode>("oneTime");
  const [oneTimeAmount, setOneTimeAmount] = useState<number | null>(
    findDefault(site.amounts.oneTime),
  );
  const [monthlyAmount, setMonthlyAmount] = useState<number | null>(
    findDefault(site.amounts.monthly),
  );
  const [oneTimeCustom, setOneTimeCustom] = useState("");
  const [monthlyCustom, setMonthlyCustom] = useState("");
  const [storyImageBroken, setStoryImageBroken] = useState(false);

  const moduleRef = useRef<HTMLDivElement>(null);

  const amount = mode === "oneTime" ? oneTimeAmount : monthlyAmount;
  const customAmount = mode === "oneTime" ? oneTimeCustom : monthlyCustom;
  const setAmount = mode === "oneTime" ? setOneTimeAmount : setMonthlyAmount;
  const setCustom = mode === "oneTime" ? setOneTimeCustom : setMonthlyCustom;

  const effectiveAmount = useMemo(() => {
    const custom = Number(customAmount);
    if (customAmount && Number.isFinite(custom) && custom > 0) return custom;
    return amount ?? null;
  }, [amount, customAmount]);

  const stickyLabel = effectiveAmount
    ? mode === "monthly"
      ? `Start $${effectiveAmount}/mo`
      : `Donate $${effectiveAmount} now`
    : "Donate now";

  function selectImpactTier(value: number) {
    setMode("oneTime");
    setOneTimeAmount(value);
    setOneTimeCustom("");
    requestAnimationFrame(() => {
      const el = document.getElementById(DONATE_ANCHOR);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const impactProof =
    landing.impactProof ?? site.copy.impact.metrics.slice(0, 3);

  return (
    <>
      {/* ============== HERO ============== */}
      <Section className="relative overflow-hidden pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(var(--surface-muted))] to-[hsl(var(--surface))]"
        />
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
            {/* Left: copy + image */}
            <div className="lg:col-span-7 order-1">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
                {landing.eyebrow}
              </p>
              <Heading
                level={1}
                className="mb-5 text-[2rem] leading-[1.1] sm:text-5xl lg:text-6xl"
              >
                {landing.headline}
              </Heading>
              <p className="text-lg sm:text-xl text-[hsl(var(--text-muted))] mb-6 max-w-2xl">
                {landing.subhead}
              </p>

              <div className="rounded-2xl overflow-hidden bg-[hsl(var(--surface-muted))] aspect-[16/9] mb-6">
                <img
                  src={branding.heroImagePath}
                  alt={`Volunteers at ${org.name} packing community grocery boxes.`}
                  className="h-full w-full object-cover"
                  width={1600}
                  height={900}
                  loading="eager"
                  decoding="async"
                />
              </div>

              <ul className="grid gap-2 text-[15px] sm:text-base text-[hsl(var(--text))]">
                {landing.caseForSupport.slice(0, 3).map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--accent))]"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: donation module */}
            <div className="lg:col-span-5 order-2 lg:sticky lg:top-24">
              <DonationModule
                ref={moduleRef}
                id={DONATE_ANCHOR}
                mode={mode}
                amount={amount}
                customAmount={customAmount}
                onModeChange={setMode}
                onAmountChange={setAmount}
                onCustomAmountChange={setCustom}
              />
            </div>
          </div>
          {/* Sentinel for the sticky-mobile-CTA observer */}
          <div id={HERO_SENTINEL_ID} aria-hidden="true" className="h-px" />
        </Container>
      </Section>

      {/* ============== TRUST STRIP ============== */}
      {landing.trustStrip.length > 0 && (
        <section
          aria-label="Why donors trust us"
          className="border-y border-[hsl(var(--border))] bg-[hsl(var(--surface))]"
        >
          <Container className="grid gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3 items-center">
            {landing.trustStrip.map((item, i) => (
              <TrustStripCard key={i} item={item} />
            ))}
            {landing.testimonial && (
              <figure className="rounded-xl bg-[hsl(var(--surface-muted))] p-4">
                <Quote
                  aria-hidden="true"
                  className="h-4 w-4 text-[hsl(var(--accent))] mb-1"
                />
                <blockquote className="text-sm text-[hsl(var(--text))] leading-snug">
                  "{landing.testimonial.quote}"
                </blockquote>
                <figcaption className="mt-2 text-xs text-[hsl(var(--text-muted))]">
                  — {landing.testimonial.author}
                  {landing.testimonial.role && (
                    <>, {landing.testimonial.role}</>
                  )}
                </figcaption>
              </figure>
            )}
          </Container>
        </section>
      )}

      {/* ============== IMPACT PROOF ============== */}
      <Section tone="muted" className="py-14 sm:py-16">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-2">
              {landing.impactProofHeader.eyebrow}
            </p>
            <Heading level={2} className="text-3xl sm:text-4xl">
              {landing.impactProofHeader.headline}
            </Heading>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {impactProof.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[hsl(var(--surface))] p-6 text-center shadow-sm"
              >
                <div className="text-4xl sm:text-5xl font-bold text-[hsl(var(--primary))] tracking-tight">
                  {m.value}
                </div>
                <div className="mt-2 text-sm font-semibold text-[hsl(var(--text))]">
                  {m.label}
                </div>
                {m.context && (
                  <div className="mt-1 text-xs text-[hsl(var(--text-muted))]">
                    {m.context}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ============== STORY BLOCK ============== */}
      <Section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="rounded-2xl overflow-hidden bg-[hsl(var(--surface-muted))] aspect-[4/3] order-2 lg:order-1">
              {landing.storyBlock.imagePath && !storyImageBroken ? (
                <img
                  src={landing.storyBlock.imagePath}
                  alt={landing.storyBlock.imageAlt ?? ""}
                  className="h-full w-full object-cover"
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  onError={() => setStoryImageBroken(true)}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="h-full w-full bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/30"
                />
              )}
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-2">
                {landing.storyBlock.eyebrow}
              </p>
              <Heading level={2} className="mb-4 text-3xl sm:text-4xl">
                {landing.storyBlock.headline}
              </Heading>
              <div className="space-y-3 text-base sm:text-lg text-[hsl(var(--text-muted))] leading-relaxed">
                {landing.storyBlock.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {landing.storyBlock.link && (
                <Link
                  to={landing.storyBlock.link.href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--primary))] hover:underline"
                >
                  {landing.storyBlock.link.label}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* ============== GIFT IMPACT TIERS ============== */}
      <Section tone="muted" className="py-14 sm:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-2">
              {landing.giftImpact.eyebrow}
            </p>
            <Heading level={2} className="text-3xl sm:text-4xl mb-3">
              {landing.giftImpact.headline}
            </Heading>
            {landing.giftImpact.subhead && (
              <p className="text-base sm:text-lg text-[hsl(var(--text-muted))]">
                {landing.giftImpact.subhead}
              </p>
            )}
          </div>
          <ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Suggested gift amounts and what they fund"
          >
            {site.amounts.oneTime.slice(0, 6).map((tier) => {
              const isHighlighted = tier.default;
              return (
                <li key={tier.amount}>
                  <button
                    type="button"
                    onClick={() => selectImpactTier(tier.amount)}
                    className={cn(
                      "group w-full h-full rounded-2xl border-2 bg-[hsl(var(--surface))] p-5 text-left transition-all",
                      "hover:border-[hsl(var(--primary))] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--primary))]",
                      isHighlighted
                        ? "border-[hsl(var(--primary))]"
                        : "border-[hsl(var(--border))]",
                    )}
                  >
                    {isHighlighted && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--accent))]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--accent-foreground))] mb-2">
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
                    <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--primary))]">
                      Choose this
                      <ChevronRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ============== FAQ ============== */}
      <Section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-2">
              {landing.faqHeader.eyebrow}
            </p>
            <Heading level={2} className="text-3xl sm:text-4xl">
              {landing.faqHeader.headline}
            </Heading>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {landing.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      {/* ============== SECONDARY GIVING ============== */}
      <Section tone="muted" className="py-14 sm:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-2">
              {landing.secondaryGiving.eyebrow}
            </p>
            <Heading level={2} className="text-3xl sm:text-4xl">
              {landing.secondaryGiving.headline}
            </Heading>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {landing.secondaryGiving.cards.map((card, i) => (
              <SecondaryCard
                key={i}
                card={card}
                onScrollToDonate={() => {
                  const el = document.getElementById(DONATE_ANCHOR);
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* ============== FINAL CTA ============== */}
      <Section className="py-14 sm:py-20" tone="surface">
        <Container className="max-w-3xl text-center">
          <HeartHandshake
            className="mx-auto h-10 w-10 text-[hsl(var(--accent))] mb-3"
            aria-hidden="true"
          />
          <Heading level={2} className="text-3xl sm:text-4xl mb-4">
            {landing.finalCta.headline}
          </Heading>
          <p className="text-base sm:text-lg text-[hsl(var(--text-muted))] mb-6">
            {landing.finalCta.body}
          </p>
          <div className="flex justify-center">
            <ButtonLink
              variant="primary"
              size="lg"
              href={`#${DONATE_ANCHOR}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(DONATE_ANCHOR)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {landing.finalCta.ctaLabel}
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {site.features.showStickyMobileCta && (
        <StickyMobileCta
          watchSentinelId={HERO_SENTINEL_ID}
          scrollToId={DONATE_ANCHOR}
          label={stickyLabel}
        />
      )}
    </>
  );
}

function TrustStripCard({ item }: { item: TrustStripItem }) {
  const Icon = TRUST_STRIP_ICONS[item.icon];
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="text-sm">
        <div className="font-semibold text-[hsl(var(--text))]">
          {item.title}
        </div>
        <div className="text-[hsl(var(--text-muted))]">
          {item.linkHref && item.linkLabel ? (
            <>
              <Link
                to={item.linkHref}
                className="underline-offset-2 hover:text-[hsl(var(--primary))] hover:underline"
              >
                {item.linkLabel}
              </Link>{" "}
              {item.body}
            </>
          ) : (
            item.body
          )}
        </div>
      </div>
    </div>
  );
}

function SecondaryCard({
  card,
  onScrollToDonate,
}: {
  card: SecondaryGivingCard;
  onScrollToDonate: () => void;
}) {
  if (card.action === "share") {
    return (
      <Card className="flex flex-col h-full">
        <h3 className="text-lg font-bold text-[hsl(var(--text))] mb-2">
          {card.title}
        </h3>
        <p className="text-sm text-[hsl(var(--text-muted))] flex-1">
          {card.body}
        </p>
        <button
          type="button"
          onClick={async () => {
            const shareData = {
              title: site.org.name,
              text: site.copy.thankYou.shareText,
              url: typeof window !== "undefined" ? window.location.href : "",
            };
            try {
              if (
                typeof navigator !== "undefined" &&
                typeof navigator.share === "function"
              ) {
                await navigator.share(shareData);
                return;
              }
            } catch {
              /* ignore — fall through to clipboard */
            }
            try {
              if (navigator?.clipboard) {
                await navigator.clipboard.writeText(shareData.url);
                window.alert("Link copied to clipboard — thanks for sharing!");
              }
            } catch {
              /* no-op */
            }
          }}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border-2 border-[hsl(var(--primary))] px-4 text-sm font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          {card.ctaLabel}
        </button>
      </Card>
    );
  }
  if (card.href.startsWith("#")) {
    return (
      <Card className="flex flex-col h-full">
        <h3 className="text-lg font-bold text-[hsl(var(--text))] mb-2">
          {card.title}
        </h3>
        <p className="text-sm text-[hsl(var(--text-muted))] flex-1">
          {card.body}
        </p>
        <button
          type="button"
          onClick={onScrollToDonate}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-[hsl(var(--primary))] px-4 text-sm font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors"
        >
          {card.ctaLabel}
        </button>
      </Card>
    );
  }
  if (card.external) {
    return (
      <Card className="flex flex-col h-full">
        <h3 className="text-lg font-bold text-[hsl(var(--text))] mb-2">
          {card.title}
        </h3>
        <p className="text-sm text-[hsl(var(--text-muted))] flex-1">
          {card.body}
        </p>
        <a
          href={card.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-[hsl(var(--primary))] px-4 text-sm font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors"
        >
          {card.ctaLabel}
        </a>
      </Card>
    );
  }
  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-[hsl(var(--text))] mb-2">
        {card.title}
      </h3>
      <p className="text-sm text-[hsl(var(--text-muted))] flex-1">
        {card.body}
      </p>
      <Link
        to={card.href}
        className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-[hsl(var(--primary))] px-4 text-sm font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors"
      >
        {card.ctaLabel}
      </Link>
    </Card>
  );
}
