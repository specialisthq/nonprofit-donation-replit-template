import site from "@config";

const PLACEHOLDER_BUTTON_ID = "REPLACE_WITH_YOUR_BUTTON_ID";
let warnedAboutPlaceholder = false;

/** Build the PayPal hosted-button donate URL with optional preselected amount. */
export function buildDonateUrl(opts?: {
  amount?: number;
  recurring?: boolean;
}): string {
  if (
    site.paypal.hostedButtonId === PLACEHOLDER_BUTTON_ID &&
    typeof console !== "undefined" &&
    !warnedAboutPlaceholder
  ) {
    warnedAboutPlaceholder = true;
    console.warn(
      "[donation-site] paypal.hostedButtonId is still set to the placeholder " +
        "\"REPLACE_WITH_YOUR_BUTTON_ID\" in site.config.ts. Donations will fail " +
        "at PayPal until you set this to your real hosted-button id from " +
        "https://www.paypal.com/donate/buttons.",
    );
  }
  const params = new URLSearchParams({
    hosted_button_id: site.paypal.hostedButtonId,
  });
  if (opts?.amount) params.set("amount", String(opts.amount));
  if (opts?.recurring) params.set("item_name", "Monthly gift");
  if (site.paypal.returnUrl) params.set("return", site.paypal.returnUrl);
  return `https://www.paypal.com/donate?${params.toString()}`;
}

/** Returns target attr that matches the configured flow mode. */
export function donateLinkProps(opts?: { amount?: number; recurring?: boolean }) {
  const url = buildDonateUrl(opts);
  if (site.paypal.flowMode === "sameTab") {
    return { href: url };
  }
  return { href: url, target: "_blank", rel: "noopener noreferrer" };
}
