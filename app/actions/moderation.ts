"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { moderationQueue, auditLog } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth/permissions";

export async function resolveModerationItemAction(formData: FormData) {
  const admin = await requireRole("admin");
  const itemId = formData.get("itemId") as string;
  const status = formData.get("status") as "approved" | "rejected";
  if (!["approved", "rejected"].includes(status)) return;

  const [item] = await db
    .update(moderationQueue)
    .set({ status, assignedAdmin: admin.id, resolvedAt: new Date() })
    .where(eq(moderationQueue.id, itemId))
    .returning();
  if (!item) return;

  await db.insert(auditLog).values({
    actorId: admin.id,
    action: `moderation.${status}`,
    targetType: item.targetType,
    targetId: item.targetId,
    metadata: { moderationItemId: item.id },
  });

  revalidatePath("/admin/moderation-queue");
}
