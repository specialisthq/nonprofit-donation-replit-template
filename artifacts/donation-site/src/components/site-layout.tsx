import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShieldCheck, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import site from "@config";
import { Container } from "@/components/primitives";
import { ButtonLink } from "@/components/button";
import { donateLinkProps } from "@/lib/paypal";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/impact", label: "Impact" },
  { href: "/transparency", label: "Transparency" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/donor-bill-of-rights", label: "Donor Bill of Rights" },
];

function TrustBar() {
  return (
    <div className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs sm:text-sm">
      <Container className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Secure donation
        </span>
        <span aria-hidden="true" className="opacity-50">•</span>
        <span>Tax-deductible</span>
        <span aria-hidden="true" className="opacity-50">•</span>
        <span>501(c)(3)</span>
        <span aria-hidden="true" className="opacity-50">•</span>
        <span className="font-mono">EIN: {site.org.ein}</span>
      </Container>
    </div>
  );
}

function Logo() {
  const { logoPath } = site.branding;
  // Use the configured logo if present; fall back to a styled letter mark
  // so the template still looks complete before a cloner adds their logo.
  const [broken, setBroken] = useState(false);
  if (logoPath && !broken) {
    return (
      <img
        src={logoPath}
        alt={`${site.org.name} logo`}
        className="h-9 w-auto"
        onError={() => setBroken(true)}
      />
    );
  }
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-bold">
      {site.org.shortName.charAt(0)}
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--surface))]/80">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-[hsl(var(--primary))]"
        >
          <Logo />
          <span>{site.org.shortName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[hsl(var(--primary))]",
                pathname === link.href
                  ? "text-[hsl(var(--primary))]"
                  : "text-[hsl(var(--text))]",
              )}
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink {...donateLinkProps()} variant="primary" size="sm">
            Donate now
          </ButtonLink>
        </nav>

        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-[hsl(var(--text))] hover:bg-[hsl(var(--surface-muted))]"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="md:hidden border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-[hsl(var(--text))] hover:bg-[hsl(var(--surface-muted))]"
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink
              {...donateLinkProps()}
              variant="primary"
              size="md"
              className="mt-2"
              onClick={() => setOpen(false)}
            >
              Donate now
            </ButtonLink>
          </Container>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { org, social, copy } = site;
  const transparency = copy.transparency;
  const financialLinks: { label: string; href: string; external?: boolean }[] = [
    { label: "Transparency", href: "/transparency" },
  ];
  if (transparency.annualReportUrl) {
    financialLinks.push({
      label: "Annual report",
      href: transparency.annualReportUrl,
      external: true,
    });
  }
  if (transparency.form990Url) {
    financialLinks.push({
      label: "IRS Form 990",
      href: transparency.form990Url,
      external: true,
    });
  }
  for (const rating of transparency.ratings ?? []) {
    financialLinks.push({ label: rating.name, href: rating.url, external: true });
  }

  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--surface-muted))] py-12 text-sm">
      <Container className="grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-bold text-base text-[hsl(var(--primary))] mb-2">{org.name}</div>
          <p className="text-[hsl(var(--text-muted))] mb-3">{org.tagline}</p>
          <address className="not-italic text-[hsl(var(--text-muted))]">
            {org.address.line1}<br />
            {org.address.line2 && <>{org.address.line2}<br /></>}
            {org.address.city}, {org.address.state} {org.address.zip}
          </address>
          <p className="mt-3 text-[hsl(var(--text-muted))] font-mono text-xs">
            EIN: {org.ein}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-[hsl(var(--text))] mb-3">Learn more</h4>
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[hsl(var(--text))] mb-3">Financials</h4>
          <ul className="space-y-2">
            {financialLinks.map((l) => (
              <li key={l.label}>
                {l.external ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))]"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link to={l.href} className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))]">
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <h4 className="font-semibold text-[hsl(var(--text))] mt-6 mb-3">Legal</h4>
          <ul className="space-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[hsl(var(--text))] mb-3">Connect</h4>
          <ul className="space-y-2">
            <li>
              <a href={`mailto:${org.contactEmail}`} className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))]">
                {org.contactEmail}
              </a>
            </li>
            {org.phone && (
              <li className="text-[hsl(var(--text-muted))]">{org.phone}</li>
            )}
          </ul>
          {Object.values(social).some(Boolean) && (
            <div className="mt-4 flex items-center gap-3">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))]">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))]">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))]">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))]">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary))]">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </Container>
      <Container className="mt-10 border-t border-[hsl(var(--border))] pt-6 text-xs text-[hsl(var(--text-muted))] flex flex-wrap justify-between gap-2">
        <span>© {new Date().getFullYear()} {org.name}. All rights reserved.</span>
        <span>{org.name} is a registered 501(c)(3) nonprofit.</span>
      </Container>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">Skip to content</a>
      <TrustBar />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
