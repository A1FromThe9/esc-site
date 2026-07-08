import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { userRole, userStatus } from "./enums";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("client"),
  displayName: text("display_name"),
  status: userStatus("status").notNull().default("active"),
  ageGateAcceptedAt: timestamp("age_gate_accepted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
