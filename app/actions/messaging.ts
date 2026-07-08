"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { conversations, messages, providerProfiles } from "@/lib/db/schema";
import { requireRole, requireUser } from "@/lib/auth/permissions";
import { findOrCreateConversation, getConversationForParticipant } from "@/lib/data/messaging";
import { containsBannedContent } from "@/lib/moderation/content-policy";

/** Client clicks "Message" on a provider profile -> find-or-create + redirect. */
export async function startConversationAction(formData: FormData) {
  const user = await requireRole("client");
  const providerSlug = formData.get("providerSlug") as string;

  const [profile] = await db
    .select({ id: providerProfiles.id })
    .from(providerProfiles)
    .where(eq(providerProfiles.slug, providerSlug));
  if (!profile) redirect("/search");

  const conv = await findOrCreateConversation(user.id, profile.id);
  redirect(`/dashboard/messages/${conv.id}`);
}

export type SendMessageState = { error?: string } | undefined;

export async function sendMessageAction(
  _prev: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const user = await requireUser();
  const conversationId = formData.get("conversationId") as string;
  const body = ((formData.get("body") as string) || "").trim();
  if (!body) return { error: "Message can't be empty." };
  if (body.length > 4000) return { error: "Message is too long." };

  const access = await getConversationForParticipant(
    conversationId,
    user.id,
    user.role === "provider" ? "provider" : "client",
  );
  if (!access) return { error: "Conversation not found." };

  if (containsBannedContent(body)) {
    return { error: "Message blocked by content policy. Please rephrase." };
  }

  await db.insert(messages).values({ conversationId, senderId: user.id, body });
  await db
    .update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, conversationId));

  revalidatePath(`/dashboard/messages/${conversationId}`);
  revalidatePath(`/provider-dashboard/messages/${conversationId}`);
  return undefined;
}
