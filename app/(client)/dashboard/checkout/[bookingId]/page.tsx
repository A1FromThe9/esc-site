import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/permissions";
import { getBookingForParticipant } from "@/lib/data/bookings";
import { db } from "@/lib/db";
import { providerProfiles } from "@/lib/db/schema";
import { Card } from "@/components/ui/primitives";
import { formatEur } from "@/lib/utils";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const user = await requireRole("client");
  const { bookingId } = await params;
  const booking = await getBookingForParticipant(bookingId, user.id, "client");
  if (!booking || booking.status !== "awaiting_payment" || !booking.agreedRate) notFound();

  const [provider] = await db
    .select({ displayName: providerProfiles.displayName })
    .from(providerProfiles)
    .where(eq(providerProfiles.id, booking.providerId));

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="text-sm text-muted">
          Mock payment — no real transaction occurs on this demo.
        </p>
      </div>

      <Card className="flex items-center justify-between">
        <div>
          <p className="font-medium">{provider?.displayName ?? "Provider"}</p>
          <p className="text-sm text-muted">
            {new Date(booking.requestedStart).toLocaleString("de-DE", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <p className="text-xl font-semibold text-accent">{formatEur(booking.agreedRate)}</p>
      </Card>

      <Card>
        <CheckoutForm bookingId={booking.id} />
      </Card>
    </div>
  );
}
