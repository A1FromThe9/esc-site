import { desc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { auditLog, users } from "@/lib/db/schema";

export async function getRecentAuditLog(limit = 100) {
  const rows = await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(limit);
  if (rows.length === 0) return [];

  const actorIds = [...new Set(rows.map((r) => r.actorId).filter((id): id is string => !!id))];
  const actors = actorIds.length
    ? await db.select({ id: users.id, displayName: users.displayName, email: users.email }).from(users).where(inArray(users.id, actorIds))
    : [];
  const actorMap = new Map(actors.map((a) => [a.id, a.displayName ?? a.email]));

  return rows.map((r) => ({
    ...r,
    actorLabel: r.actorId ? (actorMap.get(r.actorId) ?? "Unknown") : "System",
  }));
}
