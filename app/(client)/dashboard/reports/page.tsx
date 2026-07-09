import { requireRole } from "@/lib/auth/permissions";
import { getReportsByReporter } from "@/lib/data/reports";
import { Card, Badge } from "@/components/ui/primitives";

const STATUS_TONE = {
  open: "warning",
  investigating: "warning",
  resolved: "success",
  dismissed: "neutral",
} as const;

export default async function MyReportsPage() {
  const user = await requireRole("client");
  const reports = await getReportsByReporter(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My reports</h1>
        <p className="text-sm text-muted">Reports you&apos;ve filed and their status.</p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <p className="text-muted">You haven&apos;t filed any reports.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-fg">{r.reasonCategory.replace(/_/g, " ")}</p>
                <p className="text-xs text-muted">
                  Filed {new Date(r.createdAt).toLocaleDateString("de-DE")}
                </p>
              </div>
              <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
