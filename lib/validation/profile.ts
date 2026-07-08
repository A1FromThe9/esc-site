import { z } from "zod";

export const profileEditSchema = z.object({
  tagline: z.string().max(120).optional().or(z.literal("")),
  bio: z.string().max(2000).optional().or(z.literal("")),
  cityId: z.string().uuid().optional().or(z.literal("")),
  district: z.string().max(80).optional().or(z.literal("")),
  services: z.string().max(500).optional().or(z.literal("")), // comma separated
  languages: z.string().max(300).optional().or(z.literal("")), // comma separated
  ratePerHour: z.coerce.number().int().min(0).max(100000).optional(),
});

export type ProfileEditInput = z.infer<typeof profileEditSchema>;

export function splitList(value: string | undefined | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
