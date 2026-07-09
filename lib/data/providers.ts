import { and, desc, eq, inArray, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { providerProfiles, cities, media, availability } from "@/lib/db/schema";
import type { ProviderCardData } from "@/components/provider-card";

/** Live (published + verified) providers for public browse, optional city filter. */
export async function getLiveProviders(limit = 24, citySlug?: string): Promise<ProviderCardData[]> {
  const conditions = [eq(providerProfiles.isLive, true)];
  if (citySlug) conditions.push(eq(cities.slug, citySlug));

  const rows = await db
    .select({
      id: providerProfiles.id,
      slug: providerProfiles.slug,
      displayName: providerProfiles.displayName,
      dateOfBirth: providerProfiles.dateOfBirth,
      tagline: providerProfiles.tagline,
      ratePerHour: providerProfiles.ratePerHour,
      verificationStatus: providerProfiles.verificationStatus,
      cityName: cities.name,
    })
    .from(providerProfiles)
    .leftJoin(cities, eq(providerProfiles.cityId, cities.id))
    .where(and(...conditions))
    .orderBy(desc(providerProfiles.publishedAt))
    .limit(limit);

  return withPrimaryPhotos(rows);
}

/** Full public profile by slug (only if live). */
export async function getPublicProviderBySlug(slug: string) {
  const [row] = await db
    .select({
      id: providerProfiles.id,
      slug: providerProfiles.slug,
      displayName: providerProfiles.displayName,
      dateOfBirth: providerProfiles.dateOfBirth,
      tagline: providerProfiles.tagline,
      bio: providerProfiles.bio,
      district: providerProfiles.district,
      services: providerProfiles.services,
      languages: providerProfiles.languages,
      ratePerHour: providerProfiles.ratePerHour,
      verificationStatus: providerProfiles.verificationStatus,
      isLive: providerProfiles.isLive,
      cityName: cities.name,
    })
    .from(providerProfiles)
    .leftJoin(cities, eq(providerProfiles.cityId, cities.id))
    .where(and(eq(providerProfiles.slug, slug), eq(providerProfiles.isLive, true)));

  if (!row) return null;

  const [photos, slots] = await Promise.all([
    db
      .select()
      .from(media)
      .where(and(eq(media.providerId, row.id), eq(media.moderationStatus, "approved")))
      .orderBy(asc(media.sortOrder)),
    db
      .select()
      .from(availability)
      .where(eq(availability.providerId, row.id))
      .orderBy(asc(availability.dayOfWeek)),
  ]);

  return { ...row, photos, availability: slots };
}

type Row = {
  id: string;
  slug: string;
  displayName: string;
  dateOfBirth: string;
  tagline: string | null;
  ratePerHour: number | null;
  verificationStatus: string;
  cityName: string | null;
};

async function withPrimaryPhotos(rows: Row[]): Promise<ProviderCardData[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const photos = await db
    .select({ providerId: media.providerId, url: media.url, sortOrder: media.sortOrder })
    .from(media)
    .where(and(inArray(media.providerId, ids), eq(media.moderationStatus, "approved")))
    .orderBy(asc(media.sortOrder));

  const firstPhoto = new Map<string, string>();
  for (const ph of photos) {
    if (!firstPhoto.has(ph.providerId)) firstPhoto.set(ph.providerId, ph.url);
  }

  return rows.map((r) => ({
    slug: r.slug,
    displayName: r.displayName,
    dateOfBirth: r.dateOfBirth,
    tagline: r.tagline,
    ratePerHour: r.ratePerHour,
    cityName: r.cityName,
    photoUrl: firstPhoto.get(r.id) ?? null,
    verified: r.verificationStatus === "verified",
  }));
}
