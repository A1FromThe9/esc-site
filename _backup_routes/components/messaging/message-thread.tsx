"use client";

import { useActionState, useEffect, useRef, useState, useCallback } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { sendMessageAction, type SendMessageState } from "@/app/actions/messaging";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { id: string; senderId: string; body: string; createdAt: string };

function mergeUnique(prev: Msg[], fresh: Msg[]): Msg[] {
  if (fresh.length === 0) return prev;
  const seen = new Set(prev.map((m) => m.id));
  const toAdd = fresh.filter((m) => !seen.has(m.id));
  return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
}

export function MessageThread({
  conversationId,
  currentUserId,
  otherName,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  otherName: string;
  initialMessages: Msg[];
}) {
  const [msgs, setMsgs] = useState<Msg[]>(initialMessages);
  const [state, action, pending] = useActionState<SendMessageState, FormData>(
    sendMessageAction,
    undefined,
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lastFetch = useRef<string | null>(initialMessages.at(-1)?.createdAt ?? null);
  const inFlight = useRef(false);
  const wasPending = useRef(false);

  // Single fetch path shared by polling and post-send refresh — guarded
  // against overlap so a slow request can't race a concurrent one and
  // double-append the same message.
  const fetchNew = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const url = new URL(`/api/conversations/${conversationId}/messages`, window.location.origin);
      if (lastFetch.current) url.searchParams.set("since", lastFetch.current);
      const res = await fetch(url);
      if (!res.ok) return;
      const { messages: fresh } = (await res.json()) as { messages: Msg[] };
      if (fresh.length > 0) {
        setMsgs((prev) => mergeUnique(prev, fresh));
        lastFetch.current = fresh.at(-1)!.createdAt;
      }
    } finally {
      inFlight.current = false;
    }
  }, [conversationId]);

  // Poll for new messages every 3s — no persistent socket on this deployment target.
  useEffect(() => {
    const interval = setInterval(fetchNew, 3000);
    return () => clearInterval(interval);
  }, [fetchNew]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  // After a successful send (pending true -> false transition), clear the
  // input and refetch. Skip the initial mount, where pending starts false.
  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      formRef.current?.reset();
      fetchNew();
    }
    wasPending.current = pending;
  }, [pending, state, fetchNew]);

  return (
    <div className="flex h-[60vh] flex-col rounded-[var(--radius)] border border-app bg-surface">
      <div className="border-b border-app px-4 py-3 font-medium">{otherName}</div>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {msgs.length === 0 && (
          <p className="text-center text-sm text-muted">Say hello to start the conversation.</p>
        )}
        {msgs.map((m) => {
          const mine = m.senderId === currentUserId;
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                  mine ? "bg-accent text-[var(--color-accent-fg)]" : "bg-surface-2 text-fg",
                )}
              >
                {m.body}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form ref={formRef} action={action} className="flex items-center gap-2 border-t border-app p-3">
        <input type="hidden" name="conversationId" value={conversationId} />
        <input
          name="body"
          placeholder="Write a message…"
          autoComplete="off"
          className="h-10 flex-1 rounded-[var(--radius)] border border-app bg-surface-2 px-3 text-sm text-fg placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 ring-accent"
        />
        <Button type="submit" size="sm" disabled={pending}>
          <PaperPlaneTilt size={16} />
        </Button>
      </form>
      {state?.error && <p className="px-3 pb-2 text-xs text-[var(--color-danger)]">{state.error}</p>}
    </div>
  );
}
