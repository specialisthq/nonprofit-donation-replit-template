import { Link } from "react-router-dom";
import site from "@config";
import { LegalPageView } from "@/components/legal-page-view";

export function RefundPolicyPage() {
  const { org } = site;
  return (
    <LegalPageView
      copy={site.copy.legal.refundPolicy}
      prefix="refund"
      contactSlot={
        <p>
          Email us at{" "}
          <a
            href={`mailto:${org.contactEmail}`}
            data-testid="refund-contact-email"
          >
            {org.contactEmail}
          </a>{" "}
          with the subject line "Refund request" and your donation
          confirmation number, or{" "}
          <Link to="/contact" data-testid="refund-contact-link">
            visit our contact page
          </Link>{" "}
          for our mailing address.
        </p>
      }
    />
  );
}
