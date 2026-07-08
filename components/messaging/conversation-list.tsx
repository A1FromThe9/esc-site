import Link from "next/link";
import { ChatCircle } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/primitives";

export type ConversationListItem = {
  id: string;
  otherName: string | null;
  lastMessageAt: Date;
};

export function ConversationList({
  items,
  basePath,
}: {
  items: ConversationListItem[];
  basePath: string;
}) {
  if (items.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-2 py-10 text-center">
        <ChatCircle size={28} className="text-muted" />
        <p className="text-sm text-muted">No conversations yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((c) => (
        <Link
          key={c.id}
          href={`${basePath}/${c.id}`}
          className="flex items-center justify-between rounded-[var(--radius)] border border-app bg-surface p-4 transition-colors hover:border-[var(--color-accent)]/50"
        >
          <span className="font-medium text-fg">{c.otherName ?? "Unknown"}</span>
          <span className="text-xs text-muted">
            {new Date(c.lastMessageAt).toLocaleString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </Link>
      ))}
    </div>
  );
}
