import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const cities = pgTable("cities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  region: text("region").notNull(),
});

export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;
