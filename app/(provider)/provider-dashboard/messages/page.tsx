import { requireRole } from "@/lib/auth/permissions";
import { getMyProviderProfile } from "@/lib/data/me";
import { getProviderConversations } from "@/lib/data/messaging";
import { ConversationList } from "@/components/messaging/conversation-list";
import { Card } from "@/components/ui/primitives";

export default async function ProviderMessagesPage() {
  const user = await requireRole("provider");
  const profile = await getMyProviderProfile(user.id);
  if (!profile) return <Card><p className="text-muted">Profile not found.</p></Card>;

  const conversations = await getProviderConversations(profile.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-muted">Conversations with clients.</p>
      </div>
      <ConversationList
        items={conversations.map((c) => ({
          id: c.id,
          otherName: c.otherName,
          lastMessageAt: c.lastMessageAt,
        }))}
        basePath="/provider-dashboard/messages"
      />
    </div>
  );
}
