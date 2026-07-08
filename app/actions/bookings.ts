"use server";

import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { bookings, providerProfiles, conversations, auditLog } from "@/lib/db/schema";
import { requireRole, requireUser } from "@/lib/auth/permissions";
import { requestBookingSchema } from "@/lib/validation/booking";
import { findOrCreateConversation } from "@/lib/data/messaging";
import { refundMockPayment } from "@/lib/payments/mock-provider";

export type BookingFormState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

export async function requestBookingAction(
  _prev: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const user = await requireRole("client");
  const parsed = requestBookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "_";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const { providerSlug, date, startTime, endTime, locationType, note } = parsed.data;
  const [profile] = await db
    .select({ id: providerProfiles.id, isLive: providerProfiles.isLive })
    .from(providerProfiles)
    .where(eq(providerProfiles.slug, providerSlug));
  if (!profile || !profile.isLive) return { error: "Provider not found." };

  const conv = await findOrCreateConversation(user.id, profile.id);

  await db.insert(bookings).values({
    conversationId: conv.id,
    clientId: user.id,
    providerId: profile.id,
    requestedStart: new Date(`${date}T${startTime}:00`),
    requestedEnd: new Date(`${date}T${endTime}:00`),
    locationType,
    note: note || null,
  });

  revalidatePath("/dashboard/bookings");
  revalidatePath("/provider-dashboard/bookings");
  redirect("/dashboard/bookings");
}

async function loadOwnedBooking(bookingId: string, providerUserId: string) {
  const [profile] = await db
    .select({ id: providerProfiles.id })
    .from(providerProfiles)
    .where(eq(providerProfiles.userId, providerUserId));
  if (!profile) return null;
  const [booking] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, bookingId), eq(bookings.providerId, profile.id)));
  return booking ?? null;
}

export async function acceptBookingAction(formData: FormData) {
  const user = await requireRole("provider");
  const bookingId = formData.get("bookingId") as string;
  const agreedRate = Number(formData.get("agreedRate"));
  const booking = await loadOwnedBooking(bookingId, user.id);
  if (!booking || booking.status !== "requested") return;

  await db
    .update(bookings)
    .set({
      status: "awaiting_payment",
      agreedRate: Number.isFinite(agreedRate) && agreedRate > 0 ? agreedRate : null,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, bookingId));

  revalidatePath("/dashboard/bookings");
  revalidatePath("/provider-dashboard/bookings");
}

export async function declineBookingAction(formData: FormData) {
  const user = await requireRole("provider");
  const bookingId = formData.get("bookingId") as string;
  const booking = await loadOwnedBooking(bookingId, user.id);
  if (!booking || booking.status !== "requested") return;

  await db
    .update(bookings)
    .set({ status: "declined", updatedAt: new Date() })
    .where(eq(bookings.id, bookingId));

  revalidatePath("/dashboard/bookings");
  revalidatePath("/provider-dashboard/bookings");
}

const CANCELLABLE = ["requested", "confirmed", "awaiting_payment", "paid"];

export async function cancelBookingAction(formData: FormData) {
  const user = await requireUser();
  const bookingId = formData.get("bookingId") as string;
  const role = user.role === "provider" ? "provider" : "client";

  const [booking] =
    role === "client"
      ? await db.select().from(bookings).where(and(eq(bookings.id, bookingId), eq(bookings.clientId, user.id)))
      : await (async () => {
          const b = await loadOwnedBooking(bookingId, user.id);
          return b ? [b] : [];
        })();

  if (!booking || !CANCELLABLE.includes(booking.status)) return;

  if (booking.status === "paid") {
    await refundMockPayment(booking.id);
  }

  await db
    .update(bookings)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(bookings.id, bookingId));

  await db.insert(auditLog).values({
    actorId: user.id,
    action: "booking.cancelled",
    targetType: "booking",
    targetId: booking.id,
    metadata: { refunded: booking.status === "paid" },
  });

  revalidatePath("/dashboard/bookings");
  revalidatePath("/provider-dashboard/bookings");
}

export async function completeBookingAction(formData: FormData) {
  const user = await requireUser();
  const bookingId = formData.get("bookingId") as string;
  const role = user.role === "provider" ? "provider" : "client";

  const [booking] =
    role === "client"
      ? await db.select().from(bookings).where(and(eq(bookings.id, bookingId), eq(bookings.clientId, user.id)))
      : await (async () => {
          const b = await loadOwnedBooking(bookingId, user.id);
          return b ? [b] : [];
        })();

  if (!booking || booking.status !== "paid") return;

  await db
    .update(bookings)
    .set({ status: "completed", updatedAt: new Date() })
    .where(eq(bookings.id, bookingId));

  revalidatePath("/dashboard/bookings");
  revalidatePath("/provider-dashboard/bookings");
}
