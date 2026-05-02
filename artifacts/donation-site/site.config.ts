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
      faqs: FaqItem[];
    };
    thankYou: {
      headline: string;
      body: string;
      shareText: string;
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
    heroImagePath: "/hero.jpg",
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
      faqs: [
        {
          question: "Is my donation tax-deductible?",
          answer:
            "Yes. Brightwell Community Fund is a registered 501(c)(3) nonprofit (EIN 00-0000000). Your gift is tax-deductible to the full extent allowed by law, and you'll receive an emailed receipt immediately.",
        },
        {
          question: "How is my gift used?",
          answer:
            "Public donations fund three programs: emergency groceries, after-school care, and short-term rent assistance. Operating costs are covered separately by a private endowment, so 100% of your gift reaches programs.",
        },
        {
          question: "Can I cancel my monthly gift?",
          answer:
            "Yes — anytime. You can manage or cancel your recurring gift directly from your PayPal account, or email us and we'll take care of it for you.",
        },
        {
          question: "Is my payment secure?",
          answer:
            "Yes. Donations are processed by PayPal using bank-grade encryption. We never see or store your card details.",
        },
        {
          question: "Can I give in honor or memory of someone?",
          answer:
            "Absolutely. Add a note when you donate, and we'll send an acknowledgment to the family on your behalf.",
        },
      ],
    },
    thankYou: {
      headline: "Thank you — your gift is on its way.",
      body: "Your donation will help a family in our community this week. A receipt is on its way to your inbox now.",
      shareText:
        "I just gave to Brightwell Community Fund — they help local families with food, housing, and after-school care. Join me:",
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
