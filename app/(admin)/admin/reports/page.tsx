import { requireRole } from "@/lib/auth/permissions";
import { getReportsForAdmin } from "@/lib/data/reports";
import { Card, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { resolveReportAction } from "@/app/actions/reports";

const REASON_LABEL: Record<string, string> = {
  suspected_coercion: "Suspected coercion",
  suspected_minor: "Suspected minor",
  missing_registration_proof: "Missing registration proof",
  harassment: "Harassment",
  spam: "Spam",
  other: "Other",
};

const STATUS_TONE = {
  open: "danger",
  investigating: "warning",
  resolved: "success",
  dismissed: "neutral",
} as const;

const SEVERE = new Set(["suspected_coercion", "suspected_minor"]);

export default async function AdminReportsPage() {
  await requireRole("admin");
  const reports = await getReportsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted">
          Coercion or minor reports auto-suspend the target profile from search.
        </p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <p className="text-muted">No reports filed.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium">{r.targetLabel}</h2>
                  <Badge tone={SEVERE.has(r.reasonCategory) ? "danger" : "neutral"}>
                    {REASON_LABEL[r.reasonCategory] ?? r.reasonCategory}
                  </Badge>
                  <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted">Target type: {r.targetType}</p>
                {r.description && <p className="mt-1 text-sm text-muted">&ldquo;{r.description}&rdquo;</p>}
              </div>

              {r.status === "open" && (
                <div className="flex gap-2">
                  <form action={resolveReportAction}>
                    <input type="hidden" name="reportId" value={r.id} />
                    <input type="hidden" name="status" value="resolved" />
                    <Button type="submit" size="sm">
                      Resolve
                    </Button>
                  </form>
                  <form action={resolveReportAction}>
                    <input type="hidden" name="reportId" value={r.id} />
                    <input type="hidden" name="status" value="dismissed" />
                    <Button type="submit" size="sm" variant="secondary">
                      Dismiss
                    </Button>
                  </form>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
