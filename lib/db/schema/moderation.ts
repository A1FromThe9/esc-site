import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import {
  moderationTargetType,
  moderationItemStatus,
  reportTargetType,
  reportReason,
  reportStatus,
} from "./enums";

export const moderationQueue = pgTable("moderation_queue", {
  id: uuid("id").primaryKey().defaultRandom(),
  targetType: moderationTargetType("target_type").notNull(),
  targetId: uuid("target_id").notNull(),
  submittedBy: uuid("submitted_by").references(() => users.id, { onDelete: "set null" }),
  status: moderationItemStatus("status").notNull().default("pending"),
  assignedAdmin: uuid("assigned_admin").references(() => users.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: uuid("reporter_id").references(() => users.id, { onDelete: "set null" }),
  targetType: reportTargetType("target_type").notNull(),
  targetId: uuid("target_id").notNull(),
  reasonCategory: reportReason("reason_category").notNull(),
  description: text("description"),
  status: reportStatus("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  targetType: text("target_type"),
  targetId: uuid("target_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ModerationQueueItem = typeof moderationQueue.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;
