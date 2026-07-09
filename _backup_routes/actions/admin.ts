"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  providerProfiles,
  verificationDocuments,
  moderationQueue,
  auditLog,
  users,
} from "@/lib/db/schema";
import { requireRole } from "@/lib/auth/permissions";

/** Approve a provider's verification: mark docs approved, set verified. */
export async function approveVerificationAction(formData: FormData) {
  const admin = await requireRole("admin");
  const providerId = formData.get("providerId") as string;
  if (!providerId) return;

  await db
    .update(verificationDocuments)
    .set({ status: "approved", reviewedBy: admin.id, reviewedAt: new Date() })
    .where(eq(verificationDocuments.providerId, providerId));

  await db
    .update(providerProfiles)
    .set({ verificationStatus: "verified", updatedAt: new Date() })
    .where(eq(providerProfiles.id, providerId));

  await db
    .update(moderationQueue)
    .set({ status: "approved", assignedAdmin: admin.id, resolvedAt: new Date() })
    .where(
      and(
        eq(moderationQueue.targetType, "profile"),
        eq(moderationQueue.targetId, providerId),
        eq(moderationQueue.status, "pending"),
      ),
    );

  await db.insert(auditLog).values({
    actorId: admin.id,
    action: "verification.approved",
    targetType: "profile",
    targetId: providerId,
  });

  revalidatePath("/admin/verification");
  revalidatePath("/admin");
}

/** Suspend or reinstate a user account (trust & safety action). */
export async function setUserStatusAction(formData: FormData) {
  const admin = await requireRole("admin");
  const userId = formData.get("userId") as string;
  const status = formData.get("status") as "active" | "suspended" | "banned";
  if (!["active", "suspended", "banned"].includes(status)) return;
  if (userId === admin.id) return; // can't act on yourself

  await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, userId));

  await db.insert(auditLog).values({
    actorId: admin.id,
    action: `user.status_${status}`,
    targetType: "user",
    targetId: userId,
  });

  revalidatePath("/admin/users");
}

/** Reject a provider's verification with a reason. */
export async function rejectVerificationAction(formData: FormData) {
  const admin = await requireRole("admin");
  const providerId = formData.get("providerId") as string;
  const reason = (formData.get("reason") as string) || "Documents did not meet requirements.";
  if (!providerId) return;

  await db
    .update(verificationDocuments)
    .set({
      status: "rejected",
      reviewedBy: admin.id,
      reviewedAt: new Date(),
      rejectionReason: reason,
    })
    .where(eq(verificationDocuments.providerId, providerId));

  await db
    .update(providerProfiles)
    .set({ verificationStatus: "rejected", isLive: false, updatedAt: new Date() })
    .where(eq(providerProfiles.id, providerId));

  await db
    .update(moderationQueue)
    .set({
      status: "rejected",
      assignedAdmin: admin.id,
      notes: reason,
      resolvedAt: new Date(),
    })
    .where(
      and(
        eq(moderationQueue.targetType, "profile"),
        eq(moderationQueue.targetId, providerId),
        eq(moderationQueue.status, "pending"),
      ),
    );

  await db.insert(auditLog).values({
    actorId: admin.id,
    action: "verification.rejected",
    targetType: "profile",
    targetId: providerId,
    metadata: { reason },
  });

  revalidatePath("/admin/verification");
  revalidatePath("/admin");
}
