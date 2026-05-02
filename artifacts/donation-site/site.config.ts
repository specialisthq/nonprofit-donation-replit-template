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
  trustItems: { icon: "lock" | "shield" | "receipt" | "refresh"; label: string }[];
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
      headline: string;
      story: string[];
      teamNote?: string;
    };
    impact: {
      headline: string;
      subhead: string;
      metrics: ImpactMetric[];
      stories: { title: string; body: string }[];
    };
    transparency: {
      headline: string;
      financialsNote: string;
      annualReportUrl?: string;
      form990Url?: string;
      ratings?: { name: string; url: string }[];
    };
    contact: {
      headline: string;
      intro: string;
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
          { icon: "refresh", label: "Cancel anytime" },
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
      headline: "We're neighbors helping neighbors.",
      story: [
        "Brightwell Community Fund was founded in 2014 by a group of local parents and small-business owners who wanted to make sure no family in our town went hungry.",
        "Today we partner with schools, food pantries, and faith communities to deliver direct support to the families who need it most — quickly, respectfully, and without red tape.",
        "Every dollar you give is stewarded by a board of community volunteers, audited annually, and reported transparently to our donors.",
      ],
      teamNote:
        "Our team is small on purpose: five staff members, fifteen board members, and over two hundred active volunteers.",
    },
    impact: {
      headline: "Real help, measured honestly.",
      subhead:
        "We publish our numbers every year because trust is built on transparency, not promises.",
      metrics: [
        { value: "12,400", label: "Meals delivered last year" },
        { value: "320", label: "Families served" },
        { value: "94¢", label: "Of every dollar to programs" },
        { value: "10", label: "Years serving the community" },
      ],
      stories: [
        {
          title: "The Alvarez family",
          body: "After a sudden layoff, the Alvarez family used our emergency grocery program for three months while they got back on their feet. Today they're regular volunteers in our Saturday delivery program.",
        },
        {
          title: "Lincoln Elementary after-school",
          body: "Our partnership with Lincoln Elementary funds healthy snacks and homework help for 60 kids every weekday afternoon — at no cost to families.",
        },
      ],
    },
    transparency: {
      headline: "Where your money goes.",
      financialsNote:
        "We publish our audited financial statements and IRS Form 990 every year. We're proud to be evaluated by independent charity rating organizations.",
      annualReportUrl: "#",
      form990Url: "#",
      ratings: [
        { name: "Candid (GuideStar)", url: "#" },
        { name: "Charity Navigator", url: "#" },
      ],
    },
    contact: {
      headline: "Get in touch.",
      intro:
        "Questions about your donation, our programs, or how to get involved? We read every message.",
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
