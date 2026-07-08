import { requireRole } from "@/lib/auth/permissions";
import { getClientBookings } from "@/lib/data/bookings";
import { Card } from "@/components/ui/primitives";
import { ButtonLink, Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/booking-status-badge";
import { cancelBookingAction, completeBookingAction } from "@/app/actions/bookings";
import { formatEur } from "@/lib/utils";

export default async function ClientBookingsPage() {
  const user = await requireRole("client");
  const bookings = await getClientBookings(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted">Requests you&apos;ve sent to providers.</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <p className="text-muted">No bookings yet. Browse companions to request one.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium">{b.otherName}</h2>
                  <BookingStatusBadge status={b.status} />
                </div>
                <p className="text-sm text-muted">
                  {new Date(b.requestedStart).toLocaleString("de-DE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}{" "}
                  · {b.locationType} {b.agreedRate ? `· ${formatEur(b.agreedRate)}` : ""}
                </p>
              </div>

              <div className="flex gap-2">
                {b.status === "awaiting_payment" && (
                  <ButtonLink href={`/dashboard/checkout/${b.id}`} size="sm">
                    Pay now
                  </ButtonLink>
                )}
                {b.status === "paid" && (
                  <form action={completeBookingAction}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <Button type="submit" size="sm" variant="secondary">
                      Mark completed
                    </Button>
                  </form>
                )}
                {["requested", "confirmed", "awaiting_payment", "paid"].includes(b.status) && (
                  <form action={cancelBookingAction}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <Button type="submit" size="sm" variant="ghost">
                      Cancel
                    </Button>
                  </form>
                )}
                <ButtonLink href="/dashboard/messages" size="sm" variant="ghost">
                  Message
                </ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
