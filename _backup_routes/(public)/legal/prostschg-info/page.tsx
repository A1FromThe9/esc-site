import { Card } from "@/components/ui/primitives";

export default function ProstschgInfoPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">About the ProstSchG</h1>
      <p className="mt-2 text-muted">
        The Prostituiertenschutzgesetz (Prostitutes Protection Act), in force since 2017, regulates
        sex work in Germany. This page summarizes the parts this demo models.
      </p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
        <Card>
          <h2 className="mb-1 font-medium text-fg">Registration (Anmeldung)</h2>
          <p>Sex workers must register with the local authority and receive a registration
          certificate. The minimum age is 21 for registration (18 in limited cases; this demo uses
          21). We require an approved certificate before a profile can be published.</p>
        </Card>
        <Card>
          <h2 className="mb-1 font-medium text-fg">Health counseling</h2>
          <p>Registration requires proof of a prior health-counseling session, renewed periodically.
          We model this as a required document type.</p>
        </Card>
        <Card>
          <h2 className="mb-1 font-medium text-fg">Condom mandate &amp; advertising rules</h2>
          <p>The Act mandates condom use and restricts certain advertising. Our content policy and
          terms reference these obligations.</p>
        </Card>
        <p className="text-xs">
          This is an educational summary within a fictional demo, not legal advice.
        </p>
      </div>
    </div>
  );
}
