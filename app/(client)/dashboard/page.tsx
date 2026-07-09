import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";

export default async function ClientHome() {
  const session = await auth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {session?.user?.name ?? "there"}
        </h1>
        <p className="text-sm text-muted">Your bookings and conversations live here.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Active conversations" value="0" />
        <Stat label="Upcoming bookings" value="0" />
        <Stat label="Reports filed" value="0" />
      </div>

      <Card className="flex flex-col items-start gap-3">
        <h2 className="font-medium">Find a companion</h2>
        <p className="text-sm text-muted">
          Browse verified providers by city, then message or request a booking.
        </p>
        <ButtonLink href="/search">Browse companions</ButtonLink>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="py-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </Card>
  );
}
