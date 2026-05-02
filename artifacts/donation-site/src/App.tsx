import { Switch, Route, Router as WouterRouter } from "wouter";
import { SiteLayout } from "@/components/site-layout";
import { LandingPlaceholder } from "@/pages/landing-placeholder";
import { StubPage } from "@/pages/stub";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPlaceholder} />
      <Route path="/thank-you">{() => <StubPage title="Thank you" />}</Route>
      <Route path="/about">{() => <StubPage title="About" />}</Route>
      <Route path="/impact">{() => <StubPage title="Our impact" />}</Route>
      <Route path="/transparency">{() => <StubPage title="Transparency" />}</Route>
      <Route path="/contact">{() => <StubPage title="Contact" />}</Route>
      <Route path="/privacy">{() => <StubPage title="Privacy policy" />}</Route>
      <Route path="/terms">{() => <StubPage title="Terms of use" />}</Route>
      <Route path="/refund-policy">{() => <StubPage title="Refund / correction policy" />}</Route>
      <Route path="/donor-bill-of-rights">{() => <StubPage title="Donor bill of rights" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <SiteLayout>
        <Router />
      </SiteLayout>
    </WouterRouter>
  );
}

export default App;
