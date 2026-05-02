import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Facebook,
  Gift,
  HeartHandshake,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Receipt,
  Repeat,
  Share2,
  Twitter,
  Youtube,
} from "lucide-react";
import site from "@config";
import {
  Card,
  Container,
  Heading,
  Section,
} from "@/components/primitives";
import { Button, ButtonLink } from "@/components/button";
import {
  landingShareUrl,
  monthlyUpgradeHref,
} from "@/lib/donation-flow";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

type ShareIntent = {
  key: "twitter" | "facebook" | "linkedin" | "email";
  label: string;
  href: string;
  Icon: typeof Twitter;
};

function buildShareIntents(text: string, url: string): ShareIntent[] {
  const enc = encodeURIComponent;
  return [
    {
      key: "twitter",
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`,
      Icon: Twitter,
    },
    {
      key: "facebook",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      Icon: Facebook,
    },
    {
      key: "linkedin",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      Icon: Linkedin,
    },
    {
      key: "email",
      label: "Share by email",
      href: `mailto:?subject=${enc("Worth a few dollars of your time")}&body=${enc(`${text} ${url}`)}`,
      Icon: Mail,
    },
  ];
}

/** Render a video block: YouTube/Vimeo iframes vs direct .mp4 vs hidden. */
function ThankYouVideo({ url }: { url: string }) {
  const isMp4 = /\.(mp4|webm|ogg)(\?|$)/i.test(url);
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-md">
      {isMp4 ? (
        <video
          src={url}
          controls
          playsInline
          className="h-full w-full"
          aria-label="A short thank-you video from our team"
        />
      ) : (
        <iframe
          src={url}
          title="A short thank-you video from our team"
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export function ThankYouPage() {
  const { copy, social, features, amounts, org } = site;
  const t = copy.thankYou;

  // Detect Web Share API support after mount so SSR/SSG renders the
  // fallback link list (no hydration mismatch).
  const [hasNativeShare, setHasNativeShare] = useState(false);
  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setHasNativeShare(true);
    }
  }, []);

  // Stable absolute URL for share intents and Web Share API. Computed lazily
  // because window.location.origin is only meaningful in the browser.
  const [shareUrl, setShareUrl] = useState<string>("/");
  useEffect(() => {
    setShareUrl(landingShareUrl());
  }, []);

  const shareIntents = buildShareIntents(t.shareText, shareUrl);

  async function handleNativeShare() {
    if (typeof navigator === "undefined" || typeof navigator.share !== "function") return;
    try {
      await navigator.share({
        title: org.name,
        text: t.shareText,
        url: shareUrl,
      });
    } catch {
      // User canceled — no-op. Fallback list is always rendered alongside.
    }
  }

  // Impact reminder: prefer config-supplied tiers; fall back to first 1–2
  // one-time amounts so the section never collapses to nothing.
  const impactTiers =
    t.impactReminder.tiers && t.impactReminder.tiers.length > 0
      ? t.impactReminder.tiers
      : amounts.oneTime.slice(0, 2).map((a) => ({
          amount: a.amount,
          impactLabel: a.impactLabel,
        }));

  const socialLinks = [
    social.twitter && { href: social.twitter, label: "Twitter / X", Icon: Twitter },
    social.facebook && { href: social.facebook, label: "Facebook", Icon: Facebook },
    social.instagram && { href: social.instagram, label: "Instagram", Icon: Instagram },
    social.linkedin && { href: social.linkedin, label: "LinkedIn", Icon: Linkedin },
    social.youtube && { href: social.youtube, label: "YouTube", Icon: Youtube },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof Twitter }[];

  return (
    <>
      {/* ============== HERO / CONFIRMATION ============== */}
      <Section className="pt-12 sm:pt-16 pb-10 sm:pb-12">
        <Container className="max-w-3xl">
          <div className="text-center">
            <span
              aria-hidden="true"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent-foreground))] mb-5"
            >
              <CheckCircle2 className="h-8 w-8" />
            </span>
            {/*
              NOTE — this is a frontend-only template with no webhook to
              verify the donation actually completed. Anyone who opens
              /thank-you directly will see this page. Copy is therefore
              kept conditional ("If your gift went through…") rather than
              an absolute claim of confirmation.
            */}
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-2">
              You're back from PayPal
            </p>
            <Heading
              level={1}
              className="text-4xl sm:text-5xl mb-5"
            >
              {t.headline}
            </Heading>
            <p className="text-lg sm:text-xl text-[hsl(var(--text-muted))] mb-6">
              {t.body}
            </p>
            <p className="inline-flex items-start gap-2 rounded-xl bg-[hsl(var(--surface-muted))] px-4 py-3 text-sm text-[hsl(var(--text))] text-left">
              <Receipt
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-[hsl(var(--primary))] mt-0.5"
              />
              <span>{t.receiptNote}</span>
            </p>
          </div>

          {t.videoUrl && (
            <div className="mt-10">
              <ThankYouVideo url={t.videoUrl} />
            </div>
          )}
        </Container>
      </Section>

      {/* ============== IMPACT REMINDER ============== */}
      <Section tone="muted" className="py-12 sm:py-16">
        <Container className="max-w-4xl">
          <div className="text-center mb-8">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-2">
              {t.impactReminder.eyebrow}
            </p>
            <Heading level={2} className="text-2xl sm:text-3xl">
              {t.impactReminder.headline}
            </Heading>
          </div>
          <ul
            aria-label="Impact reminder"
            className={cn(
              "grid gap-4",
              impactTiers.length === 1
                ? "sm:grid-cols-1"
                : "sm:grid-cols-2",
            )}
          >
            {impactTiers.map((tier) => (
              <li key={tier.amount}>
                <Card className="flex h-full items-start gap-4 p-5">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                  >
                    <Gift className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-2xl font-bold text-[hsl(var(--primary))] leading-none">
                      ${tier.amount}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[hsl(var(--text))]">
                      {tier.impactLabel}
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ============== MONTHLY UPGRADE ============== */}
      {features.showMonthlyUpsell && (
        <Section className="py-12 sm:py-16">
          <Container className="max-w-3xl">
            <Card className="p-6 sm:p-8 border-2 border-[hsl(var(--accent))]/30 bg-gradient-to-br from-[hsl(var(--surface))] to-[hsl(var(--accent))]/5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent-foreground))]"
                >
                  <Repeat className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--accent-foreground))] mb-1">
                    {t.monthlyUpgrade.eyebrow}
                  </p>
                  <Heading level={2} className="text-xl sm:text-2xl mb-2">
                    {t.monthlyUpgrade.headline}
                  </Heading>
                  <p className="text-[hsl(var(--text-muted))] text-sm sm:text-base">
                    {t.monthlyUpgrade.body}
                  </p>
                </div>
                <Link
                  to={monthlyUpgradeHref()}
                  data-testid="monthly-upgrade-link"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[hsl(var(--accent))] px-6 text-base font-semibold text-[hsl(var(--accent-foreground))] shadow-sm hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--accent))] whitespace-nowrap"
                >
                  <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                  {t.monthlyUpgrade.ctaLabel}
                </Link>
              </div>
            </Card>
          </Container>
        </Section>
      )}

      {/* ============== EMPLOYER MATCH ============== */}
      {t.employerMatch && (
        <Section tone="muted" className="py-12 sm:py-16">
          <Container className="max-w-3xl">
            <Card className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                >
                  <Building2 className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-1">
                    {t.employerMatch.eyebrow}
                  </p>
                  <Heading level={2} className="text-xl sm:text-2xl mb-2">
                    {t.employerMatch.headline}
                  </Heading>
                  <p className="text-[hsl(var(--text-muted))] text-sm sm:text-base">
                    {t.employerMatch.body}
                  </p>
                </div>
                {t.employerMatch.external ? (
                  <a
                    href={t.employerMatch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="employer-match-link"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[hsl(var(--primary))] bg-transparent px-6 text-base font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--primary))] whitespace-nowrap"
                  >
                    {t.employerMatch.ctaLabel}
                  </a>
                ) : (
                  <Link
                    to={t.employerMatch.href}
                    data-testid="employer-match-link"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[hsl(var(--primary))] bg-transparent px-6 text-base font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--primary))] whitespace-nowrap"
                  >
                    {t.employerMatch.ctaLabel}
                  </Link>
                )}
              </div>
            </Card>
          </Container>
        </Section>
      )}

      {/* ============== SHARE ROW ============== */}
      {features.showShare && (
        <Section tone="muted" className="py-12 sm:py-16">
          <Container className="max-w-3xl text-center">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-2">
              {t.share.eyebrow}
            </p>
            <Heading level={2} className="text-2xl sm:text-3xl mb-3">
              {t.share.headline}
            </Heading>
            <p className="text-[hsl(var(--text-muted))] mb-6">{t.share.body}</p>

            {/* Native share — only rendered when supported. The fallback list
                below is always present so keyboard / desktop / unsupported
                browsers still have a working share path. */}
            {hasNativeShare && (
              <Button
                variant="primary"
                size="md"
                className="mb-5"
                onClick={handleNativeShare}
                data-testid="native-share-button"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                {t.share.nativeCtaLabel}
              </Button>
            )}

            <ul
              aria-label="Share to a social network"
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            >
              {shareIntents.map(({ key, label, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target={key === "email" ? undefined : "_blank"}
                    rel={key === "email" ? undefined : "noopener noreferrer"}
                    aria-label={label}
                    data-testid={`share-${key}`}
                    className="inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-full border-2 border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 text-sm font-semibold text-[hsl(var(--text))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--primary))]"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{label.replace(/^Share (on |by )/, "")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* ============== SOCIAL FOLLOW ============== */}
      {socialLinks.length > 0 && (
        <Section className="py-12 sm:py-16">
          <Container className="max-w-3xl text-center">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-2">
              {t.socialFollow.eyebrow}
            </p>
            <Heading level={2} className="text-2xl sm:text-3xl mb-3">
              {t.socialFollow.headline}
            </Heading>
            <p className="text-[hsl(var(--text-muted))] mb-6">
              {t.socialFollow.body}
            </p>
            <ul
              aria-label="Follow us on social media"
              className="flex flex-wrap items-center justify-center gap-3"
            >
              {socialLinks.map(({ href, label, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    data-testid={`social-follow-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--surface-muted))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--primary))]"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* ============== NEWSLETTER PLACEHOLDER ==============
          ⚠️ CLONERS: this is a non-functional placeholder. Replace the
          <form> below with your Mailchimp / Beehiiv / ConvertKit / etc.
          embed snippet. Keep the wrapping <Card> and headline copy if
          you want it to match the rest of the page's visual style.
      */}
      <Section tone="muted" className="py-12 sm:py-16">
        <Container className="max-w-2xl">
          <Card className="p-6 sm:p-8" data-testid="newsletter-placeholder">
            <div className="flex items-center gap-2 text-[hsl(var(--primary))] mb-2">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-wider">
                {t.newsletter.eyebrow}
              </p>
            </div>
            <Heading level={2} className="text-2xl sm:text-3xl mb-2">
              {t.newsletter.headline}
            </Heading>
            <p className="text-[hsl(var(--text-muted))] mb-5">
              {t.newsletter.body}
            </p>

            {/* === Cloner: replace this <form> with your provider's embed === */}
            <form
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup (placeholder — replace with your provider's embed)"
              className="flex flex-col sm:flex-row gap-2"
            >
              <label className="sr-only" htmlFor="newsletter-email-placeholder">
                Email address
              </label>
              <input
                id="newsletter-email-placeholder"
                type="email"
                required
                disabled
                placeholder={t.newsletter.emailPlaceholder}
                className="h-12 flex-1 rounded-lg border-2 border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 text-base text-[hsl(var(--text))] placeholder:text-[hsl(var(--text-muted))] disabled:cursor-not-allowed disabled:opacity-70"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled
                className="sm:h-12"
              >
                {t.newsletter.ctaLabel}
              </Button>
            </form>
            <p className="mt-3 text-[11px] text-[hsl(var(--text-muted))] italic">
              Placeholder — paste your newsletter provider's embed code here to
              activate signups.
            </p>
            {/* === end newsletter placeholder === */}
          </Card>
        </Container>
      </Section>

      {/* ============== WHAT HAPPENS NEXT ============== */}
      <Section className="py-12 sm:py-16">
        <Container className="max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-2">
              {t.whatHappensNext.eyebrow}
            </p>
            <Heading level={2} className="text-2xl sm:text-3xl">
              {t.whatHappensNext.headline}
            </Heading>
          </div>
          <ol className="space-y-4">
            {t.whatHappensNext.steps.map((step, i) => (
              <li key={i}>
                <Card className="flex items-start gap-4 p-5">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-bold"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[hsl(var(--text))]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
                      {step.body}
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-center">
            <ButtonLink href="/" variant="outline" size="md">
              Back to home
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default ThankYouPage;
