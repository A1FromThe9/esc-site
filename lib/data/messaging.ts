import { and, eq, asc, desc, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, messages, providerProfiles, users } from "@/lib/db/schema";

export async function findOrCreateConversation(clientId: string, providerId: string) {
  const [existing] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.clientId, clientId), eq(conversations.providerId, providerId)));
  if (existing) return existing;

  const [created] = await db
    .insert(conversations)
    .values({ clientId, providerId })
    .returning();
  return created;
}

/** Conversations for a client, with the other party (provider) display info. */
export async function getClientConversations(clientId: string) {
  const rows = await db
    .select({
      id: conversations.id,
      lastMessageAt: conversations.lastMessageAt,
      providerId: providerProfiles.id,
      otherName: providerProfiles.displayName,
      otherSlug: providerProfiles.slug,
    })
    .from(conversations)
    .innerJoin(providerProfiles, eq(conversations.providerId, providerProfiles.id))
    .where(eq(conversations.clientId, clientId))
    .orderBy(desc(conversations.lastMessageAt));
  return rows;
}

/** Conversations for a provider (by their providerProfile id), with client display info. */
export async function getProviderConversations(providerId: string) {
  const rows = await db
    .select({
      id: conversations.id,
      lastMessageAt: conversations.lastMessageAt,
      clientId: users.id,
      otherName: users.displayName,
    })
    .from(conversations)
    .innerJoin(users, eq(conversations.clientId, users.id))
    .where(eq(conversations.providerId, providerId))
    .orderBy(desc(conversations.lastMessageAt));
  return rows;
}

export type ConversationAccess = {
  conversation: typeof conversations.$inferSelect;
  otherName: string;
} | null;

/**
 * Load a conversation only if `userId` is a participant (as the client, or as
 * the provider via their linked providerProfile). Returns null otherwise —
 * callers should 404/redirect, never trust the URL alone.
 */
export async function getConversationForParticipant(
  conversationId: string,
  userId: string,
  role: "client" | "provider",
): Promise<ConversationAccess> {
  const [conv] = await db.select().from(conversations).where(eq(conversations.id, conversationId));
  if (!conv) return null;

  if (role === "client") {
    if (conv.clientId !== userId) return null;
    const [provider] = await db
      .select({ displayName: providerProfiles.displayName })
      .from(providerProfiles)
      .where(eq(providerProfiles.id, conv.providerId));
    return { conversation: conv, otherName: provider?.displayName ?? "Provider" };
  }

  // role === "provider": userId must own the providerProfile referenced.
  const [profile] = await db
    .select({ id: providerProfiles.id })
    .from(providerProfiles)
    .where(eq(providerProfiles.userId, userId));
  if (!profile || conv.providerId !== profile.id) return null;

  const [client] = await db
    .select({ displayName: users.displayName })
    .from(users)
    .where(eq(users.id, conv.clientId));
  return { conversation: conv, otherName: client?.displayName ?? "Client" };
}

export async function getMessages(conversationId: string) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));
}

export async function getMessagesSince(conversationId: string, sinceIso: string | null) {
  const conditions = [eq(messages.conversationId, conversationId)];
  if (sinceIso) conditions.push(gt(messages.createdAt, new Date(sinceIso)));
  return db
    .select()
    .from(messages)
    .where(and(...conditions))
    .orderBy(asc(messages.createdAt));
}
