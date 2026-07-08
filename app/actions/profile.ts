"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { providerProfiles } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth/permissions";
import { profileEditSchema, splitList } from "@/lib/validation/profile";

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
    .where(eq(providerProfiles.userId, user.id));

  revalidatePath("/provider-dashboard");
  revalidatePath("/provider-dashboard/profile/edit");
  return { ok: true };
}
