"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reports, providerProfiles, auditLog } from "@/lib/db/schema";
import { requireUser, requireRole } from "@/lib/auth/permissions";
import { reportSchema, AUTO_SUSPEND_REASONS } from "@/lib/validation/report";

export async function submitReportAction(formData: FormData) {
  const user = await requireUser();
  const returnTo = (formData.get("returnTo") as string) || "/safety";
  const parsed = reportSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(`${returnTo}?report=invalid`);

  const { targetType, targetId, reasonCategory, description } = parsed.data;

  const [report] = await db
    .insert(reports)
    .values({
      reporterId: user.id,
      targetType,
      targetId,
      reasonCategory,
      description: description || null,
    })
    .returning();

  // High-severity categories pull a profile from search immediately, pending review.
  if (targetType === "profile" && (AUTO_SUSPEND_REASONS as readonly string[]).includes(reasonCategory)) {
    await db
      .update(providerProfiles)
      .set({ isLive: false, updatedAt: new Date() })
      .where(eq(providerProfiles.id, targetId));

    await db.insert(auditLog).values({
      actorId: null,
      action: "profile.auto_suspended",
      targetType: "profile",
      targetId,
      metadata: { reportId: report.id, reasonCategory },
    });
  }

  await db.insert(auditLog).values({
    actorId: user.id,
    action: "report.submitted",
    targetType,
    targetId,
    metadata: { reportId: report.id, reasonCategory },
  });

  revalidatePath("/admin/reports");
  revalidatePath("/dashboard/reports");
  redirect(`${returnTo}?report=submitted`);
}

export async function resolveReportAction(formData: FormData) {
  await requireRole("admin");
  const reportId = formData.get("reportId") as string;
  const status = formData.get("status") as "resolved" | "dismissed";
  if (!["resolved", "dismissed"].includes(status)) return;

  await db
    .update(reports)
    .set({ status, resolvedAt: new Date() })
    .where(eq(reports.id, reportId));

  revalidatePath("/admin/reports");
}
