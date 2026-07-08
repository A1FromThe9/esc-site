import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { providerProfiles } from "./providers";
import { conversations } from "./messaging";
import { bookingStatus, paymentStatus, locationType } from "./enums";

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => conversations.id, {
    onDelete: "set null",
  }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerId: uuid("provider_id")
    .notNull()
    .references(() => providerProfiles.id, { onDelete: "cascade" }),
  requestedStart: timestamp("requested_start", { withTimezone: true }).notNull(),
  requestedEnd: timestamp("requested_end", { withTimezone: true }).notNull(),
  locationType: locationType("location_type").notNull().default("incall"),
  note: text("note"),
  // Agreed rate in whole EUR (mock currency).
  agreedRate: integer("agreed_rate"),
  status: bookingStatus("status").notNull().default("requested"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Named `mock_payments` deliberately — no real transactions occur in this demo.
export const mockPayments = pgTable("mock_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("EUR"),
  status: paymentStatus("status").notNull().default("pending"),
  mockProvider: text("mock_provider").notNull().default("demo-pay"),
  mockCardLast4: text("mock_card_last4"),
  mockSessionId: text("mock_session_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Booking = typeof bookings.$inferSelect;
export type MockPayment = typeof mockPayments.$inferSelect;
