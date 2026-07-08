import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { mockPayments, bookings } from "@/lib/db/schema";

/**
 * Mock payment provider shaped like a trimmed Stripe SDK. No real money ever
 * moves — swapping this module for real Stripe test mode later would be a
 * drop-in replacement for the call sites, not a rewrite.
 */

export type MockCheckoutSession = {
  paymentId: string;
  amount: number;
  currency: string;
};

/** Create a pending mock payment for a booking's agreed rate. */
export async function createCheckoutSession(bookingId: string): Promise<MockCheckoutSession | null> {
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
  if (!booking || !booking.agreedRate) return null;

  const [payment] = await db
    .insert(mockPayments)
    .values({
      bookingId,
      amount: booking.agreedRate,
      currency: "EUR",
      status: "pending",
      mockProvider: "demo-pay",
    })
    .returning();

  return { paymentId: payment.id, amount: payment.amount, currency: payment.currency };
}

/** Simulate a successful card charge: mark the payment succeeded and the booking paid. */
export async function confirmMockPayment(paymentId: string, cardLast4: string) {
  const [payment] = await db
    .update(mockPayments)
    .set({ status: "succeeded", mockCardLast4: cardLast4, updatedAt: new Date() })
    .where(eq(mockPayments.id, paymentId))
    .returning();
  if (!payment) return null;

  await db
    .update(bookings)
    .set({ status: "paid", updatedAt: new Date() })
    .where(eq(bookings.id, payment.bookingId));

  return payment;
}

/** Simulate a refund for a booking's most recent succeeded payment. */
export async function refundMockPayment(bookingId: string) {
  const [payment] = await db
    .select()
    .from(mockPayments)
    .where(eq(mockPayments.bookingId, bookingId));
  if (!payment || payment.status !== "succeeded") return null;

  const [updated] = await db
    .update(mockPayments)
    .set({ status: "refunded", updatedAt: new Date() })
    .where(eq(mockPayments.id, payment.id))
    .returning();
  return updated;
}

export async function retrieveMockPayment(paymentId: string) {
  const [payment] = await db.select().from(mockPayments).where(eq(mockPayments.id, paymentId));
  return payment ?? null;
}
