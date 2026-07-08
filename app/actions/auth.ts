"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, providerProfiles } from "@/lib/db/schema";
import { signIn, signOut } from "@/lib/auth";
import { clientRegisterSchema, providerRegisterSchema } from "@/lib/validation/auth";
import { slugify } from "@/lib/utils";

export type FormState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

function flatten(err: import("zod").ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path[0]?.toString() ?? "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const next = (formData.get("next") as string) || "/dashboard";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: next,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw err; // redirect() throws internally — let it propagate
  }
  return undefined;
}

export async function registerClientAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = clientRegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const { email, password, displayName } = parsed.data;
  const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
  if (existing.length) return { fieldErrors: { email: "That email is already registered." } };

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    email: email.toLowerCase(),
    passwordHash,
    role: "client",
    displayName,
    ageGateAcceptedAt: new Date(),
  });

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  return undefined;
}

export async function registerProviderAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = providerRegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const { email, password, displayName, dateOfBirth } = parsed.data;
  const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
  if (existing.length) return { fieldErrors: { email: "That email is already registered." } };

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(users)
    .values({
      email: email.toLowerCase(),
      passwordHash,
      role: "provider",
      displayName,
      ageGateAcceptedAt: new Date(),
    })
    .returning();

  // Unpublished, unverified profile created on signup.
  const baseSlug = slugify(displayName) || "profile";
  await db.insert(providerProfiles).values({
    userId: user.id,
    slug: `${baseSlug}-${user.id.slice(0, 6)}`,
    displayName,
    dateOfBirth,
    verificationStatus: "unverified",
    isLive: false,
  });

  await signIn("credentials", { email, password, redirectTo: "/provider-dashboard/verification" });
  return undefined;
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
  redirect("/");
}
