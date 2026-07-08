import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  date,
  time,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { cities } from "./cities";
import {
  verificationStatus,
  documentType,
  documentStatus,
  mediaType,
  moderationStatus,
} from "./enums";

export const providerProfiles = pgTable(
  "provider_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    displayName: text("display_name").notNull(),
    dateOfBirth: date("date_of_birth").notNull(),
    tagline: text("tagline"),
    bio: text("bio"),
    cityId: uuid("city_id").references(() => cities.id),
    district: text("district"),
    // Stored as text[] for services and spoken languages.
    services: text("services").array().notNull().default([]),
    languages: text("languages").array().notNull().default([]),
    // Mock currency, stored in whole EUR for the demo.
    ratePerHour: integer("rate_per_hour"),
    verificationStatus: verificationStatus("verification_status").notNull().default("unverified"),
    isLive: boolean("is_live").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    cityIdx: index("provider_city_idx").on(t.cityId),
    liveIdx: index("provider_live_idx").on(t.isLive),
    verificationIdx: index("provider_verification_idx").on(t.verificationStatus),
  }),
);

export const verificationDocuments = pgTable("verification_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerId: uuid("provider_id")
    .notNull()
    .references(() => providerProfiles.id, { onDelete: "cascade" }),
  type: documentType("type").notNull(),
  fileUrl: text("file_url").notNull(),
  status: documentStatus("status").notNull().default("pending"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerId: uuid("provider_id")
    .notNull()
    .references(() => providerProfiles.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  type: mediaType("type").notNull().default("photo"),
  sortOrder: integer("sort_order").notNull().default(0),
  moderationStatus: moderationStatus("moderation_status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const availability = pgTable("availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerId: uuid("provider_id")
    .notNull()
    .references(() => providerProfiles.id, { onDelete: "cascade" }),
  // Recurring weekly slot (0=Sunday..6=Saturday) OR a specific date.
  dayOfWeek: integer("day_of_week"),
  specificDate: date("specific_date"),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isBookable: boolean("is_bookable").notNull().default(true),
});

export type ProviderProfile = typeof providerProfiles.$inferSelect;
export type NewProviderProfile = typeof providerProfiles.$inferInsert;
export type VerificationDocument = typeof verificationDocuments.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Availability = typeof availability.$inferSelect;
