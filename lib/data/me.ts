import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { providerProfiles, media, verificationDocuments } from "@/lib/db/schema";

/** The signed-in provider's own profile (or null). */
export async function getMyProviderProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(providerProfiles)
    .where(eq(providerProfiles.userId, userId));
  return profile ?? null;
}

export async function getProfilePhotos(providerId: string) {
  return db.select().from(media).where(eq(media.providerId, providerId));
}

export async function getVerificationDocuments(providerId: string) {
  return db
    .select()
    .from(verificationDocuments)
    .where(eq(verificationDocuments.providerId, providerId));
}

/** Publish readiness: verified + has profile content + approved ProstSchG doc. */
export function publishChecklist(
  profile: { verificationStatus: string; bio: string | null; cityId: string | null },
  photoCount: number,
  hasApprovedProstschg: boolean,
) {
  return [
    { label: "Identity & documents verified", done: profile.verificationStatus === "verified" },
    { label: "Approved ProstSchG certificate on file", done: hasApprovedProstschg },
    { label: "City selected", done: !!profile.cityId },
    { label: "Bio added", done: !!profile.bio && profile.bio.length > 20 },
    { label: "At least one photo", done: photoCount > 0 },
  ];
}
