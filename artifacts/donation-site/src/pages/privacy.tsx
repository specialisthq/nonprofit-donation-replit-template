import { Link } from "react-router-dom";
import site from "@config";
import { LegalPageView } from "@/components/legal-page-view";

export function PrivacyPage() {
  const { org } = site;
  return (
    <LegalPageView
      copy={site.copy.legal.privacy}
      prefix="privacy"
      contactSlot={
        <p>
          Email us at{" "}
          <a
            href={`mailto:${org.contactEmail}`}
            data-testid="privacy-contact-email"
          >
            {org.contactEmail}
          </a>
          , or{" "}
          <Link to="/contact" data-testid="privacy-contact-link">
            visit our contact page
          </Link>{" "}
          for our mailing address and other ways to reach us.
        </p>
      }
    />
  );
}
