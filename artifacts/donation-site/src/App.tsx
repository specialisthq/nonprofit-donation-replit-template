import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteLayout } from "@/components/site-layout";
import { LandingPage } from "@/pages/landing";
import { StubPage } from "@/pages/stub";
import NotFound from "@/pages/not-found";

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <BrowserRouter basename={basename || "/"}>
      <SiteLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/thank-you" element={<StubPage title="Thank you" />} />
          <Route path="/about" element={<StubPage title="About" />} />
          <Route path="/impact" element={<StubPage title="Our impact" />} />
          <Route path="/transparency" element={<StubPage title="Transparency" />} />
          <Route path="/contact" element={<StubPage title="Contact" />} />
          <Route path="/privacy" element={<StubPage title="Privacy policy" />} />
          <Route path="/terms" element={<StubPage title="Terms of use" />} />
          <Route path="/refund-policy" element={<StubPage title="Refund / correction policy" />} />
          <Route path="/donor-bill-of-rights" element={<StubPage title="Donor bill of rights" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  );
}

export default App;
