/**
 * site.config.ts
 * ------------------------------------------------------------------
 * THIS IS THE ONLY FILE YOU NEED TO EDIT to customize your donation site.
 *
 * After cloning this template:
 *   1. Replace every value below with your nonprofit's real information.
 *   2. Set `paypal.hostedButtonId` to the ID of your PayPal Donate
 *      hosted button (https://www.paypal.com/donate/buttons).
 *   3. Replace any image paths under /public with your own assets.
 *   4. (Optional) Tweak `branding.colors` to match your brand.
 *
 * Everything in this file is strongly typed — your editor will tell you
 * if you forget a field.
 * ------------------------------------------------------------------
 */

export type SuggestedAmount = {
  amount: number;
  /** Short, concrete impact label, e.g. "Funds 5 meals" */
  impactLabel: string;
  /** If true, this option is highlighted as the recommended default. */
  default?: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ImpactMetric = {
  value: string;
  label: string;
  /** Optional 1-line context shown beneath the metric on the landing page. */
  context?: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
};

export type SecondaryGivingCard = {
  title: string;
  body: string;
  ctaLabel: string;
  /** Internal route (e.g. "/contact") or external URL. */
  href: string;
  /** If true, opens in a new tab (use for external links). */
  external?: boolean;
  /** If "share", triggers the native share dialog instead of navigating. */
  action?: "share";
};

export type StoryBlock = {
  eyebrow: string;
  headline: string;
  body: string[];
  /** Path under /public; falls back to a styled gradient if omitted/missing. */
  imagePath?: string;
  imageAlt?: string;
  /** Optional read-more link shown beneath the story. */
  link?: { label: string; href: string };
};

export type TrustStripItem = {
  icon: "lock" | "award" | "shield";
  title: string;
  body: string;
  /** Optional internal route for an inline link inside `body`. */
  linkHref?: string;
  linkLabel?: string;
};

export type CharityRating = {
  /** Display name, e.g. "Charity Navigator" or "Candid Platinum". */
  name: string;
  /** Short rating descriptor, e.g. "Four-Star Charity" or "Platinum Seal 2025". */
  label: string;
  /** Public URL of the org's profile on the rating service. */
  url: string;
  /** Optional path under /public for a logo image; falls back to text-only badge. */
  logoPath?: string;
};

export type DonationModuleCopy = {
  heading: string;
  subhead: string;
  amountLegend: string;
  customLabel: string;
  customPlaceholder: string;
  oneTimeLabel: string;
  monthlyLabel: string;
  /** CTA fallback when no amount is selected. */
  defaultCtaLabel: string;
  /** Microcopy items shown beneath the CTA. */
  trustItems: {
    icon: "lock" | "shield" | "receipt" | "refresh";
    label: string;
    /**
     * Optional internal route (e.g. "/refund-policy"). If set, the
     * label renders as a link so donors can read the full policy
     * behind a piece of trust microcopy without leaving the form.
     */
    href?: string;
  }[];
};

export type SectionHeader = {
  eyebrow: string;
  headline: string;
  subhead?: string;
};

export type FinalCta = {
  headline: string;
  body: string;
  ctaLabel: string;
};

/**
 * Shared shape for every long-form legal page (privacy, terms,
 * refund, donor bill of rights). Sections render in order.
 */
export type LegalPageCopy = {
  title: string;
  /**
   * Free-form last-updated label, e.g. "September 15, 2025". Pass
   * the string verbatim so cloners can use any date format their
   * jurisdiction expects.
   */
  lastUpdated: string;
  /** 1–2 sentence opener shown above the first section. */
  intro: string;
  sections: {
    /** URL-safe slug used as a heading anchor, e.g. "what-we-collect". */
    id: string;
    heading: string;
    /** One paragraph per array entry. */
    body: string[];
    /** Optional bulleted list rendered after the paragraphs. */
    bullets?: string[];
    /**
     * Optional list of named links (e.g. PayPal's terms of service)
     * rendered as a small "Related links" group at the bottom of
     * the section. Set `external: true` for off-site URLs to apply
     * `target="_blank" rel="noopener noreferrer"`.
     */
    links?: { label: string; href: string; external?: boolean }[];
  }[];
};

export type SiteConfig = {
  org: {
    name: string;
    shortName: string;
    tagline: string;
    missionOneLiner: string;
    /** US 501(c)(3) Employer Identification Number, e.g. "12-3456789" */
    ein: string;
    foundedYear: number;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    contactEmail: string;
    phone?: string;
    /**
     * Optional canonical, public-facing URL of the site (no trailing slash),
     * e.g. "https://give.brightwell.org". Used for social share intents on
     * the thank-you page so links work correctly when shared from a custom
     * domain, staging URL, or anywhere window.location is misleading.
     * Falls back to window.location.origin + BASE_URL when omitted.
     */
    siteUrl?: string;
  };

  paypal: {
    /** Your PayPal Donate hosted-button ID. Required. */
    hostedButtonId: string;
    /** "newTab" opens PayPal in a new tab; "sameTab" replaces the page. */
    flowMode: "newTab" | "sameTab";
    /** Optional thank-you URL to send PayPal donors back to. */
    returnUrl?: string;
  };

  amounts: {
    oneTime: SuggestedAmount[];
    monthly: SuggestedAmount[];
  };

  branding: {
    /**
     * All colors are HSL triplets like "172 70% 28%" so they slot directly
     * into Tailwind's `hsl(var(--token))` pattern. Pick from a color tool.
     */
    colors: {
      primary: string;
      primaryForeground: string;
      accent: string;
      accentForeground: string;
      surface: string;
      surfaceMuted: string;
      text: string;
      textMuted: string;
      border: string;
    };
    /** Path under /public, e.g. "/logo.svg" */
    logoPath: string;
    /** Hero image path, ideally 1600x900+ */
    heroImagePath: string;
    /** Optional supporting images for About / Impact pages */
    supportingImagePaths?: string[];
  };

  typography?: {
    headingFamily?: string;
    bodyFamily?: string;
  };

  copy: {
    landing: {
      eyebrow: string;
      headline: string;
      subhead: string;
      caseForSupport: string[];
      /** Single-line note shown right under the donation form. */
      donationModuleNote?: string;
      donationModule: DonationModuleCopy;
      /** Optional one-line donor testimonial shown in the hero trust strip. */
      testimonial?: Testimonial;
      trustStrip: TrustStripItem[];
      /**
       * Charity-rating badges (Charity Navigator, Candid, BBB, etc.).
       * Empty array hides the slot entirely.
       */
      charityRatings: CharityRating[];
      /**
       * Three impact metrics anchored beneath the hero. If omitted,
       * the landing page falls back to the first 3 of `impact.metrics`.
       */
      impactProof?: ImpactMetric[];
      impactProofHeader: SectionHeader;
      storyBlock: StoryBlock;
      giftImpact: SectionHeader;
      faqHeader: SectionHeader;
      secondaryGiving: {
        eyebrow: string;
        headline: string;
        cards: SecondaryGivingCard[];
      };
      faqs: FaqItem[];
      finalCta: FinalCta;
    };
    thankYou: {
      headline: string;
      /** Warm body paragraph(s) shown directly under the thank-you headline. */
      body: string;
      /**
       * Microcopy reassuring the donor that PayPal has emailed their receipt.
       * Shown right under the body. Should mention checking spam + how to
       * reach you if it doesn't arrive.
       */
      receiptNote: string;
      /** Plain-text message used by the share row (Web Share + social fallbacks). */
      shareText: string;
      /**
       * Optional embed URL for a short thank-you video (YouTube/Vimeo embed
       * URL, or a direct .mp4 path under /public). Hidden when empty.
       */
      videoUrl?: string;
      /** Card inviting one-time donors to upgrade to a monthly gift. */
      monthlyUpgrade: {
        eyebrow: string;
        headline: string;
        body: string;
        ctaLabel: string;
      };
      /**
       * Optional employer-match prompt. The card is hidden entirely when
       * `employerMatch` is omitted. Cloners can either link out to a public
       * matching-gift database (e.g. Double the Donation) or to their own
       * /contact page if they handle matches manually.
       */
      employerMatch?: {
        eyebrow: string;
        headline: string;
        body: string;
        ctaLabel: string;
        /** Internal route (e.g. "/contact") or external URL. */
        href: string;
        /** True for an external URL; opens in a new tab. */
        external?: boolean;
      };
      /** Section showing one or two impact reminder tiers. */
      impactReminder: {
        eyebrow: string;
        headline: string;
        /**
         * Up to two impact tiers. If omitted, the page falls back to the
         * first 1–2 of `amounts.oneTime` with their `impactLabel`.
         */
        tiers?: { amount: number; impactLabel: string }[];
      };
      /** "What happens next" reassurance steps. */
      whatHappensNext: {
        eyebrow: string;
        headline: string;
        steps: { title: string; body: string }[];
      };
      /**
       * Newsletter opt-in placeholder. The body of the page renders an
       * inline placeholder UI styled like the rest of the site; the cloner
       * pastes their Mailchimp/Beehiiv/etc. embed where the placeholder is.
       */
      newsletter: {
        eyebrow: string;
        headline: string;
        body: string;
        /** Placeholder text on the disabled email input. */
        emailPlaceholder: string;
        /** Disabled CTA label on the placeholder form. */
        ctaLabel: string;
      };
      /** Heading + intro for the social-follow row. */
      socialFollow: {
        eyebrow: string;
        headline: string;
        body: string;
      };
      /** Heading + intro for the share row. */
      share: {
        eyebrow: string;
        headline: string;
        body: string;
        /** Label of the native Web Share API button. */
        nativeCtaLabel: string;
      };
    };
    about: {
      /** Short uppercase eyebrow above the hero headline. */
      eyebrow: string;
      /** Hero headline, e.g. "We're neighbors helping neighbors." */
      headline: string;
      /** One-sentence supporting subhead beneath the headline. */
      subhead: string;
      /**
       * Optional supporting image for the hero. The path is relative to
       * /public (e.g. "/about-hero.jpg"). When omitted or the image fails
       * to load, the page falls back to a tasteful brand-colored
       * placeholder so the layout never collapses.
       */
      image?: {
        src?: string;
        alt: string;
      };
      /** Story / why-we-exist body — 2-4 short paragraphs. */
      story: string[];
      /** "What we believe" values cards. */
      values: {
        eyebrow: string;
        headline: string;
        subhead?: string;
        items: {
          /** lucide-react icon picked from a curated set. */
          icon: "heart" | "users" | "sparkles" | "handshake" | "shield" | "target";
          title: string;
          body: string;
        }[];
      };
      /**
       * Optional team section. Hidden entirely when `team` is omitted or
       * `members` is empty — clones with no team to feature still get a
       * clean page.
       */
      team?: {
        eyebrow: string;
        headline: string;
        body: string;
        members: {
          name: string;
          role: string;
          /** Path under /public; falls back to an initials avatar. */
          photoPath?: string;
          bio?: string;
        }[];
      };
      /** Closing call-to-action that drives the visitor back to the donation flow. */
      closingCta: {
        eyebrow?: string;
        headline: string;
        body: string;
        /** Visible label of the donate button. */
        ctaLabel: string;
      };
    };
    impact: {
      /** Top-of-page headline + a single supporting metric. */
      hero: {
        eyebrow: string;
        headline: string;
        subhead: string;
        /**
         * One large headline number rendered next to the hero copy
         * (e.g. "94¢ of every dollar goes to programs"). Use the most
         * credible single metric you can defend.
         */
        supportingMetric: { value: string; label: string; context?: string };
      };
      /**
       * Top-line metrics strip rendered under the hero. Also used as the
       * landing page's `impactProof` fallback when that field is omitted,
       * so cloners only have to maintain one source of truth.
       */
      metrics: ImpactMetric[];
      /** 2–4 program cards summarizing what the org actually does. */
      programs: {
        eyebrow: string;
        headline: string;
        subhead?: string;
        items: {
          name: string;
          summary: string;
          /**
           * lucide-react icon picked from a curated set. Defaults to
           * `sparkles` when omitted.
           */
          icon?:
            | "utensils"
            | "graduationCap"
            | "home"
            | "handshake"
            | "users"
            | "shield"
            | "sparkles";
          /** 2–4 tangible outcomes (big number + short label). */
          outcomes: { value: string; label: string }[];
        }[];
      };
      /**
       * Visual breakdown of how every donated dollar is spent. The page
       * renders a horizontal stacked bar plus a labeled legend, and links
       * out to the transparency page for full financials.
       *
       * Percentages should sum to ~100; the bar handles minor over/under.
       */
      moneyGoes: {
        eyebrow: string;
        headline: string;
        subhead?: string;
        breakdown: {
          label: string;
          /** 0–100. Width of this segment in the stacked bar. */
          percent: number;
          /** Color of this segment. Defaults rotate primary → accent → muted. */
          tone?: "primary" | "accent" | "muted";
        }[];
        /** Optional caveat shown beneath the bar (e.g. "Audited annually"). */
        note?: string;
        /** Link to the full financial breakdown (typically /transparency). */
        transparencyLink: { label: string; href: string };
      };
      /** Long-form donor-trust story with a pull-quote. */
      beneficiary: {
        eyebrow: string;
        headline: string;
        body: string[];
        quote: string;
        /** Display name of the person being quoted. */
        attribution: string;
        /** Optional context line beneath the attribution. */
        role?: string;
        imagePath?: string;
        imageAlt?: string;
      };
      /**
       * Short header for the "click an amount → land on the donation form
       * with that amount preselected" recap row. The tier values themselves
       * are reused from `amounts.oneTime` so they always match the landing
       * donation module.
       */
      tierRecap: {
        eyebrow: string;
        headline: string;
        subhead?: string;
      };
      /** Closing call-to-action that drives the visitor back to the donation flow. */
      closingCta: {
        eyebrow?: string;
        headline: string;
        body: string;
        /** Visible label of the donate button. */
        ctaLabel: string;
      };
    };
    transparency: {
      hero: {
        eyebrow: string;
        headline: string;
        subhead: string;
      };
      /**
       * "Trust at a glance" card shown beside the hero. Org name, EIN,
       * founded year, status, and address are pulled directly from
       * `site.org` (single source of truth) — these fields are just
       * the surrounding labels and microcopy.
       */
      orgSnapshot: {
        eyebrow: string;
        headline: string;
        subhead?: string;
        /**
         * Value rendered for the "Status" row, e.g. "501(c)(3) public
         * charity". Kept in config so non-US cloners (or US orgs with a
         * different status) can swap it without editing JSX.
         */
        statusValue: string;
        /** Microcopy below the data card, e.g. accreditation note. */
        statusLine?: string;
      };
      /**
       * Most-recent-FY revenue / expense splits. Renders gracefully
       * when only some lines are filled. When `lines` is empty, the
       * section shows `emptyState` copy instead of the breakdown.
       */
      financials: {
        eyebrow: string;
        headline: string;
        subhead?: string;
        /** Most recent fiscal year, e.g. 2024. */
        fiscalYear: number;
        lines: {
          label: string;
          /** Display string, e.g. "$1.2M" or "$92,400" — keep it human. */
          value: string;
          /** Optional 0–100 percent of total revenue. Renders as a small badge. */
          percent?: number;
          /** Optional 1-line context, e.g. "Audited Mar 2025". */
          context?: string;
        }[];
        note?: string;
        /** Empty-state copy shown when `lines` is empty. */
        emptyState?: string;
      };
      /**
       * Annual report, IRS Form 990, audited statements, etc.
       * Empty array shows the `emptyState` copy so cloners see what
       * belongs here rather than a blank section.
       */
      filings: {
        eyebrow: string;
        headline: string;
        subhead?: string;
        items: { label: string; url: string; year: number }[];
        emptyState?: string;
      };
      /**
       * Charity-rating affiliations (Charity Navigator, Candid, BBB,
       * etc.). Empty array hides the entire section cleanly.
       */
      ratings: {
        eyebrow: string;
        headline: string;
        subhead?: string;
        items: {
          org: string;
          label: string;
          url: string;
          /** Path under /public; falls back to a generic shield icon. */
          logoPath?: string;
        }[];
      };
      governance: {
        eyebrow: string;
        headline: string;
        body: string[];
        /**
         * Optional board roster / leadership page link. Set
         * `external: true` for an off-site URL (opens in a new tab);
         * leave it false/undefined for an internal route like
         * "/about#leadership".
         */
        boardRoster?: { label: string; href: string; external?: boolean };
      };
      /**
       * Plain-language donor commitments. Each item supports an
       * optional internal link (e.g. /refund-policy or
       * /donor-bill-of-rights) so commitments stay tied to the page
       * that backs them up.
       */
      donorCommitments: {
        eyebrow: string;
        headline: string;
        subhead?: string;
        items: {
          icon: "lock" | "receipt" | "shield" | "refresh" | "heart" | "ban";
          title: string;
          body: string;
          /**
           * Optional follow-up link. Set `external: true` for an
           * off-site URL (opens in a new tab); omit it for an internal
           * route like "/refund-policy".
           */
          link?: { label: string; href: string; external?: boolean };
        }[];
      };
      /** Small CTA pointing donors at /contact for follow-up questions. */
      contactPointer: {
        eyebrow: string;
        headline: string;
        body: string;
        ctaLabel: string;
        ctaHref: string;
      };
    };
    contact: {
      hero: {
        eyebrow: string;
        headline: string;
        subhead: string;
      };
      /**
       * "How to reach us" card. Email, phone, and address are pulled
       * from `site.org` (single source of truth) — these fields are
       * just the surrounding labels and the response-time promise.
       */
      methods: {
        eyebrow: string;
        headline: string;
        /** Plain-language response promise, e.g. "We reply within two business days." */
        responseTime: string;
        emailLabel: string;
        phoneLabel: string;
        addressLabel: string;
      };
      /**
       * Concrete reasons donors and supporters reach out. Each reason
       * has a stable `id` (used as a deep-link anchor on the page and
       * as the subject value sent to the email client), a short
       * `topic` label, and a 1–2 sentence body.
       */
      reasons: {
        eyebrow: string;
        headline: string;
        subhead?: string;
        items: {
          /** URL-safe slug, e.g. "stock-daf". Used as anchor + subject value. */
          id: string;
          topic: string;
          body: string;
        }[];
      };
      /**
       * Mailto-based contact form. No backend, no third-party network
       * calls. Submitting opens the donor's email client with the
       * subject and body prefilled; the message goes to
       * `site.org.contactEmail`.
       *
       * To wire a real form (Formspree, Tally, Typeform, etc.), set
       * `embedSlot.enabled = true` and follow the EMBED_SLOT comment
       * in /src/pages/contact.tsx — the schema and labels stay the
       * same.
       */
      form: {
        eyebrow: string;
        headline: string;
        subhead?: string;
        nameLabel: string;
        emailLabel: string;
        subjectLabel: string;
        /** Label for the always-present "Other / general question" subject option. */
        generalSubjectLabel: string;
        messageLabel: string;
        submitLabel: string;
        /** Success state shown after a valid submit triggers the email client. */
        successHeadline: string;
        successBody: string;
        successCtaLabel: string;
        /** Inline validation messages. */
        errors: {
          nameRequired: string;
          emailRequired: string;
          emailInvalid: string;
          messageRequired: string;
        };
      };
      /**
       * Cloner-facing slot for swapping the mailto form for a real
       * embedded form (Formspree, Tally, Typeform, etc.). When
       * `enabled` is true, the page hides the mailto form and shows
       * a clearly marked card with instructions for dropping in your
       * `<iframe>` or `<script>` snippet.
       */
      embedSlot: {
        headline: string;
        body: string;
        enabled: boolean;
      };
      /**
       * Optional office hours / availability block. Set to undefined
       * or give an empty `items` array to hide the section.
       */
      hours?: {
        eyebrow: string;
        headline: string;
        /** Optional. When omitted, the timezone footnote is hidden. */
        timezone?: string;
        items: { day: string; hours: string }[];
      };
    };
    /**
     * Long-form legal pages (privacy / terms / refund / donor bill of
     * rights). All four pages share the same `disclaimer` banner so
     * editing it once updates every page.
     */
    legal: {
      /**
       * Visible "this is a starter template — get your own counsel"
       * banner shown at the top of every legal page.
       */
      disclaimer: {
        heading: string;
        body: string;
      };
      /**
       * US state (or other jurisdiction) whose laws govern the Terms
       * of Use. Used wherever legal prose contains the `{state}`
       * token. Typically the state where the org is incorporated.
       */
      governingState: string;
      privacy: LegalPageCopy;
      terms: LegalPageCopy;
      refundPolicy: LegalPageCopy;
    };
  };

  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };

  /** Raw HTML injected into <head> at runtime — paste your analytics snippet here. */
  analyticsHeadHtml?: string;

  features: {
    showMonthlyUpsell: boolean;
    showShare: boolean;
    showStickyMobileCta: boolean;
  };
};

export const site: SiteConfig = {
  org: {
    name: "Brightwell Community Fund",
    shortName: "Brightwell",
    tagline: "Neighbors helping neighbors thrive.",
    missionOneLiner:
      "We fund local programs that help families in our community access food, housing stability, and after-school care.",
    ein: "00-0000000",
    foundedYear: 2014,
    address: {
      line1: "1200 Maple Avenue",
      line2: "Suite 210",
      city: "Springfield",
      state: "IL",
      zip: "62701",
      country: "USA",
    },
    contactEmail: "hello@example.org",
    phone: "(555) 123-4567",
    // Set this to your live, public-facing URL (no trailing slash) so the
    // thank-you page's share links point at the right place when shared
    // from a custom domain. Leave undefined to fall back to the browser's
    // current origin + BASE_URL.
    siteUrl: undefined,
  },

  paypal: {
    hostedButtonId: "REPLACE_WITH_YOUR_BUTTON_ID",
    flowMode: "newTab",
  },

  amounts: {
    oneTime: [
      { amount: 25, impactLabel: "Stocks a family's pantry for a week" },
      { amount: 50, impactLabel: "Funds one after-school session", default: true },
      { amount: 100, impactLabel: "Provides emergency rent assistance" },
      { amount: 250, impactLabel: "Sponsors a child for a month" },
      { amount: 500, impactLabel: "Supports a delivery route" },
    ],
    monthly: [
      { amount: 10, impactLabel: "Joins our monthly giving circle" },
      { amount: 20, impactLabel: "Sustains a weekly meal program", default: true },
      { amount: 35, impactLabel: "Supports an after-school student" },
      { amount: 50, impactLabel: "Funds ongoing family services" },
      { amount: 100, impactLabel: "Builds long-term community impact" },
    ],
  },

  branding: {
    colors: {
      // Warm, trustworthy teal + golden amber accent.
      primary: "176 64% 26%",
      primaryForeground: "40 40% 98%",
      accent: "32 92% 52%",
      accentForeground: "30 60% 12%",
      surface: "40 40% 99%",
      surfaceMuted: "40 30% 96%",
      text: "200 22% 12%",
      textMuted: "200 12% 38%",
      border: "200 16% 88%",
    },
    logoPath: "/logo.svg",
    heroImagePath: "/hero.webp",
    supportingImagePaths: [],
  },

  typography: {
    headingFamily: `"Inter", system-ui, -apple-system, sans-serif`,
    bodyFamily: `"Inter", system-ui, -apple-system, sans-serif`,
  },

  copy: {
    landing: {
      eyebrow: "Help our neighbors today",
      headline: "Help a local family put food on the table this week.",
      subhead:
        "Your gift funds groceries, after-school care, and rent assistance for families in our community — managed by a team of neighbors you know.",
      caseForSupport: [
        "More than 1 in 8 families in our region report food insecurity each month.",
        "Your gift funds emergency groceries, after-school meals, and short-term rent assistance.",
        "100% of public donations go directly to community programs — operating costs are covered by a private endowment.",
        "Give today and a family in our community gets help this week.",
      ],
      donationModuleNote:
        "Secure payment via PayPal — pay with PayPal, Venmo, or any major credit card on the next screen.",
      donationModule: {
        heading: "Make your gift",
        subhead: "100% secure. Tax-deductible. Cancel anytime.",
        amountLegend: "Choose an amount",
        customLabel: "Or enter a custom amount",
        customPlaceholder: "Other amount",
        oneTimeLabel: "One-time",
        monthlyLabel: "Monthly",
        defaultCtaLabel: "Donate now",
        trustItems: [
          { icon: "lock", label: "Secure payment" },
          { icon: "shield", label: "Tax-deductible" },
          { icon: "receipt", label: "Receipt emailed" },
          { icon: "refresh", label: "Cancel anytime", href: "/refund-policy" },
        ],
      },
      trustStrip: [
        {
          icon: "lock",
          title: "Bank-grade security",
          body: "Payments processed by PayPal — we never see your card.",
        },
        {
          icon: "award",
          title: "Transparent stewardship",
          body: "— audited annually.",
          linkHref: "/transparency",
          linkLabel: "Read our financials",
        },
      ],
      // Optional charity-rating badges (Charity Navigator, Candid/GuideStar,
      // BBB Wise Giving, etc.). Leave the array empty to hide the slot
      // entirely. Each item is rendered as a small linked badge in the
      // trust strip area beneath the hero.
      charityRatings: [],
      impactProofHeader: {
        eyebrow: "The numbers behind your gift",
        headline: "Real help, measured honestly.",
      },
      faqHeader: {
        eyebrow: "Donor FAQ",
        headline: "Questions donors ask us most.",
      },
      finalCta: {
        headline: "Ready to help a neighbor today?",
        body: "Your gift goes to work in our community this week.",
        ctaLabel: "Make my gift",
      },
      testimonial: {
        quote:
          "I gave once after a hard month and they delivered groceries the next morning. Now I give every month.",
        author: "Maria T.",
        role: "Springfield resident & monthly donor",
      },
      impactProof: [
        { value: "12,400", label: "Meals delivered last year", context: "to families in our service area" },
        { value: "320", label: "Families directly served", context: "in the past 12 months" },
        { value: "94¢", label: "Of every dollar to programs", context: "audited annually" },
      ],
      storyBlock: {
        eyebrow: "A neighbor's story",
        headline: "When the Alvarez family lost their income, the community showed up.",
        body: [
          "After a sudden layoff, the Alvarez family used our emergency grocery program for three months while they got back on their feet.",
          "Today, they're regular volunteers in our Saturday delivery program — packing boxes for the next family who needs help.",
          "Stories like theirs are why your gift matters. You're not just funding a program. You're keeping a neighbor stable.",
        ],
        imagePath: "/story.webp",
        imageAlt: "A family unpacking a community grocery delivery in their kitchen.",
        link: { label: "Read more impact stories", href: "/impact" },
      },
      giftImpact: {
        eyebrow: "What your gift does",
        headline: "Real impact, anchored in real numbers.",
        subhead:
          "We tie every suggested amount to a concrete outcome we can deliver in our community this month.",
      },
      secondaryGiving: {
        eyebrow: "Other ways to help",
        headline: "Not ready to give today? Here are more ways to make a difference.",
        cards: [
          {
            title: "Give monthly",
            body:
              "Join our giving circle and provide steady, predictable support to families year-round.",
            ctaLabel: "Start monthly gift",
            href: "#donate",
          },
          {
            title: "Employer match",
            body:
              "Many employers will match your gift dollar-for-dollar. Ask us how to set it up.",
            ctaLabel: "Email us",
            href: "/contact",
          },
          {
            title: "Donate in honor",
            body:
              "Make a tribute gift in honor or memory of someone special. We'll send a card on your behalf.",
            ctaLabel: "Get in touch",
            href: "/contact",
          },
          {
            title: "Share this page",
            body:
              "The fastest way to multiply your gift: tell one friend to give too. It only takes a tap.",
            ctaLabel: "Share now",
            href: "/",
            action: "share",
          },
        ],
      },
      faqs: [
        {
          question: "Where exactly does my money go?",
          answer:
            "Public donations fund three programs: emergency groceries, after-school care, and short-term rent assistance. Operating costs are covered separately by a private endowment, so 100% of your public gift reaches programs. See our Impact and Transparency pages for the year-over-year breakdown.",
        },
        {
          question: "Is my donation tax-deductible?",
          answer:
            "Yes. Brightwell Community Fund is a registered 501(c)(3) nonprofit (EIN 00-0000000). Your gift is tax-deductible in the U.S. to the full extent allowed by law.",
        },
        {
          question: "Will I get a receipt?",
          answer:
            "Yes — PayPal emails you an itemized receipt the moment your donation processes. You can also forward us your PayPal confirmation any time and we'll re-send a formal acknowledgment letter for your tax records.",
        },
        {
          question: "Can I cancel or change my monthly gift?",
          answer:
            "Yes, anytime. You can pause, change the amount, or cancel a recurring gift directly from your PayPal account in two clicks — or email us and we'll take care of it for you the same day.",
        },
        {
          question: "Is my payment secure?",
          answer:
            "Yes. Donations are processed by PayPal using bank-grade encryption. We never see or store your card details on our servers.",
        },
        {
          question:
            "Can I give by stock, donor-advised fund (DAF), check, or another way?",
          answer:
            "Absolutely — we accept gifts of stock, DAF grants, mailed checks, IRA qualified charitable distributions, employer matching gifts, and tribute gifts in honor/memory. Visit our Contact page and we'll walk you through the right paperwork for your situation.",
        },
        {
          question: "Can I give in honor or memory of someone?",
          answer:
            "Yes. Add a note when you donate or contact us directly, and we'll send a written acknowledgment to the honoree's family on your behalf.",
        },
      ],
    },
    thankYou: {
      headline: "Thank you, friend.",
      body:
        "Your gift will help a family in our community this week — groceries on the table, kids cared for after school, rent kept current. None of that happens without donors like you.",
      receiptNote:
        "If your gift went through, PayPal will email you an itemized receipt within a few minutes. Check your spam folder if you don't see it — or contact us and we'll resend it.",
      shareText:
        "I just gave to Brightwell Community Fund — they help local families with food, housing, and after-school care. Join me:",
      // Set to a YouTube embed URL (https://www.youtube.com/embed/XYZ), a
      // Vimeo embed URL, or a direct /video.mp4 path to surface a thank-you
      // video at the top of the page. Leave undefined to hide the slot.
      videoUrl: undefined,
      monthlyUpgrade: {
        eyebrow: "Make it ongoing",
        headline: "Turn your gift into steady support",
        body:
          "A small monthly gift gives our team predictable funding to keep families stable year-round — not just in a crisis. You can change or cancel any time.",
        ctaLabel: "Start a monthly gift",
      },
      // Optional employer-match prompt. Most U.S. employers will match
      // charitable gifts at 1:1 (some at 2:1 or 3:1). Set `href` to a
      // public matching-gift lookup tool (Double the Donation, etc.) or
      // to your own /contact page. Delete this block to hide the card.
      employerMatch: {
        eyebrow: "Double your impact",
        headline: "Does your employer match donations?",
        body:
          "Many employers will match charitable gifts dollar-for-dollar — sometimes 2x or 3x. It usually takes 5 minutes and can double what you just gave.",
        ctaLabel: "Check with your employer",
        href: "/contact",
      },
      impactReminder: {
        eyebrow: "What your gift does",
        headline: "Here's what you just made possible",
        // Hand-picked tiers (typically the most impactful 1–2 from the
        // landing page); omit to fall back to amounts.oneTime[0..1].
        tiers: [
          { amount: 50, impactLabel: "Funds one after-school session" },
          { amount: 100, impactLabel: "Provides emergency rent assistance" },
        ],
      },
      whatHappensNext: {
        eyebrow: "What happens next",
        headline: "Here's what you can expect from us",
        steps: [
          {
            title: "Receipt in your inbox",
            body:
              "PayPal has already emailed you an itemized receipt for your tax records.",
          },
          {
            title: "Your gift goes to work this week",
            body:
              "Public donations fund three programs: emergency groceries, after-school care, and short-term rent assistance.",
          },
          {
            title: "You'll hear from us",
            body:
              "We'll send one short impact update next month — never spam, easy to unsubscribe.",
          },
        ],
      },
      newsletter: {
        eyebrow: "Stay close to the work",
        headline: "Get one short update a month",
        body:
          "Real stories from the families your donations support — no spam, no ask, just a window into the community you're helping.",
        emailPlaceholder: "you@example.com",
        ctaLabel: "Subscribe",
      },
      socialFollow: {
        eyebrow: "Follow along",
        headline: "Catch the stories between donations",
        body:
          "We post a behind-the-scenes story every week. Pick whichever platform you already check.",
      },
      share: {
        eyebrow: "Multiply your gift",
        headline: "Tell one friend you gave",
        body:
          "The fastest way to grow what you just did: invite one person to give too.",
        nativeCtaLabel: "Share via…",
      },
    },
    about: {
      eyebrow: "About us",
      headline: "We're neighbors helping neighbors.",
      subhead:
        "A small, local nonprofit putting every dollar to work for the families in our community — with the receipts to prove it.",
      // Cloners: drop a real photo at /public/about-hero.jpg (or any path
      // under /public) and update `src` here. Leave the whole `image` block
      // out and the page renders a tasteful brand-colored placeholder.
      image: {
        src: undefined,
        alt: "Brightwell volunteers loading grocery boxes for delivery",
      },
      story: [
        "Brightwell Community Fund was founded in 2014 by a group of local parents and small-business owners who wanted to make sure no family in our town went hungry.",
        "Today we partner with schools, food pantries, and faith communities to deliver direct support to the families who need it most — quickly, respectfully, and without red tape.",
        "Every dollar you give is stewarded by a board of community volunteers, audited annually, and reported transparently to our donors. We exist to serve our neighbors — not to grow an institution.",
      ],
      values: {
        eyebrow: "What we believe",
        headline: "How we show up for our neighbors",
        subhead:
          "These four commitments shape every program, every dollar, and every decision we make.",
        items: [
          {
            icon: "heart",
            title: "Dignity first",
            body: "We treat the families we serve the way we'd want our own families treated — with privacy, respect, and zero judgment.",
          },
          {
            icon: "shield",
            title: "Radical transparency",
            body: "We publish our financials, board minutes, and program outcomes every year. If you can't trust where the money goes, nothing else matters.",
          },
          {
            icon: "users",
            title: "Local roots",
            body: "Every dollar stays in our community. Our staff, board, and volunteers all live here — we're funding our own neighbors.",
          },
          {
            icon: "target",
            title: "Outcomes over optics",
            body: "We measure what matters: meals delivered, rent kept current, kids safely cared for after school. Not press releases.",
          },
        ],
      },
      // Cloners: leave `team` undefined to hide the section entirely.
      // Drop member photos at /public/team/<name>.jpg or any path you
      // prefer; if the photo is missing we fall back to an initials chip.
      team: {
        eyebrow: "The team",
        headline: "Small on purpose",
        body:
          "Five staff members, fifteen board members, and over two hundred active volunteers. We keep the team lean so more of every gift reaches the families we serve.",
        members: [
          {
            name: "Maria Alvarez",
            role: "Executive Director",
            bio: "Former social worker. Founded Brightwell in 2014.",
          },
          {
            name: "Devon Carter",
            role: "Programs Director",
            bio: "Runs our food, housing, and after-school programs.",
          },
          {
            name: "Priya Shah",
            role: "Board Chair",
            bio: "Local pediatrician. Volunteer board chair since 2019.",
          },
          {
            name: "James O'Connor",
            role: "Treasurer",
            bio: "CPA. Keeps our books open and audited.",
          },
        ],
      },
      closingCta: {
        eyebrow: "Ready to help?",
        headline: "Join the neighbors making this work possible",
        body:
          "Every gift — one-time or monthly — goes directly to the families in our community who need it most.",
        ctaLabel: "Donate now",
      },
    },
    impact: {
      hero: {
        eyebrow: "Our impact",
        headline: "Where your money actually goes.",
        subhead:
          "We publish our numbers every year because trust is built on transparency, not promises. Here's exactly what your gift funds — and the families it helps.",
        supportingMetric: {
          value: "94¢",
          label: "of every dollar funds programs",
          context: "Independently audited, every year.",
        },
      },
      metrics: [
        { value: "12,400", label: "Meals delivered last year" },
        { value: "320", label: "Families directly served" },
        { value: "94¢", label: "Of every dollar to programs" },
        { value: "10", label: "Years serving the community" },
      ],
      programs: {
        eyebrow: "Our programs",
        headline: "Three programs. Real outcomes.",
        subhead:
          "We keep our scope narrow on purpose so we can measure what we deliver — and tell you about it honestly.",
        items: [
          {
            name: "Emergency groceries",
            summary:
              "Same-week grocery delivery for families navigating a layoff, illness, or housing transition.",
            icon: "utensils",
            outcomes: [
              { value: "12,400", label: "Meals delivered" },
              { value: "210", label: "Families served" },
            ],
          },
          {
            name: "After-school care",
            summary:
              "Healthy snacks, homework help, and a safe place to land for kids whose parents work afternoons.",
            icon: "graduationCap",
            outcomes: [
              { value: "60", label: "Kids served daily" },
              { value: "5", label: "School partners" },
            ],
          },
          {
            name: "Short-term rent assistance",
            summary:
              "Emergency rent grants to help neighbors stay housed during a temporary income shock.",
            icon: "home",
            outcomes: [
              { value: "48", label: "Evictions prevented" },
              { value: "$92K", label: "Rent assistance" },
            ],
          },
        ],
      },
      moneyGoes: {
        eyebrow: "Where every dollar goes",
        headline: "94¢ of every dollar funds programs.",
        subhead:
          "Operating costs are covered by a private endowment, so your gift goes almost entirely to community programs.",
        // Cloners: tweak these to match your most recent audited Form 990
        // breakdown. Round to whole percent — donors don't need decimals.
        breakdown: [
          { label: "Programs", percent: 94, tone: "primary" },
          { label: "Operations", percent: 4, tone: "muted" },
          { label: "Fundraising", percent: 2, tone: "accent" },
        ],
        note:
          "Independently audited every year. We also publish our IRS Form 990 in full.",
        transparencyLink: {
          label: "See the full annual report",
          href: "/transparency",
        },
      },
      beneficiary: {
        eyebrow: "A neighbor's story",
        headline: "When the Alvarez family lost their income, the community showed up.",
        body: [
          "After a sudden layoff in early 2024, the Alvarez family used our emergency grocery program for three months while they got back on their feet — no paperwork, no questions, just groceries on the porch every Tuesday.",
          "Today, they're some of our most active volunteers. Maria packs boxes on Saturday mornings; Carlos drives a delivery route. Their kids help bag produce.",
          "This is what your gift makes possible: not just a one-time hand, but a community where neighbors take care of each other in both directions.",
        ],
        quote:
          "Brightwell didn't just feed us when we needed it. They gave us a way to give back when we got back on our feet. That's the difference.",
        attribution: "Maria Alvarez",
        role: "Springfield resident & volunteer",
        // Cloners: drop a real photo at /public/beneficiary.webp (or any
        // path under /public). Leave imagePath undefined to render a
        // tasteful brand-colored placeholder.
        imagePath: undefined,
        imageAlt:
          "The Alvarez family loading grocery boxes into a community delivery van.",
      },
      tierRecap: {
        eyebrow: "Pick the impact you want to fund",
        headline: "Your gift, your outcome.",
        subhead:
          "Click any tier below — we'll take you straight to the donation form with that amount already selected.",
      },
      closingCta: {
        eyebrow: "Ready to help?",
        headline: "Turn this impact into action.",
        body:
          "Every gift — one-time or monthly — funds the programs above. 100% of your public donation reaches the families we serve.",
        ctaLabel: "Donate now",
      },
    },
    transparency: {
      hero: {
        eyebrow: "Built for trust",
        headline: "Open books, real receipts.",
        subhead:
          "We publish our financials, ratings, governance, and donor commitments in one place. If a question isn't answered here, email us — we pick up the phone.",
      },
      orgSnapshot: {
        eyebrow: "Org snapshot",
        headline: "Who we are, on paper.",
        statusValue: "501(c)(3) public charity",
        statusLine:
          "Brightwell Community Fund is a registered 501(c)(3) public charity. Donations are tax-deductible in the U.S. to the full extent allowed by law.",
      },
      financials: {
        eyebrow: "Financials",
        headline: "Where every dollar went.",
        subhead:
          "Our most recent audited fiscal year. Operating costs are covered separately by a private endowment, so 100% of public donations reach programs.",
        fiscalYear: 2024,
        // Cloners: replace these with totals from your most recent audited
        // 990. Percentages are whole numbers (0–100). Empty array hides the
        // breakdown and shows `emptyState` instead.
        lines: [
          {
            label: "Total revenue",
            value: "$1,284,000",
            context: "Audited March 2025",
          },
          { label: "Programs", value: "$1,156,000", percent: 90 },
          { label: "Administration", value: "$77,000", percent: 6 },
          { label: "Fundraising", value: "$51,000", percent: 4 },
        ],
        note:
          "Numbers reflect the audited fiscal year ending December 2024. The full audit and Form 990 are linked below.",
        emptyState:
          "We'll publish our most recent audited financials here as soon as they're available.",
      },
      filings: {
        eyebrow: "Reports & filings",
        headline: "Read the source documents.",
        subhead:
          "Annual report, IRS Form 990, and audited financial statements — straight from the filings we send to the IRS and our board.",
        items: [
          { label: "Annual report", url: "#", year: 2024 },
          { label: "IRS Form 990", url: "#", year: 2023 },
          { label: "Audited financial statements", url: "#", year: 2023 },
          { label: "IRS Form 990", url: "#", year: 2022 },
        ],
        emptyState:
          "Cloner: add at least one filing here so donors can see your most recent annual report or 990.",
      },
      ratings: {
        eyebrow: "Independent ratings",
        headline: "Verified by people who watch nonprofits for a living.",
        subhead:
          "We're proud to be evaluated by independent charity rating organizations. Click any badge to view our public profile.",
        items: [
          {
            org: "Candid (GuideStar)",
            label: "Platinum Seal of Transparency 2025",
            url: "#",
          },
          {
            org: "Charity Navigator",
            label: "Four-Star Charity",
            url: "#",
          },
          {
            org: "BBB Wise Giving Alliance",
            label: "Accredited Charity",
            url: "#",
          },
        ],
      },
      governance: {
        eyebrow: "Governance",
        headline: "An independent board, accountable in public.",
        body: [
          "Brightwell is governed by a 9-member volunteer board of directors. Directors serve three-year terms, and no director receives compensation from the organization.",
          "The board meets quarterly, reviews audited financials annually, and approves the program budget every fiscal year. Conflicts of interest are disclosed in writing and recorded in board minutes.",
        ],
        boardRoster: {
          label: "View our board roster & leadership",
          href: "#",
          external: true,
        },
      },
      donorCommitments: {
        eyebrow: "Our promises to you",
        headline: "What you can count on as a donor.",
        subhead:
          "These commitments apply to every gift, whether it's $5 or $5,000.",
        items: [
          {
            icon: "lock",
            title: "Secure payment",
            body: "Every gift is processed through PayPal's encrypted donation system. We never see or store your card details.",
          },
          {
            icon: "receipt",
            title: "Immediate receipts",
            body: "You'll receive a tax-deductible receipt by email the moment your donation is processed — no waiting, no follow-up required.",
          },
          {
            icon: "ban",
            title: "We never sell donor data",
            body: "We don't sell, rent, or trade your name, email, or giving history. Ever.",
          },
          {
            icon: "refresh",
            title: "Cancel monthly anytime",
            body: "Monthly gifts can be paused, changed, or canceled in seconds — directly from your PayPal account or by emailing us.",
          },
          {
            icon: "shield",
            title: "Refunds & corrections",
            body: "Mistyped an amount? Charged twice? We'll fix it within two business days, no questions asked.",
            link: {
              label: "Read the full refund policy",
              href: "/refund-policy",
            },
          },
          {
            icon: "heart",
            title: "Your rights as a donor",
            body: "We follow the international Donor Bill of Rights — the published standard for ethical fundraising.",
            link: {
              label: "Read the Donor Bill of Rights",
              href: "/donor-bill-of-rights",
            },
          },
        ],
      },
      contactPointer: {
        eyebrow: "Still have questions?",
        headline: "Talk to a human.",
        body:
          "We read every message. If something on this page is unclear or you want to verify any number, reach out — we'll respond within two business days.",
        ctaLabel: "Contact us",
        ctaHref: "/contact",
      },
    },
    contact: {
      hero: {
        eyebrow: "We're here to help",
        headline: "Get in touch.",
        subhead:
          "Questions about your donation, our programs, or how to give in a different way? We read every message and respond within two business days — often within a few hours.",
      },
      methods: {
        eyebrow: "How to reach us",
        headline: "Pick whatever's easiest for you.",
        responseTime:
          "We respond to every message within two business days, often within a few hours.",
        emailLabel: "Email",
        phoneLabel: "Phone",
        addressLabel: "Mailing address",
      },
      reasons: {
        eyebrow: "Common reasons donors reach out",
        headline: "We can help with all of these.",
        subhead:
          "Pick a topic from the dropdown in the form below — or just write us in your own words.",
        items: [
          {
            id: "stock-daf",
            topic: "Donate stock or from a Donor-Advised Fund",
            body: "Want to give appreciated stock or recommend a grant from a DAF (Fidelity Charitable, Schwab, Vanguard, etc.)? We'll send you our brokerage details and grant-letter language.",
          },
          {
            id: "check",
            topic: "Donate by check",
            body: "Prefer to give by check? Mail it to the address above — we'll send you a confirmation receipt within five business days of receipt.",
          },
          {
            id: "crypto",
            topic: "Donate cryptocurrency",
            body: "We accept Bitcoin, Ethereum, and other major cryptocurrencies through The Giving Block. Email us and we'll send you the donation link.",
          },
          {
            id: "employer-match",
            topic: "Match your gift through your employer",
            body: "Thousands of employers will double or triple your donation. Send us your employer's matching-gift form and we'll handle the paperwork on our side.",
          },
          {
            id: "tribute",
            topic: "Make a tribute or memorial gift",
            body: "Honor someone special with a gift in their name. We'll send a thoughtful acknowledgment card to the recipient or family — just let us know who and where to send it.",
          },
          {
            id: "recurring",
            topic: "Pause, change, or cancel a monthly gift",
            body: "You can manage monthly gifts directly in your PayPal account, or email us and we'll take care of it within one business day.",
          },
          {
            id: "receipt",
            topic: "Receipt or tax-letter question",
            body: "Lost your receipt, need a year-end summary, or have a tax-deductibility question? Tell us your name and donation date — we'll resend a corrected receipt the same day.",
          },
          {
            id: "press",
            topic: "Press, partnership, or speaking inquiry",
            body: "Reporters, partners, and event organizers — please include your outlet or organization, deadline, and topic. Our communications lead will reply within one business day.",
          },
        ],
      },
      form: {
        eyebrow: "Send us a message",
        headline: "Tell us how we can help.",
        subhead:
          "Filling this out opens your email app with the message pre-filled. We don't store anything from this form.",
        nameLabel: "Your name",
        emailLabel: "Your email",
        subjectLabel: "Topic",
        generalSubjectLabel: "Other / general question",
        messageLabel: "Message",
        submitLabel: "Open my email app",
        successHeadline: "Your email is ready to send.",
        successBody:
          "We opened your email app with the message pre-filled. If nothing happened, your browser may have blocked the mailto link — click below to try again.",
        successCtaLabel: "Open the message again",
        errors: {
          nameRequired: "Please tell us your name so we know who to reply to.",
          emailRequired: "We need your email to send a reply.",
          emailInvalid: "That email address doesn't look quite right.",
          messageRequired:
            "Please write a short message so we know how to help.",
        },
      },
      embedSlot: {
        headline: "Have a real form? Drop it in here.",
        body:
          "By default this page uses a mailto form so it works without a backend. To collect submissions in a database, set `embedSlot.enabled = true` and replace this card with a Formspree, Tally, Typeform, or similar embed — search for the EMBED_SLOT comment in /src/pages/contact.tsx.",
        enabled: false,
      },
      hours: {
        eyebrow: "Office hours",
        headline: "When we're at our desks.",
        timezone: "All times Central Time (US)",
        items: [
          { day: "Monday – Friday", hours: "9:00 AM – 5:00 PM" },
          { day: "Saturday", hours: "By appointment" },
          { day: "Sunday", hours: "Closed" },
        ],
      },
    },

    legal: {
      disclaimer: {
        heading: "This is a starter template — not legal advice.",
        body:
          "These policies are a sensible starting point for a small US-based 501(c)(3), but every nonprofit's situation is different. Before you publish this site, have your own legal counsel review and tailor every legal page (privacy, terms, refund, donor bill of rights) to your jurisdiction, programs, and data practices.",
      },
      governingState: "Illinois",
      privacy: {
        title: "Privacy Policy",
        lastUpdated: "September 15, 2025",
        intro:
          "We respect your privacy. This policy explains what information we collect when you visit our site or make a donation, how we use it, who we share it with, and the choices you have. If anything here is unclear, please reach out — we're happy to walk through it with you.",
        sections: [
          {
            id: "scope",
            heading: "1. Scope of this policy",
            body: [
              "This Privacy Policy applies to information we collect through this website, our donation forms, our contact form, and any email lists you opt into. It does not cover information collected by third parties we link to (such as PayPal, the news outlets we cite, or social media platforms) — those services have their own privacy policies, which we encourage you to read.",
            ],
          },
          {
            id: "what-we-collect",
            heading: "2. Information we collect",
            body: [
              "We collect only the information we need to process your donation, respond to your message, and keep this site running. Specifically:",
            ],
            bullets: [
              "Donation information: When you donate, PayPal collects your name, billing address, email, and payment details. PayPal shares your name, email, and donation amount with us so we can send a receipt and acknowledge your gift. We do not see or store your full payment card or bank details.",
              "Contact form submissions: If you write to us through the contact form, the form opens your own email app — your message goes directly to us at the email address listed on the contact page. We don't store anything from the form itself.",
              "Email subscriptions: If you join our newsletter, we collect your name and email address. You can unsubscribe at any time using the link at the bottom of every email.",
              "Website analytics: We use privacy-respecting analytics to count visitors and understand which pages are most useful. This data is aggregated and does not identify you personally.",
            ],
          },
          {
            id: "how-we-use",
            heading: "3. How we use your information",
            body: [
              "We use the information we collect to process and acknowledge your donation, send you tax receipts and year-end summaries, respond to your questions, send the newsletter you signed up for, comply with our legal and reporting obligations as a 501(c)(3) public charity, and improve how this website serves donors and program participants.",
              "We will never use your information to make decisions about your eligibility for our programs. Donor records and program records are kept strictly separate.",
            ],
          },
          {
            id: "what-we-share",
            heading: "4. What we share — and what we never share",
            body: [
              "We share donor information only with the small set of service providers we need to operate, and only with what they need to do their job:",
            ],
            bullets: [
              "PayPal, our payment processor, to process your donation.",
              "Our email service provider (e.g. Mailchimp), to send receipts and our newsletter.",
              "Our accounting and audit firm, to prepare our IRS Form 990 and annual audit.",
              "Government agencies, when required by law (such as IRS reporting for large gifts).",
            ],
          },
          {
            id: "what-we-never-share",
            heading: "5. What we never share",
            body: [
              "We never sell, rent, lease, or trade donor information. We do not share your name or contact details with other nonprofits or fundraising lists. If we ever recognize donors publicly (in an annual report, for example), we ask permission first or use anonymized listings.",
            ],
          },
          {
            id: "cookies",
            heading: "6. Cookies & analytics",
            body: [
              "This site uses a small number of cookies to remember your preferences (such as accessibility settings) and to power our analytics. You can disable cookies in your browser at any time — the donation flow will still work, but some convenience features may not.",
              "If you'd prefer to opt out of analytics entirely, most browsers offer a \"Do Not Track\" or anti-tracking setting that we honor.",
            ],
          },
          {
            id: "retention",
            heading: "7. How long we keep information",
            body: [
              "We keep donor records for as long as required by US tax law and our auditors — typically seven years for financial records. Newsletter subscribers are kept on the list until they unsubscribe. Contact form messages are kept in our email archive for as long as we may need them to follow up.",
              "If you'd like us to delete your information sooner — for example, if you've unsubscribed and want your record removed — email us and we'll do so within 30 days, except where we're legally required to retain it.",
            ],
          },
          {
            id: "security",
            heading: "8. How we protect information",
            body: [
              "We take reasonable steps to protect the information we hold. Our website is served over HTTPS. Donor records are stored in access-controlled systems and reviewed periodically. We train our staff and volunteers on basic security hygiene.",
              "No system is perfectly secure, however. If we ever discover a breach affecting your personal information, we will notify you and the appropriate authorities promptly, as required by law.",
            ],
          },
          {
            id: "your-rights",
            heading: "9. Your rights as a donor",
            body: [
              "You have the right to know what personal information we hold about you, to correct it if it's wrong, to request that we delete it (subject to our legal record-keeping obligations), to opt out of any communications you've signed up for, and to request a copy of your donation history at any time.",
              "To exercise any of these rights, email us — we'll respond within 30 days. We may need to verify your identity before sharing or changing records, to protect you from impersonation.",
            ],
          },
          {
            id: "children",
            heading: "10. Children's privacy",
            body: [
              "Our website and programs are intended for adults. We do not knowingly collect personal information from children under 13. If you believe a child has submitted information to us, please contact us and we will delete it promptly.",
            ],
          },
          {
            id: "international",
            heading: "11. International donors",
            body: [
              "We are based in the United States and our website is hosted in the United States. If you donate or contact us from outside the US, your information will be transferred to and processed in the US, which may have different privacy protections than your home country. By using this site, you consent to that transfer.",
              "If you're a resident of the EU, UK, or another jurisdiction with specific privacy laws (GDPR, UK GDPR, etc.), you may have additional rights — please email us and we'll work with you to honor them.",
            ],
          },
          {
            id: "changes",
            heading: "12. Changes to this policy",
            body: [
              "We may update this policy from time to time as our practices evolve or as the law requires. When we do, we will update the \"Last updated\" date at the top of the page. For material changes, we will also post a notice on the homepage and (where we have your email) email subscribers and recent donors.",
            ],
          },
          {
            id: "contact",
            heading: "13. How to contact us",
            body: [
              "If you have any questions about this policy or about how we handle your information, please reach out — we're real people and we'd rather over-explain than leave you guessing.",
            ],
          },
        ],
      },
      terms: {
        title: "Terms of Use",
        lastUpdated: "September 15, 2025",
        intro:
          "These Terms of Use govern your access to and use of this website. By visiting the site or making a donation, you agree to these Terms. They are written in plain language wherever possible — if anything is unclear, email {contactEmail} and we'll walk through it with you.",
        sections: [
          {
            id: "acceptance",
            heading: "1. Acceptance of these Terms",
            body: [
              "By accessing this website, browsing its pages, submitting the contact form, subscribing to our newsletter, or making a donation, you confirm that you have read these Terms and agree to be bound by them. If you do not agree, please do not use the site.",
            ],
          },
          {
            id: "eligibility",
            heading: "2. Eligibility",
            body: [
              "You must be at least 18 years old, or have the consent of a parent or legal guardian, to use this site or make a donation. By using the site you represent that you meet this requirement.",
            ],
          },
          {
            id: "license",
            heading: "3. License to use the site",
            body: [
              "We grant you a limited, personal, non-exclusive, non-transferable, revocable license to access and use this website for personal, non-commercial purposes such as learning about our work, donating, or contacting us. All other uses require our prior written permission.",
            ],
          },
          {
            id: "prohibited-conduct",
            heading: "4. Prohibited conduct",
            body: [
              "When you use this site, you agree not to:",
            ],
            bullets: [
              "Use the site for any unlawful purpose, or in violation of any applicable law or regulation.",
              "Attempt to gain unauthorized access to any part of the site, our servers, or any connected systems.",
              "Interfere with the site's operation, including by introducing malware, denial-of-service attacks, or excessive automated requests.",
              "Scrape, crawl, or harvest content or donor information from the site without our express written permission.",
              "Impersonate {orgName}, our staff, our donors, or any other person or organization.",
              "Submit fraudulent donations, chargebacks made in bad faith, or payment information that is not yours to use.",
            ],
          },
          {
            id: "intellectual-property",
            heading: "5. Intellectual property",
            body: [
              "Unless otherwise noted, all content on this site — including text, graphics, logos, photographs, illustrations, and program names — is owned by {orgName} or licensed to us, and is protected by US and international copyright, trademark, and other laws.",
              "You may share short excerpts and link to our pages for non-commercial educational and journalistic use, with attribution. You may not reproduce, republish, or repurpose substantial portions of our content, or use our name or logo to suggest endorsement, without our prior written consent.",
            ],
          },
          {
            id: "user-content",
            heading: "6. Content you submit",
            body: [
              "If you submit information to us through the contact form, by email, or otherwise (a \"Submission\"), you grant us a non-exclusive, worldwide, royalty-free license to use, store, and reference that Submission for the purpose of responding to you, operating our programs, and complying with our legal obligations.",
              "You agree that your Submissions will not contain content that is unlawful, defamatory, infringing, or that you do not have permission to share. We may remove or refuse to act on Submissions at our discretion.",
            ],
          },
          {
            id: "donations",
            heading: "7. Donations and PayPal",
            body: [
              "All donations made through this site are processed by PayPal, an independent third-party payment processor. We do not see, store, or process your full payment card or bank account details — only the donor information PayPal forwards to us (typically your name, email, and donation amount).",
              "By donating, you also agree to PayPal's own terms of service and privacy policy. We are not responsible for PayPal's services, fees, or downtime. For information about refunds and corrections, see our Refund / Correction Policy.",
            ],
            links: [
              {
                label: "PayPal User Agreement",
                href: "https://www.paypal.com/us/legalhub/useragreement-full",
                external: true,
              },
              {
                label: "PayPal Privacy Statement",
                href: "https://www.paypal.com/us/legalhub/privacy-full",
                external: true,
              },
              { label: "Our Refund / Correction Policy", href: "/refund-policy" },
            ],
          },
          {
            id: "third-party-links",
            heading: "8. Third-party links",
            body: [
              "This site may link to websites, services, or content operated by third parties — for example, news articles about our work, our PayPal donation page, or social media profiles. We do not control, endorse, or assume responsibility for any third-party content. Following a link to a third-party site is at your own risk and subject to that site's own terms.",
            ],
          },
          {
            id: "warranties",
            heading: "9. Disclaimer of warranties",
            body: [
              "This site is provided on an \"as is\" and \"as available\" basis. To the fullest extent permitted by law, {orgName} disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, non-infringement, and uninterrupted or error-free operation.",
              "We do not warrant that the site will always be available, that the information on it will always be accurate or current, or that the site will be free from viruses or other harmful components. Use the site at your own risk.",
            ],
          },
          {
            id: "liability",
            heading: "10. Limitation of liability",
            body: [
              "To the fullest extent permitted by law, {orgName}, its directors, officers, employees, volunteers, and agents will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of (or inability to use) this site, including loss of data, loss of donations, or loss of goodwill, even if we have been advised of the possibility of such damages.",
              "Because we do not sell goods or services on this site, our total cumulative liability to you for any claim arising from your use of the site is limited to the greater of (a) one hundred US dollars (US$100) and (b) the amount you donated through the site in the twelve months preceding the claim.",
            ],
          },
          {
            id: "indemnification",
            heading: "11. Indemnification",
            body: [
              "You agree to indemnify and hold harmless {orgName} and its directors, officers, employees, volunteers, and agents from any claim, demand, loss, or damages — including reasonable attorneys' fees — arising out of or related to your breach of these Terms, your misuse of the site, or your violation of any law or third-party right.",
            ],
          },
          {
            id: "governing-law",
            heading: "12. Governing law and jurisdiction",
            body: [
              "These Terms are governed by the laws of the State of {state}, without regard to its conflict-of-laws principles. You agree that any dispute arising out of or relating to these Terms or your use of this site will be resolved exclusively in the state or federal courts located in {state}, and you consent to the personal jurisdiction of those courts.",
            ],
          },
          {
            id: "changes",
            heading: "13. Changes to these Terms",
            body: [
              "We may update these Terms from time to time. When we do, we will revise the \"Last updated\" date at the top of this page. For material changes, we will also post a notice on the homepage. Your continued use of the site after changes take effect constitutes your acceptance of the updated Terms.",
            ],
          },
          {
            id: "contact",
            heading: "14. How to contact us",
            body: [
              "If you have any questions about these Terms, please reach out — we'd rather answer a question now than have you guess.",
            ],
          },
        ],
      },
      refundPolicy: {
        title: "Refund & Correction Policy",
        lastUpdated: "September 15, 2025",
        intro:
          "Mistakes happen — wrong amount, duplicate charge, accidental recurring gift, or a card you no longer want to use. This policy explains how {orgName} handles refund and correction requests so you always know exactly what to expect. If you ever need help, email {contactEmail} and a real person will get back to you.",
        sections: [
          {
            id: "commitment",
            heading: "1. Our commitment",
            body: [
              "We treat every donation as a gift of trust. If something goes wrong with your donation — for any reason — we will work with you in good faith to make it right. We would much rather refund a mistaken gift than keep a donor who feels their concern was ignored.",
              "Our goal is to respond to every refund or correction request within two US business days, and to resolve straightforward requests within five business days of receiving the necessary information.",
            ],
          },
          {
            id: "request-correction",
            heading: "2. How to request a correction",
            body: [
              "Most corrections — wrong amount, duplicate gift, fraudulent charge, accidental recurring sign-up — can be handled by emailing us. To help us process your request quickly, please include the following information when you write to us:",
            ],
            bullets: [
              "Your full name and the email address you used when you donated.",
              "The donation amount and the approximate date of the gift.",
              "Your PayPal transaction ID or confirmation number, if you have it.",
              "A short description of what went wrong (for example: \"I meant to donate $25 but entered $250\" or \"I was charged twice for the same monthly gift\").",
            ],
            links: [
              { label: "Email a refund request", href: "mailto:{contactEmail}?subject=Refund%20request" },
            ],
          },
          {
            id: "cancel-monthly",
            heading: "3. How to cancel a monthly gift",
            body: [
              "All monthly donations to {orgName} are managed by PayPal, which means you can change or cancel them at any time directly from your own PayPal account — no need to contact us first. PayPal calls these arrangements \"automatic payments\" or \"pre-approved payments.\"",
              "From a desktop browser, log in to your PayPal account, open Settings, choose Payments, and then \"Manage automatic payments.\" Find {orgName} in the list and click Cancel. The cancellation takes effect immediately; you will not be charged again.",
              "If you would prefer that we handle the cancellation for you, email {contactEmail} with the subject line \"Cancel monthly\" and we will confirm cancellation in writing within two business days.",
            ],
            links: [
              {
                label: "Manage your PayPal automatic payments",
                href: "https://www.paypal.com/myaccount/autopay/",
                external: true,
              },
              {
                label: "PayPal: Cancel a recurring payment (help article)",
                href: "https://www.paypal.com/us/cshelp/article/how-do-i-cancel-an-automatic-payment-or-recurring-payment-help193",
                external: true,
              },
            ],
          },
          {
            id: "eligibility",
            heading: "4. Refund eligibility & timeline",
            body: [
              "We will refund any donation in the following situations: the amount was incorrect, you were charged more than once for the same intended gift, the donation was unauthorized or fraudulent, your monthly gift continued past the date you intended to cancel, or you simply changed your mind within 30 days of giving.",
              "Refunds beyond 30 days are evaluated on a case-by-case basis. We will always consider them in good faith, especially for unauthorized charges or hardship.",
              "Once approved, refunds are issued back to the original payment method through PayPal. Most donors see the refund post within 3–5 business days, though depending on your bank or card issuer it can take up to 10 business days to appear on your statement.",
            ],
          },
          {
            id: "tax-receipts",
            heading: "5. Tax-receipt corrections",
            body: [
              "If we issue you a refund — full or partial — we will also send a corrected donation acknowledgment by email. The corrected acknowledgment supersedes the original receipt.",
              "Please do not claim a refunded donation as a charitable deduction on your tax return. If you have already filed your return for the year in which the gift was made, consult your tax advisor about whether you need to file an amended return. {orgName} cannot give tax advice; this is general information only.",
            ],
          },
          {
            id: "chargebacks",
            heading: "6. Chargebacks and disputes",
            body: [
              "If you do not recognize a charge from {orgName} on your statement, please email us before filing a chargeback with your bank or card issuer. Most \"unrecognized\" charges turn out to be a one-time gift made under a different name, a monthly gift you set up some time ago, or a gift from a family member — and we can usually clear it up the same day.",
              "Chargebacks cost us a fee on top of the refunded amount and take weeks to resolve. Reaching out to us first is faster for you and protects donor dollars.",
            ],
          },
          {
            id: "contact",
            heading: "7. How to reach us about refunds",
            body: [
              "If you need a refund, a correction, or just have a question about a donation, please contact us — we want to help.",
            ],
          },
        ],
      },
    },
  },

  social: {
    facebook: "https://facebook.com/example",
    instagram: "https://instagram.com/example",
    linkedin: "https://linkedin.com/company/example",
  },

  features: {
    showMonthlyUpsell: true,
    showShare: true,
    showStickyMobileCta: true,
  },
};

export default site;
