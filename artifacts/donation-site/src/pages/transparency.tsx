import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Ban,
  ChevronRight,
  FileText,
  Heart,
  Lock,
  Receipt,
  RefreshCw,
  Shield,
  type LucideIcon,
} from "lucide-react";
import site from "@config";
import { Card, Container, Heading, Section } from "@/components/primitives";
import { buttonVariants } from "@/components/button";
import { cn } from "@/lib/utils";

/**
 * Curated lucide icon enum for donor-commitment cards. Narrowed against
 * the schema so adding a new icon to the config without registering it
 * here is a compile error — no silent fallbacks.
 */
type CommitmentIcon =
  (typeof site.copy.transparency.donorCommitments.items)[number]["icon"];
const COMMITMENT_ICONS: Record<CommitmentIcon, LucideIcon> = {
  lock: Lock,
  receipt: Receipt,
  shield: Shield,
  refresh: RefreshCw,
  heart: Heart,
  ban: Ban,
};

function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3",
        className,
      )}
    >
      {children}
    </p>
  );
}

function SectionHeader({
  eyebrow,
  headline,
  subhead,
}: {
  eyebrow: string;
  headline: string;
  subhead?: string;
}) {
  return (
    <div className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading level={2} className="mb-4">
        {headline}
      </Heading>
      {subhead && (
        <p className="text-lg text-[hsl(var(--text-muted))]">{subhead}</p>
      )}
    </div>
  );
}

function SnapshotRow({
  label,
  value,
  span = 1,
}: {
  label: string;
  value: ReactNode;
  span?: 1 | 2;
}) {
  return (
    <div className={cn(span === 2 && "sm:col-span-2")}>
      <dt className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--text-muted))]">
        {label}
      </dt>
      <dd className="mt-1 text-base font-medium text-[hsl(var(--text))]">
        {value}
      </dd>
    </div>
  );
}

/**
 * Honors the optional `external` flag on link configs: external URLs
 * render as `<a target="_blank">`, internal routes as react-router
 * `<Link>`. Keeps SPA navigation for in-site paths and avoids the
 * router rewriting "#" placeholders pasted by cloners.
 */
function BoardRosterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const cls =
    "inline-flex items-center gap-1 font-semibold text-[hsl(var(--primary))] hover:underline";
  const inner = (
    <>
      {label}
      <ChevronRight aria-hidden="true" className="h-4 w-4" />
    </>
  );
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="governance-board-link"
        className={cls}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link to={href} data-testid="governance-board-link" className={cls}>
      {inner}
    </Link>
  );
}

function CommitmentLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const cls =
    "inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--primary))] hover:underline";
  const inner = (
    <>
      {label}
      <ChevronRight aria-hidden="true" className="h-4 w-4" />
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={href} className={cls}>
      {inner}
    </Link>
  );
}

/**
 * Rating logo with graceful fallback to a generic shield mark so the
 * page looks complete in its just-cloned state, before logo files are
 * dropped into /public.
 */
function RatingLogo({ src, alt }: { src?: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  if (src && !broken) {
    return (
      <img
        src={src}
        alt={alt}
        className="h-12 w-auto object-contain"
        onError={() => setBroken(true)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
    >
      <Shield className="h-6 w-6" />
    </span>
  );
}

export function TransparencyPage() {
  const t = site.copy.transparency;
  const { org } = site;
  const addr = org.address;
  const showFinancials = t.financials.lines.length > 0;
  const showFilings = t.filings.items.length > 0;
  const showRatings = t.ratings.items.length > 0;

  return (
    <>
      {/* ============== HERO + ORG SNAPSHOT ============== */}
      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
              <Heading level={1} className="mb-5">
                {t.hero.headline}
              </Heading>
              <p className="text-lg sm:text-xl text-[hsl(var(--text-muted))]">
                {t.hero.subhead}
              </p>
            </div>
            <Card className="p-6 sm:p-8" data-testid="org-snapshot-card">
              <Eyebrow>{t.orgSnapshot.eyebrow}</Eyebrow>
              <Heading level={2} className="text-2xl sm:text-3xl mb-2">
                {t.orgSnapshot.headline}
              </Heading>
              {t.orgSnapshot.subhead && (
                <p className="text-[hsl(var(--text-muted))] mb-2">
                  {t.orgSnapshot.subhead}
                </p>
              )}
              <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
                <SnapshotRow label="Legal name" value={org.name} />
                <SnapshotRow
                  label="EIN"
                  value={<span className="font-mono">{org.ein}</span>}
                />
                <SnapshotRow label="Founded" value={String(org.foundedYear)} />
                <SnapshotRow label="Status" value={t.orgSnapshot.statusValue} />
                <SnapshotRow
                  label="Mailing address"
                  span={2}
                  value={
                    <address className="not-italic text-[hsl(var(--text))]">
                      {addr.line1}
                      <br />
                      {addr.line2 && (
                        <>
                          {addr.line2}
                          <br />
                        </>
                      )}
                      {addr.city}, {addr.state} {addr.zip}
                      <br />
                      {addr.country}
                    </address>
                  }
                />
              </dl>
              {t.orgSnapshot.statusLine && (
                <p className="mt-6 text-sm text-[hsl(var(--text-muted))] italic">
                  {t.orgSnapshot.statusLine}
                </p>
              )}
            </Card>
          </div>
        </Container>
      </Section>

      {/* ============== FINANCIALS ============== */}
      <Section tone="muted" data-testid="financials-section">
        <Container className="max-w-4xl">
          <SectionHeader
            eyebrow={t.financials.eyebrow}
            headline={t.financials.headline}
            subhead={t.financials.subhead}
          />
          {showFinancials ? (
            <Card className="p-6 sm:p-8" data-testid="financials-card">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3 border-b border-[hsl(var(--border))] pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--text-muted))]">
                    Fiscal year
                  </p>
                  <p className="text-2xl font-bold text-[hsl(var(--text))]">
                    FY{t.financials.fiscalYear}
                  </p>
                </div>
                <p className="text-sm text-[hsl(var(--text-muted))]">
                  Most recent reported
                </p>
              </div>
              <ul
                aria-label={`FY${t.financials.fiscalYear} financial breakdown`}
                className="divide-y divide-[hsl(var(--border))]"
              >
                {t.financials.lines.map((line) => (
                  <li
                    key={line.label}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[hsl(var(--text))]">
                        {line.label}
                      </p>
                      {line.context && (
                        <p className="text-xs text-[hsl(var(--text-muted))]">
                          {line.context}
                        </p>
                      )}
                    </div>
                    <div className="flex items-baseline gap-3">
                      {typeof line.percent === "number" && (
                        <span className="inline-flex items-center rounded-full bg-[hsl(var(--primary))]/10 px-2.5 py-0.5 text-xs font-semibold text-[hsl(var(--primary))]">
                          {line.percent}%
                        </span>
                      )}
                      <span className="text-lg font-bold text-[hsl(var(--text))] tabular-nums">
                        {line.value}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              {t.financials.note && (
                <p className="mt-6 text-sm text-[hsl(var(--text-muted))]">
                  {t.financials.note}
                </p>
              )}
            </Card>
          ) : (
            <Card
              className="p-6 text-center text-[hsl(var(--text-muted))]"
              data-testid="financials-empty"
            >
              {t.financials.emptyState ?? "Financial details coming soon."}
            </Card>
          )}
        </Container>
      </Section>

      {/* ============== FILINGS ============== */}
      <Section data-testid="filings-section">
        <Container className="max-w-4xl">
          <SectionHeader
            eyebrow={t.filings.eyebrow}
            headline={t.filings.headline}
            subhead={t.filings.subhead}
          />
          {showFilings ? (
            <ul
              aria-label="Reports and filings"
              className="grid gap-4 sm:grid-cols-2"
            >
              {t.filings.items.map((filing, idx) => (
                <li key={`${filing.label}-${filing.year}-${idx}`}>
                  <a
                    href={filing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 transition-colors hover:border-[hsl(var(--primary))] hover:shadow-md"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                    >
                      <FileText className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-[hsl(var(--text-muted))]">
                        FY{filing.year}
                      </span>
                      <span className="block truncate font-semibold text-[hsl(var(--text))]">
                        {filing.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-[hsl(var(--text-muted))] group-hover:text-[hsl(var(--primary))]"
                    />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <Card
              className="p-6 text-center text-[hsl(var(--text-muted))]"
              data-testid="filings-empty"
            >
              {t.filings.emptyState ?? "Reports coming soon."}
            </Card>
          )}
        </Container>
      </Section>

      {/* ============== RATINGS (hides when empty) ============== */}
      {showRatings && (
        <Section tone="muted" data-testid="ratings-section">
          <Container className="max-w-5xl">
            <SectionHeader
              eyebrow={t.ratings.eyebrow}
              headline={t.ratings.headline}
              subhead={t.ratings.subhead}
            />
            <ul
              aria-label="Charity ratings and affiliations"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {t.ratings.items.map((rating) => (
                <li key={rating.org}>
                  <a
                    href={rating.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 text-center transition-colors hover:border-[hsl(var(--primary))] hover:shadow-md"
                  >
                    <RatingLogo src={rating.logoPath} alt={rating.org} />
                    <span className="block text-sm font-semibold text-[hsl(var(--text))]">
                      {rating.org}
                    </span>
                    <span className="block text-xs text-[hsl(var(--text-muted))]">
                      {rating.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* ============== GOVERNANCE ============== */}
      <Section data-testid="governance-section">
        <Container className="max-w-3xl">
          <SectionHeader
            eyebrow={t.governance.eyebrow}
            headline={t.governance.headline}
          />
          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-[hsl(var(--text))]">
            {t.governance.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          {t.governance.boardRoster && (
            <p className="mt-6 text-center sm:text-left">
              <BoardRosterLink {...t.governance.boardRoster} />
            </p>
          )}
        </Container>
      </Section>

      {/* ============== DONOR COMMITMENTS ============== */}
      <Section tone="muted" data-testid="commitments-section">
        <Container>
          <SectionHeader
            eyebrow={t.donorCommitments.eyebrow}
            headline={t.donorCommitments.headline}
            subhead={t.donorCommitments.subhead}
          />
          <ul
            aria-label="Our commitments to donors"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {t.donorCommitments.items.map((item) => {
              const Icon = COMMITMENT_ICONS[item.icon];
              return (
                <li key={item.title}>
                  <Card className="h-full p-6">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] mb-4"
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <Heading level={3} className="text-lg mb-2">
                      {item.title}
                    </Heading>
                    <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed">
                      {item.body}
                    </p>
                    {item.link && (
                      <p className="mt-3">
                        <CommitmentLink {...item.link} />
                      </p>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ============== CONTACT POINTER ============== */}
      <Section className="py-16 sm:py-24">
        <Container className="max-w-3xl text-center">
          <Eyebrow>{t.contactPointer.eyebrow}</Eyebrow>
          <Heading level={2} className="mb-5">
            {t.contactPointer.headline}
          </Heading>
          <p className="text-lg text-[hsl(var(--text-muted))] mb-8">
            {t.contactPointer.body}
          </p>
          <Link
            to={t.contactPointer.ctaHref}
            data-testid="transparency-contact-cta"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            {t.contactPointer.ctaLabel}
          </Link>
        </Container>
      </Section>
    </>
  );
}
