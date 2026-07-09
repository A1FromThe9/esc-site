import { Card } from "@/components/ui/primitives";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-muted">Fictional terms for a portfolio demo. Not legal advice.</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
        <Card>
          <h2 className="mb-1 font-medium text-fg">1. Eligibility</h2>
          <p>You must be at least 18 to use this site. Providers must be at least 21 and hold a
          valid ProstSchG registration certificate (Anmeldebescheinigung).</p>
        </Card>
        <Card>
          <h2 className="mb-1 font-medium text-fg">2. Provider obligations</h2>
          <p>Providers confirm they are registered under the Prostituiertenschutzgesetz, have
          completed health counseling, and comply with all applicable German law including the
          mandatory-condom-use provisions. Profiles remain hidden until verified.</p>
        </Card>
        <Card>
          <h2 className="mb-1 font-medium text-fg">3. Prohibited content</h2>
          <p>Any content that suggests coercion, human trafficking, or the involvement of minors is
          strictly prohibited and will be reported to authorities in a real deployment.</p>
        </Card>
        <Card>
          <h2 className="mb-1 font-medium text-fg">4. Payments</h2>
          <p>All payments in this demo are simulated. No real transactions occur.</p>
        </Card>
      </div>
    </div>
  );
}
