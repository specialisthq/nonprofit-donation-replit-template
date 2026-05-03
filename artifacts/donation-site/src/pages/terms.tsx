import { Link } from "react-router-dom";
import site from "@config";
import { LegalPageView } from "@/components/legal-page-view";

export function TermsPage() {
  const { org } = site;
  return (
    <LegalPageView
      copy={site.copy.legal.terms}
      prefix="terms"
      contactSlot={
        <p>
          Email us at{" "}
          <a
            href={`mailto:${org.contactEmail}`}
            data-testid="terms-contact-email"
          >
            {org.contactEmail}
          </a>
          , or{" "}
          <Link to="/contact" data-testid="terms-contact-link">
            visit our contact page
          </Link>{" "}
          for any questions about these Terms.
        </p>
      }
    />
  );
}
