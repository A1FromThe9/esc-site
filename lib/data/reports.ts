import { eq, desc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { reports, providerProfiles, users } from "@/lib/db/schema";

export async function getReportsByReporter(reporterId: string) {
  return db
    .select()
    .from(reports)
    .where(eq(reports.reporterId, reporterId))
    .orderBy(desc(reports.createdAt));
}

/** All reports for the admin queue, enriched with a human-readable target label. */
export async function getReportsForAdmin() {
  const rows = await db.select().from(reports).orderBy(desc(reports.createdAt));
  if (rows.length === 0) return [];

  const profileIds = rows.filter((r) => r.targetType === "profile").map((r) => r.targetId);
  const userIds = rows.filter((r) => r.targetType === "user").map((r) => r.targetId);

  const [profiles, userRows] = await Promise.all([
    profileIds.length
      ? db
          .select({ id: providerProfiles.id, displayName: providerProfiles.displayName })
          .from(providerProfiles)
          .where(inArray(providerProfiles.id, profileIds))
      : Promise.resolve([]),
    userIds.length
      ? db.select({ id: users.id, displayName: users.displayName }).from(users).where(inArray(users.id, userIds))
      : Promise.resolve([]),
  ]);

  const profileNames = new Map(profiles.map((p) => [p.id, p.displayName]));
  const userNames = new Map(userRows.map((u) => [u.id, u.displayName]));

  return rows.map((r) => ({
    ...r,
    targetLabel:
      r.targetType === "profile"
        ? (profileNames.get(r.targetId) ?? "Unknown profile")
        : r.targetType === "user"
          ? (userNames.get(r.targetId) ?? "Unknown user")
          : "Message",
  }));
}
