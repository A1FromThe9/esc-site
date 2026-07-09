import { pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["client", "provider", "admin"]);
export const userStatus = pgEnum("user_status", ["active", "suspended", "banned"]);

export const verificationStatus = pgEnum("verification_status", [
  "unverified",
  "pending",
  "verified",
  "rejected",
]);

export const documentType = pgEnum("document_type", [
  "id_document",
  "prostschg_certificate",
  "health_counseling_proof",
]);

export const documentStatus = pgEnum("document_status", ["pending", "approved", "rejected"]);

export const mediaType = pgEnum("media_type", ["photo", "video"]);
export const moderationStatus = pgEnum("moderation_status", ["pending", "approved", "rejected"]);

export const bookingStatus = pgEnum("booking_status", [
  "requested",
  "confirmed",
  "awaiting_payment",
  "paid",
  "declined",
  "cancelled",
  "completed",
]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
]);

export const locationType = pgEnum("location_type", ["incall", "outcall"]);

export const moderationTargetType = pgEnum("moderation_target_type", [
  "profile",
  "media",
  "listing_edit",
]);

export const moderationItemStatus = pgEnum("moderation_item_status", [
  "pending",
  "approved",
  "rejected",
]);

export const reportTargetType = pgEnum("report_target_type", ["profile", "message", "user"]);

export const reportReason = pgEnum("report_reason", [
  "suspected_coercion",
  "suspected_minor",
  "missing_registration_proof",
  "harassment",
  "spam",
  "other",
]);

export const reportStatus = pgEnum("report_status", [
  "open",
  "investigating",
  "resolved",
  "dismissed",
]);
