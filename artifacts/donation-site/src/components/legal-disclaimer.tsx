import { AlertTriangle } from "lucide-react";
import { site } from "@/../site.config";

export function LegalDisclaimer() {
  const { heading, body } = site.copy.legal.disclaimer;
  return (
    <div
      role="note"
      data-testid="legal-disclaimer"
      className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 sm:p-5 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <div className="flex gap-3">
        <AlertTriangle
          className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400"
          aria-hidden="true"
        />
        <div className="text-sm sm:text-base">
          <p className="font-semibold">{heading}</p>
          <p className="mt-1 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}
