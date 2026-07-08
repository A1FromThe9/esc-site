import { requireRole } from "@/lib/auth/permissions";
import { getPendingVerifications } from "@/lib/data/admin";
import { Card, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { approveVerificationAction, rejectVerificationAction } from "@/app/actions/admin";
import { ageFromDob } from "@/lib/utils";

const DOC_LABEL: Record<string, string> = {
  id_document: "ID",
  prostschg_certificate: "ProstSchG cert",
  health_counseling_proof: "Health counseling",
};

export default async function AdminVerificationPage() {
  await requireRole("admin");
  const pending = await getPendingVerifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Verification queue</h1>
        <p className="text-sm text-muted">
          Approve to mark the provider verified. Rejecting keeps them offline.
        </p>
      </div>

      {pending.length === 0 ? (
        <Card>
          <p className="text-muted">No pending verifications. 🎉</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pending.map((p) => (
            <Card key={p.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">
                    {p.displayName}
                    <span className="text-muted">, {ageFromDob(p.dateOfBirth)}</span>
                  </h2>
                  <p className="text-sm text-muted">{p.cityName ?? "No city set"}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.documents.length === 0 && (
                      <span className="text-xs text-[var(--color-danger)]">No documents</span>
                    )}
                    {p.documents.map((d) => (
                      <Badge key={d.id} tone="neutral" title={d.fileUrl}>
                        {DOC_LABEL[d.type] ?? d.type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-2 sm:w-64">
                  <form action={approveVerificationAction}>
                    <input type="hidden" name="providerId" value={p.id} />
                    <Button type="submit" size="sm" className="w-full">
                      Approve
                    </Button>
                  </form>
                  <form action={rejectVerificationAction} className="flex gap-2">
                    <input type="hidden" name="providerId" value={p.id} />
                    <input
                      name="reason"
                      placeholder="Reason"
                      className="h-8 min-w-0 flex-1 rounded-md border border-app bg-surface-2 px-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 ring-accent"
                    />
                    <Button type="submit" size="sm" variant="secondary">
                      Reject
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
