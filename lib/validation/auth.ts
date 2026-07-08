import { z } from "zod";
import { ageFromDob } from "../utils";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const clientRegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "At least 8 characters"),
    displayName: z.string().min(2).max(60),
    acceptTos: z.literal("on", { errorMap: () => ({ message: "You must accept the terms" }) }),
    confirmAge: z.literal("on", { errorMap: () => ({ message: "You must confirm you are 18+" }) }),
  })
  .strip();

export const providerRegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "At least 8 characters"),
    displayName: z.string().min(2).max(60),
    dateOfBirth: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date"),
    acceptTos: z.literal("on", { errorMap: () => ({ message: "You must accept the terms" }) }),
    acceptProstschg: z.literal("on", {
      errorMap: () => ({ message: "You must confirm ProstSchG registration" }),
    }),
  })
  .strip()
  .refine((d) => ageFromDob(d.dateOfBirth) >= 21, {
    message: "Providers must be at least 21 (ProstSchG registration minimum)",
    path: ["dateOfBirth"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ClientRegisterInput = z.infer<typeof clientRegisterSchema>;
export type ProviderRegisterInput = z.infer<typeof providerRegisterSchema>;
