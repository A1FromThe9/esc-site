import Link from "next/link";
import { SealCheck, Flag, ClipboardText } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/primitives";
import { getAdminCounts } from "@/lib/data/admin";

export default async function AdminHome() {
  const counts = await getAdminCounts();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin overview</h1>
        <p className="text-sm text-muted">Trust &amp; safety queues at a glance.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <QueueCard
          href="/admin/verification"
          icon={<SealCheck className="text-accent" size={20} />}
          label="Pending verifications"
          value={counts.pendingVerifications}
        />
        <QueueCard
          href="/admin/moderation-queue"
          icon={<ClipboardText className="text-accent" size={20} />}
          label="Moderation items"
          value={counts.pendingModeration}
        />
        <QueueCard
          href="/admin/reports"
          icon={<Flag className="text-accent" size={20} />}
          label="Open reports"
          value={counts.openReports}
        />
      </div>
    </div>
  );
}

function QueueCard({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:border-[var(--color-accent)]/50">
        <div className="mb-2">{icon}</div>
        <p className="text-3xl font-semibold">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </Card>
    </Link>
  );
}
