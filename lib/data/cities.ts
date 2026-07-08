import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { cities } from "@/lib/db/schema";

export async function getCities() {
  return db.select().from(cities).orderBy(asc(cities.name));
}
