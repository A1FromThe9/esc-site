import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  providerProfiles,
  verificationDocuments,
  reports,
  moderationQueue,
  cities,
} from "@/lib/db/schema";

export async function getPendingVerifications() {
  const rows = await db
    .select({
      id: providerProfiles.id,
      slug: providerProfiles.slug,
      displayName: providerProfiles.displayName,
      dateOfBirth: providerProfiles.dateOfBirth,
      cityName: cities.name,
      updatedAt: providerProfiles.updatedAt,
    })
    .from(providerProfiles)
    .leftJoin(cities, eq(providerProfiles.cityId, cities.id))
    .where(eq(providerProfiles.verificationStatus, "pending"))
    .orderBy(desc(providerProfiles.updatedAt));

  const withDocs = await Promise.all(
    rows.map(async (r) => {
      const docs = await db
        .select()
        .from(verificationDocuments)
        .where(eq(verificationDocuments.providerId, r.id));
      return { ...r, documents: docs };
    }),
  );
  return withDocs;
}

export async function getAdminCounts() {
  const [pendingVerif, openReports, pendingModeration] = await Promise.all([
    db
      .select({ id: providerProfiles.id })
      .from(providerProfiles)
      .where(eq(providerProfiles.verificationStatus, "pending")),
    db.select({ id: reports.id }).from(reports).where(eq(reports.status, "open")),
    db
      .select({ id: moderationQueue.id })
      .from(moderationQueue)
      .where(eq(moderationQueue.status, "pending")),
  ]);
  return {
    pendingVerifications: pendingVerif.length,
    openReports: openReports.length,
    pendingModeration: pendingModeration.length,
  };
}
