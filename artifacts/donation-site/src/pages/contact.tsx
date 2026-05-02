import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import site from "@config";
import { Card, Container, Heading, Section } from "@/components/primitives";
import { buttonVariants } from "@/components/button";
import { cn } from "@/lib/utils";

/**
 * Stable subject value used when the donor picks the always-present
 * "Other / general question" option. Kept out of the reasons list
 * so it doesn't clutter the discovery copy.
 */
const GENERAL_SUBJECT_VALUE = "general";

/** Permissive but fail-fast email check — catches the obvious typos. */
const EMAIL_RE = /^\S+@\S+\.\S+$/;

/**
 * Pure mailto-URL builder. Exported (via the file's only mailto
 * builder) so the test can hit it indirectly through the form's
 * success state. URLSearchParams encodes spaces as `+`, which mail
 * clients accept but some show literally — replacing them with %20
 * keeps subject lines and bodies looking right everywhere.
 */
function buildMailtoUrl({
  to,
  shortName,
  name,
  email,
  topicLabel,
  topicValue,
  message,
}: {
  to: string;
  shortName: string;
  name: string;
  email: string;
  topicLabel: string;
  topicValue: string;
  message: string;
}): string {
  const subjectLine = `[${shortName}] ${topicLabel} — from ${name.trim()}`;
  const bodyLines = [
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    `Topic: ${topicLabel} (${topicValue})`,
    "",
    message.trim(),
  ];
  const params = new URLSearchParams({
    subject: subjectLine,
    body: bodyLines.join("\n"),
  });
  return `mailto:${to}?${params.toString().replace(/\+/g, "%20")}`;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--primary))] mb-3">
      {children}
    </p>
  );
}

function SectionHeader({
  eyebrow,
  headline,
  subhead,
  align = "center",
}: {
  eyebrow: string;
  headline: string;
  subhead?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "mb-10 sm:mb-14 max-w-3xl",
        align === "center" ? "text-center mx-auto" : "",
      )}
    >
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

/**
 * Renders a single contact-method row (icon + label + value). Pulled
 * out so the email/phone/address blocks all align consistently.
 */
function MethodRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span
        aria-hidden="true"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--text-muted))]">
          {label}
        </p>
        <div className="mt-1 text-base font-medium text-[hsl(var(--text))]">
          {children}
        </div>
      </div>
    </div>
  );
}

type FormErrors = Partial<{
  name: string;
  email: string;
  message: string;
}>;

function ContactForm({ to, shortName }: { to: string; shortName: string }) {
  const f = site.copy.contact.form;
  const reasons = site.copy.contact.reasons.items;

  /**
   * If the donor lands on /contact#stock-daf (etc.) — the same anchors
   * the reasons list uses — preselect the matching subject so the form
   * picks up where their click left off.
   */
  const initialSubject = useMemo(() => {
    if (typeof window === "undefined") return GENERAL_SUBJECT_VALUE;
    const hash = window.location.hash.replace(/^#/, "");
    if (reasons.some((r) => r.id === hash)) return hash;
    return GENERAL_SUBJECT_VALUE;
  }, [reasons]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!name.trim()) next.name = f.errors.nameRequired;
    if (!email.trim()) next.email = f.errors.emailRequired;
    else if (!EMAIL_RE.test(email.trim())) next.email = f.errors.emailInvalid;
    if (!message.trim()) next.message = f.errors.messageRequired;
    return next;
  }

  function navigateMailto(url: string) {
    /**
     * Use a transient anchor click instead of `window.location.href = …`
     * so it works in iframes/preview environments and doesn't fight
     * SPA history. mailto: handlers are owned by the OS — the browser
     * just hands off.
     */
    const link = document.createElement("a");
    link.href = url;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Focus the first invalid field so keyboard donors aren't lost.
      if (next.name) nameRef.current?.focus();
      else if (next.email) emailRef.current?.focus();
      else if (next.message) messageRef.current?.focus();
      return;
    }
    const topicLabel =
      reasons.find((r) => r.id === subject)?.topic ?? f.generalSubjectLabel;
    const url = buildMailtoUrl({
      to,
      shortName,
      name,
      email,
      topicLabel,
      topicValue: subject,
      message,
    });
    setSubmittedUrl(url);
    navigateMailto(url);
  }

  if (submittedUrl) {
    return (
      <Card
        className="p-6 sm:p-8 text-center"
        data-testid="contact-form-success"
      >
        <span
          aria-hidden="true"
          className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
        >
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <Heading level={3} className="mb-3">
          {f.successHeadline}
        </Heading>
        <p className="text-base text-[hsl(var(--text-muted))] mb-6">
          {f.successBody}
        </p>
        <a
          href={submittedUrl}
          data-testid="contact-form-mailto-link"
          className={buttonVariants({ variant: "primary", size: "md" })}
        >
          {f.successCtaLabel}
        </a>
      </Card>
    );
  }

  const labelCls =
    "block text-sm font-semibold text-[hsl(var(--text))] mb-2";
  const inputBase =
    "block w-full rounded-lg border bg-[hsl(var(--surface))] px-3.5 py-2.5 text-base text-[hsl(var(--text))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-1";
  const inputCls = (hasError: boolean) =>
    cn(
      inputBase,
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-[hsl(var(--border))] focus:border-[hsl(var(--primary))]",
    );

  return (
    <Card className="p-6 sm:p-8" data-testid="contact-form-card">
      <form
        noValidate
        onSubmit={handleSubmit}
        aria-label="Contact form"
        data-testid="contact-form"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelCls}>
              {f.nameLabel}
            </label>
            <input
              ref={nameRef}
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className={inputCls(Boolean(errors.name))}
            />
            {errors.name && (
              <p
                id="contact-name-error"
                role="alert"
                className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-red-600"
              >
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="contact-email" className={labelCls}>
              {f.emailLabel}
            </label>
            <input
              ref={emailRef}
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "contact-email-error" : undefined
              }
              className={inputCls(Boolean(errors.email))}
            />
            {errors.email && (
              <p
                id="contact-email-error"
                role="alert"
                className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-red-600"
              >
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {errors.email}
              </p>
            )}
          </div>
        </div>
        <div className="mt-5">
          <label htmlFor="contact-subject" className={labelCls}>
            {f.subjectLabel}
          </label>
          <select
            id="contact-subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputCls(false)}
          >
            {reasons.map((r) => (
              <option key={r.id} value={r.id}>
                {r.topic}
              </option>
            ))}
            <option value={GENERAL_SUBJECT_VALUE}>
              {f.generalSubjectLabel}
            </option>
          </select>
        </div>
        <div className="mt-5">
          <label htmlFor="contact-message" className={labelCls}>
            {f.messageLabel}
          </label>
          <textarea
            ref={messageRef}
            id="contact-message"
            name="message"
            rows={6}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            className={inputCls(Boolean(errors.message))}
          />
          {errors.message && (
            <p
              id="contact-message-error"
              role="alert"
              className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-red-600"
            >
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {errors.message}
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[hsl(var(--text-muted))]">
            {/*
              Plain-language privacy note. The form never POSTs anywhere
              — submitting just hands the prefilled message off to the
              donor's own email client. That's worth saying out loud.
            */}
            We don't store anything from this form. Your message goes
            straight to your email app.
          </p>
          <button
            type="submit"
            data-testid="contact-form-submit"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            {f.submitLabel}
          </button>
        </div>
      </form>
    </Card>
  );
}

/**
 * Cloner-facing slot. Renders a clearly marked placeholder card that
 * tells whoever's editing the template exactly where to paste a
 * Formspree / Tally / Typeform / etc. embed. The card uses the same
 * visual style as the mailto form so the page never looks broken.
 */
function EmbedSlot() {
  const { embedSlot } = site.copy.contact;
  return (
    <Card className="p-6 sm:p-8" data-testid="contact-embed-slot">
      <Heading level={3} className="mb-3">
        {embedSlot.headline}
      </Heading>
      <p className="text-base text-[hsl(var(--text-muted))] mb-5">
        {embedSlot.body}
      </p>
      {/*
        ============================================================
        EMBED_SLOT — drop your form embed here.
        ------------------------------------------------------------
        Paste your Formspree <form action=...>, Tally <iframe>,
        Typeform <div data-tf-...>, etc. inside this block. The
        surrounding <Card> wrapper handles padding, border, and
        background; your embed just renders inside.
        ============================================================
      */}
      <div className="rounded-lg border-2 border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface-muted))] p-8 text-center text-sm text-[hsl(var(--text-muted))]">
        Drop your form embed here.
      </div>
    </Card>
  );
}

export function ContactPage() {
  const c = site.copy.contact;
  const { org } = site;
  const showHours = Boolean(c.hours && c.hours.items.length > 0);

  // Update the URL hash when a reason link is clicked so the form
  // can preselect the topic on next visit. (Anchors also support
  // bookmarkable deep-links into specific topics.)
  useEffect(() => {
    // No-op effect — anchors handle scroll natively. Kept here as a
    // marker for future enhancement (e.g. smooth-scroll or focus).
  }, []);

  return (
    <>
      {/* ============== HERO ============== */}
      <Section className="py-12 sm:py-16">
        <Container className="max-w-3xl text-center">
          <Eyebrow>{c.hero.eyebrow}</Eyebrow>
          <Heading level={1} className="mb-5">
            {c.hero.headline}
          </Heading>
          <p className="text-lg sm:text-xl text-[hsl(var(--text-muted))]">
            {c.hero.subhead}
          </p>
        </Container>
      </Section>

      {/* ============== METHODS CARD ============== */}
      <Section tone="muted" data-testid="contact-methods-section">
        <Container className="max-w-4xl">
          <SectionHeader
            eyebrow={c.methods.eyebrow}
            headline={c.methods.headline}
          />
          <Card className="p-6 sm:p-8" data-testid="contact-methods-card">
            <div className="grid gap-6 sm:grid-cols-2">
              <MethodRow icon={Mail} label={c.methods.emailLabel}>
                <a
                  href={`mailto:${org.contactEmail}`}
                  className="text-[hsl(var(--primary))] hover:underline break-all"
                >
                  {org.contactEmail}
                </a>
              </MethodRow>
              {org.phone && (
                <MethodRow icon={Phone} label={c.methods.phoneLabel}>
                  <a
                    href={`tel:${org.phone.replace(/[^\d+]/g, "")}`}
                    className="text-[hsl(var(--primary))] hover:underline"
                  >
                    {org.phone}
                  </a>
                </MethodRow>
              )}
              <MethodRow icon={MapPin} label={c.methods.addressLabel}>
                <address className="not-italic text-[hsl(var(--text))]">
                  {org.address.line1}
                  <br />
                  {org.address.line2 && (
                    <>
                      {org.address.line2}
                      <br />
                    </>
                  )}
                  {org.address.city}, {org.address.state} {org.address.zip}
                  <br />
                  {org.address.country}
                </address>
              </MethodRow>
              <MethodRow icon={Clock} label="Response time">
                <p className="text-sm font-normal text-[hsl(var(--text-muted))]">
                  {c.methods.responseTime}
                </p>
              </MethodRow>
            </div>
          </Card>
        </Container>
      </Section>

      {/* ============== REASONS LIST ============== */}
      <Section data-testid="contact-reasons-section">
        <Container className="max-w-4xl">
          <SectionHeader
            eyebrow={c.reasons.eyebrow}
            headline={c.reasons.headline}
            subhead={c.reasons.subhead}
          />
          <ul
            aria-label="Common reasons donors reach out"
            className="grid gap-4 sm:grid-cols-2"
          >
            {c.reasons.items.map((reason) => (
              <li key={reason.id} id={reason.id}>
                <a
                  href={`#${reason.id}`}
                  data-testid={`contact-reason-${reason.id}`}
                  className="group flex h-full items-start gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5 transition-colors hover:border-[hsl(var(--primary))] hover:shadow-md"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-[hsl(var(--text))]">
                      {reason.topic}
                    </span>
                    <span className="mt-1 block text-sm text-[hsl(var(--text-muted))]">
                      {reason.body}
                    </span>
                  </span>
                  <ChevronRight
                    aria-hidden="true"
                    className="mt-1 h-5 w-5 shrink-0 text-[hsl(var(--text-muted))] group-hover:text-[hsl(var(--primary))]"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ============== FORM (or EMBED SLOT) ============== */}
      <Section tone="muted" data-testid="contact-form-section">
        <Container className="max-w-3xl">
          <SectionHeader
            eyebrow={c.form.eyebrow}
            headline={c.form.headline}
            subhead={c.form.subhead}
          />
          {c.embedSlot.enabled ? (
            <EmbedSlot />
          ) : (
            <ContactForm to={org.contactEmail} shortName={org.shortName} />
          )}
        </Container>
      </Section>

      {/* ============== HOURS (optional) ============== */}
      {showHours && c.hours && (
        <Section data-testid="contact-hours-section">
          <Container className="max-w-3xl">
            <SectionHeader
              eyebrow={c.hours.eyebrow}
              headline={c.hours.headline}
            />
            <Card className="p-6 sm:p-8">
              <ul
                aria-label="Office hours"
                className="divide-y divide-[hsl(var(--border))]"
              >
                {c.hours.items.map((row) => (
                  <li
                    key={row.day}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <span className="font-semibold text-[hsl(var(--text))]">
                      {row.day}
                    </span>
                    <span className="text-[hsl(var(--text-muted))]">
                      {row.hours}
                    </span>
                  </li>
                ))}
              </ul>
              {c.hours.timezone && (
                <p
                  data-testid="contact-hours-timezone"
                  className="mt-4 text-xs italic text-[hsl(var(--text-muted))]"
                >
                  {c.hours.timezone}
                </p>
              )}
            </Card>
          </Container>
        </Section>
      )}
    </>
  );
}
