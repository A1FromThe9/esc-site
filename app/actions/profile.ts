"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { providerProfiles, moderationQueue, auditLog } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth/permissions";
import { profileEditSchema, splitList } from "@/lib/validation/profile";
import { findBannedMatches } from "@/lib/moderation/content-policy";
import { getMyProviderProfile, getProfilePhotos, getVerificationDocuments, publishChecklist } from "@/lib/data/me";

export type ProfileFormState =
  | { ok?: boolean; error?: string; fieldErrors?: Record<string, string> }
  | undefined;

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireRole("provider");

  const parsed = profileEditSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "_";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const d = parsed.data;
  const [profile] = await db
    .select({ id: providerProfiles.id })
    .from(providerProfiles)
    .where(eq(providerProfiles.userId, user.id));
  if (!profile) return { error: "Profile not found." };

  const matches = findBannedMatches(`${d.tagline ?? ""} ${d.bio ?? ""}`);
  if (matches.length > 0) {
    await db.insert(moderationQueue).values({
      targetType: "listing_edit",
      targetId: profile.id,
      submittedBy: user.id,
      status: "pending",
      notes: `Content policy flag: ${matches.join(", ")}`,
    });
    await db.insert(auditLog).values({
      actorId: user.id,
      action: "profile.edit_flagged",
      targetType: "profile",
      targetId: profile.id,
      metadata: { matches },
    });
    revalidatePath("/admin/moderation-queue");
    return {
      fieldErrors: {
        bio: "This edit was flagged by our content policy and held for admin review — it was not published.",
      },
    };
  }

  await db
    .update(providerProfiles)
    .set({
      tagline: d.tagline || null,
      bio: d.bio || null,
      cityId: d.cityId || null,
      district: d.district || null,
      services: splitList(d.services),
      languages: splitList(d.languages),
      ratePerHour: d.ratePerHour ?? null,
      updatedAt: new Date(),
    })
    .where(eq(providerProfiles.id, profile.id));

  await db.insert(auditLog).values({
    actorId: user.id,
    action: "profile.edited",
    targetType: "profile",
    targetId: profile.id,
  });

  revalidatePath("/provider-dashboard");
  revalidatePath("/provider-dashboard/profile/edit");
  return { ok: true };
}

/**
 * Publish gate: verified + approved ProstSchG certificate + complete profile.
 * Re-checked entirely server-side — the client checklist is a preview, not
 * the source of truth.
 */
export async function publishProfileAction() {
  const user = await requireRole("provider");
  const profile = await getMyProviderProfile(user.id);
  if (!profile) return;

  const [photos, docs] = await Promise.all([
    getProfilePhotos(profile.id),
    getVerificationDocuments(profile.id),
  ]);
  const hasApprovedProstschg = docs.some(
    (d) => d.type === "prostschg_certificate" && d.status === "approved",
  );
  const ready = publishChecklist(profile, photos.length, hasApprovedProstschg).every((c) => c.done);
  if (!ready) return;

  await db
    .update(providerProfiles)
    .set({ isLive: true, publishedAt: new Date(), updatedAt: new Date() })
    .where(eq(providerProfiles.id, profile.id));

  await db.insert(auditLog).values({
    actorId: user.id,
    action: "profile.published",
    targetType: "profile",
    targetId: profile.id,
  });

  revalidatePath("/provider-dashboard");
  revalidatePath("/search");
  revalidatePath(`/provider/${profile.slug}`);
}

/** Provider can self-service pause their listing at any time. */
export async function unpublishProfileAction() {
  const user = await requireRole("provider");
  const profile = await getMyProviderProfile(user.id);
  if (!profile) return;

  await db
    .update(providerProfiles)
    .set({ isLive: false, updatedAt: new Date() })
    .where(eq(providerProfiles.id, profile.id));

  await db.insert(auditLog).values({
    actorId: user.id,
    action: "profile.unpublished",
    targetType: "profile",
    targetId: profile.id,
  });

  revalidatePath("/provider-dashboard");
  revalidatePath("/search");
  revalidatePath(`/provider/${profile.slug}`);
}
