import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteLayout } from "@/components/site-layout";
import { LandingPage } from "@/pages/landing";
import { ThankYouPage } from "@/pages/thank-you";
import { AboutPage } from "@/pages/about";
import { ImpactPage } from "@/pages/impact";
import { TransparencyPage } from "@/pages/transparency";
import { ContactPage } from "@/pages/contact";
import { PrivacyPage } from "@/pages/privacy";
import { TermsPage } from "@/pages/terms";
import { StubPage } from "@/pages/stub";
import NotFound from "@/pages/not-found";

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <BrowserRouter basename={basename || "/"}>
      <SiteLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/*
            CLONER NOTE — PayPal "Return URL"
            ---------------------------------
            Set your PayPal Donate hosted button's Return URL to:
                https://<your-domain>/thank-you
            (or, if this site is deployed under a sub-path, prefix it with
            that path — e.g. https://your-domain.com/donate/thank-you).
            That makes PayPal redirect donors to /thank-you immediately
            after a successful gift, and this page is built to render
            cleanly whether or not PayPal appends query parameters.
          */}
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund-policy" element={<StubPage title="Refund / correction policy" legal />} />
          <Route path="/donor-bill-of-rights" element={<StubPage title="Donor bill of rights" legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  );
}

export default App;
