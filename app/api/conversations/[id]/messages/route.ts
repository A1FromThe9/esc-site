import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getConversationForParticipant, getMessagesSince } from "@/lib/data/messaging";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const role = session.user.role === "provider" ? "provider" : "client";
  const access = await getConversationForParticipant(id, session.user.id, role);
  if (!access) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const since = new URL(req.url).searchParams.get("since");
  const msgs = await getMessagesSince(id, since);
  return NextResponse.json({ messages: msgs });
}
