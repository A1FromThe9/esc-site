import { SealCheck, ShieldCheck, Flag } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/primitives";

export default function SafetyPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Safety &amp; verification</h1>
      <p className="mt-2 text-muted">
        How this platform keeps listings compliant with Germany&apos;s Prostituiertenschutzgesetz
        (ProstSchG). Note: this is a portfolio demo — verification is simulated.
      </p>

      <div className="mt-8 space-y-4">
        <Card className="flex gap-3">
          <SealCheck className="mt-0.5 shrink-0 text-accent" size={22} />
          <div>
            <h2 className="font-medium">What &quot;verified&quot; means</h2>
            <p className="mt-1 text-sm text-muted">
              Before a profile goes live, the provider submits an ID document, a ProstSchG
              registration certificate (Anmeldebescheinigung), and health-counseling proof. An
              admin reviews them. Publishing is blocked until an approved ProstSchG certificate is
              on file. In this demo, documents are not stored or actually inspected.
            </p>
          </div>
        </Card>

        <Card className="flex gap-3">
          <ShieldCheck className="mt-0.5 shrink-0 text-accent" size={22} />
          <div>
            <h2 className="font-medium">Age requirements</h2>
            <p className="mt-1 text-sm text-muted">
              Visitors confirm they are 18+. Providers must be at least 21, the minimum age for
              ProstSchG registration — enforced at signup with date-of-birth validation.
            </p>
          </div>
        </Card>

        <Card className="flex gap-3">
          <Flag className="mt-0.5 shrink-0 text-accent" size={22} />
          <div>
            <h2 className="font-medium">Reporting &amp; content policy</h2>
            <p className="mt-1 text-sm text-muted">
              Any profile or message can be reported. Reports suggesting coercion, trafficking, or
              minors trigger an immediate suspension from search pending review. Content promoting
              coercion or involving minors is strictly prohibited. (Reporting UI ships in a later
              phase of this demo.)
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
