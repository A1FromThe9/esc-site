import { requireRole } from "@/lib/auth/permissions";
import { getMyProviderProfile } from "@/lib/data/me";
import { getProviderBookings } from "@/lib/data/bookings";
import { Card } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/booking-status-badge";
import {
  acceptBookingAction,
  declineBookingAction,
  cancelBookingAction,
  completeBookingAction,
} from "@/app/actions/bookings";
import { formatEur } from "@/lib/utils";

export default async function ProviderBookingsPage() {
  const user = await requireRole("provider");
  const profile = await getMyProviderProfile(user.id);
  if (!profile) return <Card><p className="text-muted">Profile not found.</p></Card>;

  const bookings = await getProviderBookings(profile.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted">Requests from clients.</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <p className="text-muted">No booking requests yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
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
                  {b.note && <p className="mt-1 text-sm text-muted">&ldquo;{b.note}&rdquo;</p>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {b.status === "paid" && (
                    <form action={completeBookingAction}>
                      <input type="hidden" name="bookingId" value={b.id} />
                      <Button type="submit" size="sm" variant="secondary">
                        Mark completed
                      </Button>
                    </form>
                  )}
                  {["requested", "confirmed", "awaiting_payment", "paid"].includes(b.status) &&
                    b.status !== "requested" && (
                      <form action={cancelBookingAction}>
                        <input type="hidden" name="bookingId" value={b.id} />
                        <Button type="submit" size="sm" variant="ghost">
                          Cancel
                        </Button>
                      </form>
                    )}
                  <ButtonLink href="/provider-dashboard/messages" size="sm" variant="ghost">
                    Message
                  </ButtonLink>
                </div>
              </div>

              {b.status === "requested" && (
                <div className="flex flex-wrap items-center gap-2 border-t border-app pt-3">
                  <form action={acceptBookingAction} className="flex items-center gap-2">
                    <input type="hidden" name="bookingId" value={b.id} />
                    <input
                      type="number"
                      name="agreedRate"
                      min={0}
                      placeholder="Agreed rate (EUR)"
                      required
                      className="h-9 w-44 rounded-[var(--radius)] border border-app bg-surface-2 px-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 ring-accent"
                    />
                    <Button type="submit" size="sm">
                      Accept
                    </Button>
                  </form>
                  <form action={declineBookingAction}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <Button type="submit" size="sm" variant="ghost">
                      Decline
                    </Button>
                  </form>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
