import { Link } from "react-router-dom";
import site from "@config";
import { LegalPageView } from "@/components/legal-page-view";

export function DonorBillOfRightsPage() {
  const { org } = site;
  return (
    <LegalPageView
      copy={site.copy.legal.donorBillOfRights}
      prefix="donor-rights"
      disclaimerOverride={site.copy.legal.disclaimerLight}
      contactSlot={
        <p>
          Email us at{" "}
          <a
            href={`mailto:${org.contactEmail}`}
            data-testid="donor-rights-contact-email"
          >
            {org.contactEmail}
          </a>
          , or{" "}
          <Link to="/contact" data-testid="donor-rights-contact-link">
            visit our contact page
          </Link>{" "}
          for more ways to reach us.
        </p>
      }
    />
  );
}
