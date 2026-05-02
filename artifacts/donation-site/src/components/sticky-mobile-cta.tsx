import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** Element id of the sentinel that, when off-screen, triggers the bar. */
  watchSentinelId: string;
  /** Anchor id on the page to scroll to when the bar is tapped. */
  scrollToId: string;
  /** Visible CTA label (typically driven by the donation module's state). */
  label: string;
};

export function StickyMobileCta({ watchSentinelId, scrollToId, label }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(watchSentinelId);
    if (!el) return;
    // Show the bar only once the user has scrolled past the sentinel
    // (i.e. past the bottom of the hero / donation module zone). When the
    // sentinel is visible or still below the viewport, hide the bar so it
    // doesn't redundantly cover the donation module the user is viewing.
    function check() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setShow(rect.top < 0);
    }
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [watchSentinelId]);

  function handleClick() {
    const target = document.getElementById(scrollToId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstButton = target.querySelector<HTMLElement>(
        'button:not([disabled]),[href],input,[tabindex]:not([tabindex="-1"])',
      );
      firstButton?.focus({ preventScroll: true });
    }
  }

  return (
    <div
      data-testid="sticky-mobile-cta"
      aria-hidden={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))]/95 backdrop-blur px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:hidden",
        "transition-transform duration-300 ease-out",
        show
          ? "translate-y-0 visible"
          : "translate-y-full invisible pointer-events-none",
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full min-h-[52px] items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-6 text-base font-semibold text-[hsl(var(--primary-foreground))] shadow-md hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--primary))]"
      >
        <Heart className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>
    </div>
  );
}
