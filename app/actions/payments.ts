"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth/permissions";
import { getBookingForParticipant } from "@/lib/data/bookings";
import { createCheckoutSession, confirmMockPayment } from "@/lib/payments/mock-provider";

export type CheckoutState = { error?: string } | undefined;

export async function checkoutAction(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const user = await requireRole("client");
  const bookingId = formData.get("bookingId") as string;
  const cardNumber = ((formData.get("cardNumber") as string) || "").replace(/\s+/g, "");

  const booking = await getBookingForParticipant(bookingId, user.id, "client");
  if (!booking) return { error: "Booking not found." };
  if (booking.status !== "awaiting_payment") return { error: "This booking isn't awaiting payment." };
  if (!booking.agreedRate) return { error: "No agreed rate set yet." };
  if (cardNumber.length < 4) return { error: "Enter a mock card number." };

  const session = await createCheckoutSession(bookingId);
  if (!session) return { error: "Could not start checkout." };

  await confirmMockPayment(session.paymentId, cardNumber.slice(-4));

  await db.insert(auditLog).values({
    actorId: user.id,
    action: "payment.mock_succeeded",
    targetType: "booking",
    targetId: bookingId,
    metadata: { amount: session.amount, currency: session.currency },
  });

  revalidatePath("/dashboard/bookings");
  revalidatePath("/provider-dashboard/bookings");
  redirect("/dashboard/bookings");
}
