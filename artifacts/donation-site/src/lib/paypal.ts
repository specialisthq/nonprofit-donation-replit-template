import site from "@config";

/** Build the PayPal hosted-button donate URL with optional preselected amount. */
export function buildDonateUrl(opts?: {
  amount?: number;
  recurring?: boolean;
}): string {
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
