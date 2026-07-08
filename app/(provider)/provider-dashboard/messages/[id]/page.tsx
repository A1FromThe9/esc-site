import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/permissions";
import { getConversationForParticipant, getMessages } from "@/lib/data/messaging";
import { MessageThread } from "@/components/messaging/message-thread";
import { ReportForm } from "@/components/report-form";

export default async function ProviderMessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireRole("provider");
  const access = await getConversationForParticipant(id, user.id, "provider");
  if (!access) notFound();

  const messages = await getMessages(id);

  return (
    <div className="space-y-3">
      <MessageThread
        conversationId={id}
        currentUserId={user.id}
        otherName={access.otherName}
        initialMessages={messages.map((m) => ({
          id: m.id,
          senderId: m.senderId,
          body: m.body,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
      <ReportForm
        targetType="user"
        targetId={access.conversation.clientId}
        returnTo={`/provider-dashboard/messages/${id}`}
        label="Report this client"
      />
    </div>
  );
}
