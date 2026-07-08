import { z } from "zod";

export const reportSchema = z.object({
  targetType: z.enum(["profile", "message", "user"]),
  targetId: z.string().uuid(),
  reasonCategory: z.enum([
    "suspected_coercion",
    "suspected_minor",
    "missing_registration_proof",
    "harassment",
    "spam",
    "other",
  ]),
  description: z.string().max(1000).optional().or(z.literal("")),
});

export type ReportInput = z.infer<typeof reportSchema>;

/** Categories serious enough to pull the target from search immediately. */
export const AUTO_SUSPEND_REASONS = ["suspected_coercion", "suspected_minor"] as const;
