import { Badge } from "@/components/ui/primitives";

const TONE = {
  requested: "warning",
  confirmed: "accent",
  awaiting_payment: "warning",
  paid: "success",
  declined: "danger",
  cancelled: "neutral",
  completed: "neutral",
} as const;

const LABEL: Record<string, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  awaiting_payment: "Awaiting payment",
  paid: "Paid",
  declined: "Declined",
  cancelled: "Cancelled",
  completed: "Completed",
};

export function BookingStatusBadge({ status }: { status: string }) {
  return <Badge tone={TONE[status as keyof typeof TONE] ?? "neutral"}>{LABEL[status] ?? status}</Badge>;
}
