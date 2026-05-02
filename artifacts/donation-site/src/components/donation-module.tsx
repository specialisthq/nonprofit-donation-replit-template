import { forwardRef, useMemo, type Ref } from "react";
import { ShieldCheck, Receipt, RefreshCw, Lock } from "lucide-react";
import site, { type SuggestedAmount } from "@config";
import { donateLinkProps } from "@/lib/paypal";
import { Card } from "@/components/primitives";
import { ButtonLink } from "@/components/button";
import { cn } from "@/lib/utils";

export type DonationMode = "oneTime" | "monthly";

export type DonationModuleProps = {
  mode: DonationMode;
  amount: number | null;
  customAmount: string;
  onModeChange: (mode: DonationMode) => void;
  onAmountChange: (amount: number | null) => void;
  onCustomAmountChange: (value: string) => void;
  className?: string;
  /** Used as the stable id for cross-page anchors and aria-labelledby. */
  id?: string;
};

const TRUST_ICONS = {
  lock: Lock,
  shield: ShieldCheck,
  receipt: Receipt,
  refresh: RefreshCw,
} as const;

function parseCustomAmount(value: string): number | null {
  if (!value) return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}

export const DonationModule = forwardRef(function DonationModule(
  {
    mode,
    amount,
    customAmount,
    onModeChange,
    onAmountChange,
    onCustomAmountChange,
    className,
    id = "donate",
  }: DonationModuleProps,
  ref: Ref<HTMLDivElement>,
) {
  const copy = site.copy.landing.donationModule;
  const amounts: SuggestedAmount[] = site.amounts[mode];

  const effectiveAmount = useMemo(() => {
    const custom = parseCustomAmount(customAmount);
    if (custom != null) return custom;
    return amount ?? null;
  }, [amount, customAmount]);

  const formattedAmount = effectiveAmount
    ? `$${effectiveAmount.toLocaleString(undefined, {
        minimumFractionDigits: Number.isInteger(effectiveAmount) ? 0 : 2,
        maximumFractionDigits: 2,
      })}`
    : null;

  const ctaLabel = formattedAmount
    ? mode === "monthly"
      ? `Start my ${formattedAmount} monthly gift`
      : `Donate ${formattedAmount} now`
    : mode === "monthly"
      ? "Start my monthly gift"
      : copy.defaultCtaLabel;

  const linkProps = donateLinkProps({
    amount: effectiveAmount ?? undefined,
    recurring: mode === "monthly",
  });

  return (
    <Card
      ref={ref}
      id={id}
      className={cn("scroll-mt-24 sm:scroll-mt-28 p-5 sm:p-6", className)}
      role="form"
      aria-labelledby={`${id}-heading`}
    >
      <h2
        id={`${id}-heading`}
        className="text-lg sm:text-xl font-bold text-[hsl(var(--text))] mb-1"
      >
        {copy.heading}
      </h2>
      <p className="text-sm text-[hsl(var(--text-muted))] mb-4">
        {copy.subhead}
      </p>

      {/* Gift type toggle (binary, two pressed-buttons rather than radiogroup
          to avoid having to re-implement arrow-key roving radio behavior). */}
      <div
        role="group"
        aria-label="Gift type"
        className="grid grid-cols-2 gap-1 rounded-full bg-[hsl(var(--surface-muted))] p-1 mb-5"
      >
        {(
          [
            { value: "oneTime", label: copy.oneTimeLabel },
            { value: "monthly", label: copy.monthlyLabel },
          ] as const
        ).map((opt) => {
          const active = mode === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onModeChange(opt.value)}
              className={cn(
                "h-11 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[hsl(var(--primary))]",
                active
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm"
                  : "text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text))]",
              )}
            >
              {opt.label}
              {opt.value === "monthly" && active && (
                <span
                  aria-hidden="true"
                  className="ml-1 text-[10px] uppercase tracking-wider opacity-90"
                >
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Amount grid */}
      <fieldset className="mb-4">
        <legend className="text-sm font-semibold text-[hsl(var(--text))] mb-2">
          {copy.amountLegend}
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {amounts.map((opt) => {
            const active = customAmount === "" && amount === opt.amount;
            return (
              <button
                key={opt.amount}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  onAmountChange(opt.amount);
                  onCustomAmountChange("");
                }}
                className={cn(
                  "relative flex h-auto min-h-[72px] flex-col items-center justify-center rounded-lg border-2 px-3 py-3 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[hsl(var(--primary))]",
                  active
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5 text-[hsl(var(--primary))]"
                    : "border-[hsl(var(--border))] text-[hsl(var(--text))] hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--surface-muted))]",
                )}
              >
                <span className="text-lg font-bold leading-none">
                  ${opt.amount}
                </span>
                <span
                  className={cn(
                    "mt-1 text-[11px] leading-tight",
                    active
                      ? "text-[hsl(var(--primary))]/80"
                      : "text-[hsl(var(--text-muted))]",
                  )}
                >
                  {opt.impactLabel}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Custom amount */}
      <div className="mb-5">
        <label
          htmlFor={`${id}-custom-amount`}
          className="block text-sm font-semibold text-[hsl(var(--text))] mb-1"
        >
          {copy.customLabel}
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))] font-medium"
          >
            $
          </span>
          <input
            id={`${id}-custom-amount`}
            type="number"
            inputMode="decimal"
            min="1"
            step="1"
            placeholder={copy.customPlaceholder}
            value={customAmount}
            onChange={(e) => {
              onCustomAmountChange(e.target.value);
              if (e.target.value !== "") {
                onAmountChange(null);
              }
            }}
            className="h-12 w-full rounded-lg border-2 border-[hsl(var(--border))] bg-[hsl(var(--surface))] pl-7 pr-3 text-base font-medium text-[hsl(var(--text))] placeholder:text-[hsl(var(--text-muted))] focus:border-[hsl(var(--primary))] focus:outline-none"
          />
        </div>
      </div>

      {/* Primary CTA */}
      <ButtonLink
        {...linkProps}
        variant="primary"
        size="lg"
        className="w-full"
      >
        {ctaLabel}
      </ButtonLink>

      {/* Trust microcopy */}
      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-[hsl(var(--text-muted))]">
        {copy.trustItems.map((item, i) => {
          const Icon = TRUST_ICONS[item.icon];
          return (
            <li key={i} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {item.label}
            </li>
          );
        })}
      </ul>

      {site.copy.landing.donationModuleNote && (
        <p className="mt-3 text-[11px] leading-relaxed text-[hsl(var(--text-muted))]">
          {site.copy.landing.donationModuleNote}
        </p>
      )}
    </Card>
  );
});
