"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  providerProfiles,
  verificationDocuments,
  moderationQueue,
  auditLog,
} from "@/lib/db/schema";
import { requireRole } from "@/lib/auth/permissions";

const DOC_TYPES = ["id_document", "prostschg_certificate", "health_counseling_proof"] as const;

export type VerificationState = { ok?: boolean; error?: string } | undefined;

/**
 * Mock document submission. In this demo we do NOT store or inspect real files —
 * we record the chosen filename as a `mock://` URL and queue the profile for
 * admin review. A real build would upload to Vercel Blob and run ID checks.
 */
export async function submitVerificationAction(
  _prev: VerificationState,
  formData: FormData,
): Promise<VerificationState> {
  const user = await requireRole("provider");
  const [profile] = await db
    .select()
    .from(providerProfiles)
    .where(eq(providerProfiles.userId, user.id));
  if (!profile) return { error: "Profile not found." };

  const submitted: { type: (typeof DOC_TYPES)[number]; fileUrl: string }[] = [];
  for (const type of DOC_TYPES) {
    const file = formData.get(type) as File | null;
    if (file && file.size > 0) {
      submitted.push({ type, fileUrl: `mock://${type}/${file.name}` });
    }
  }

  if (submitted.length === 0) {
    return { error: "Please attach at least one document." };
  }

  // Replace any existing pending docs of the same type for a clean resubmit.
  for (const doc of submitted) {
    await db
      .delete(verificationDocuments)
      .where(
        and(
          eq(verificationDocuments.providerId, profile.id),
          eq(verificationDocuments.type, doc.type),
        ),
      );
    await db.insert(verificationDocuments).values({
      providerId: profile.id,
      type: doc.type,
      fileUrl: doc.fileUrl,
      status: "pending",
    });
  }

  await db
    .update(providerProfiles)
    .set({ verificationStatus: "pending", updatedAt: new Date() })
    .where(eq(providerProfiles.id, profile.id));

  // Queue for admin review (one open item per profile).
  const existing = await db
    .select()
    .from(moderationQueue)
    .where(
      and(
        eq(moderationQueue.targetType, "profile"),
        eq(moderationQueue.targetId, profile.id),
        eq(moderationQueue.status, "pending"),
      ),
    );
  if (existing.length === 0) {
    await db.insert(moderationQueue).values({
      targetType: "profile",
      targetId: profile.id,
      submittedBy: user.id,
      status: "pending",
    });
  }

  await db.insert(auditLog).values({
    actorId: user.id,
    action: "verification.submitted",
    targetType: "profile",
    targetId: profile.id,
    metadata: { documents: submitted.map((d) => d.type) },
  });

  revalidatePath("/provider-dashboard/verification");
  revalidatePath("/provider-dashboard");
  revalidatePath("/admin/verification");
  return { ok: true };
}
