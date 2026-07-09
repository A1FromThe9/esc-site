import { requireRole } from "@/lib/auth/permissions";
import { getClientConversations } from "@/lib/data/messaging";
import { ConversationList } from "@/components/messaging/conversation-list";

export default async function ClientMessagesPage() {
  const user = await requireRole("client");
  const conversations = await getClientConversations(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-muted">Your conversations with providers.</p>
      </div>
      <ConversationList
        items={conversations.map((c) => ({
          id: c.id,
          otherName: c.otherName,
          lastMessageAt: c.lastMessageAt,
        }))}
        basePath="/dashboard/messages"
      />
    </div>
  );
}
