import { and, eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, providerProfiles, users, mockPayments } from "@/lib/db/schema";

export async function getClientBookings(clientId: string) {
  const rows = await db
    .select({
      id: bookings.id,
      requestedStart: bookings.requestedStart,
      requestedEnd: bookings.requestedEnd,
      locationType: bookings.locationType,
      note: bookings.note,
      agreedRate: bookings.agreedRate,
      status: bookings.status,
      providerId: bookings.providerId,
      otherName: providerProfiles.displayName,
      otherSlug: providerProfiles.slug,
    })
    .from(bookings)
    .innerJoin(providerProfiles, eq(bookings.providerId, providerProfiles.id))
    .where(eq(bookings.clientId, clientId))
    .orderBy(desc(bookings.createdAt));
  return rows;
}

export async function getProviderBookings(providerId: string) {
  const rows = await db
    .select({
      id: bookings.id,
      requestedStart: bookings.requestedStart,
      requestedEnd: bookings.requestedEnd,
      locationType: bookings.locationType,
      note: bookings.note,
      agreedRate: bookings.agreedRate,
      status: bookings.status,
      clientId: bookings.clientId,
      otherName: users.displayName,
    })
    .from(bookings)
    .innerJoin(users, eq(bookings.clientId, users.id))
    .where(eq(bookings.providerId, providerId))
    .orderBy(desc(bookings.createdAt));
  return rows;
}

/** Load a booking only if `userId` participates in it (as client or as the provider). */
export async function getBookingForParticipant(
  bookingId: string,
  userId: string,
  role: "client" | "provider",
) {
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
  if (!booking) return null;

  if (role === "client") {
    if (booking.clientId !== userId) return null;
    return booking;
  }

  const [profile] = await db
    .select({ id: providerProfiles.id })
    .from(providerProfiles)
    .where(eq(providerProfiles.userId, userId));
  if (!profile || booking.providerId !== profile.id) return null;
  return booking;
}

export async function getBookingWithPayment(bookingId: string) {
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
  if (!booking) return null;
  const [payment] = await db
    .select()
    .from(mockPayments)
    .where(eq(mockPayments.bookingId, bookingId))
    .orderBy(desc(mockPayments.createdAt));
  return { booking, payment: payment ?? null };
}
