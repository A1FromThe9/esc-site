import { eq, desc, and, ne, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { moderationQueue, providerProfiles } from "@/lib/db/schema";

/** Pending queue items excluding profile verifications (handled on /admin/verification). */
export async function getPendingModerationItems() {
  const rows = await db
    .select()
    .from(moderationQueue)
    .where(and(eq(moderationQueue.status, "pending"), ne(moderationQueue.targetType, "profile")))
    .orderBy(desc(moderationQueue.createdAt));

  if (rows.length === 0) return [];
  const profileIds = rows.map((r) => r.targetId);
  const profiles = await db
    .select({ id: providerProfiles.id, displayName: providerProfiles.displayName })
    .from(providerProfiles)
    .where(inArray(providerProfiles.id, profileIds));
  const names = new Map(profiles.map((p) => [p.id, p.displayName]));

  return rows.map((r) => ({ ...r, targetLabel: names.get(r.targetId) ?? "Unknown" }));
}
