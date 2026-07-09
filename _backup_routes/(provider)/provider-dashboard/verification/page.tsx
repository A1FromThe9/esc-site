import { SealCheck } from "@phosphor-icons/react/dist/ssr";
import { requireRole } from "@/lib/auth/permissions";
import { getMyProviderProfile, getVerificationDocuments } from "@/lib/data/me";
import { Card, Badge } from "@/components/ui/primitives";
import { VerificationForm } from "./verification-form";

const DOC_LABEL: Record<string, string> = {
  id_document: "ID document",
  prostschg_certificate: "ProstSchG certificate",
  health_counseling_proof: "Health counseling proof",
};

const docTone = { pending: "warning", approved: "success", rejected: "danger" } as const;

export default async function VerificationPage() {
  const user = await requireRole("provider");
  const profile = await getMyProviderProfile(user.id);
  if (!profile) return null;
  const docs = await getVerificationDocuments(profile.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Verification</h1>
        <p className="text-sm text-muted">
          Submit your documents. This is a demo — files are not stored or checked.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-[var(--radius)] border border-app bg-surface-2 p-3 text-sm">
        <SealCheck className="text-accent" size={18} />
        <span>
          Current status: <Badge tone={
            profile.verificationStatus === "verified"
              ? "success"
              : profile.verificationStatus === "pending"
                ? "warning"
                : profile.verificationStatus === "rejected"
                  ? "danger"
                  : "neutral"
          }>{profile.verificationStatus}</Badge>
        </span>
      </div>

      {docs.length > 0 && (
        <Card>
          <h2 className="mb-3 font-medium">Submitted documents</h2>
          <ul className="space-y-2">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-fg">{DOC_LABEL[d.type] ?? d.type}</span>
                <div className="flex items-center gap-2">
                  <Badge tone={docTone[d.status]}>{d.status}</Badge>
                  {d.status === "rejected" && d.rejectionReason && (
                    <span className="text-xs text-[var(--color-danger)]">{d.rejectionReason}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <h2 className="mb-3 font-medium">
          {docs.length > 0 ? "Resubmit documents" : "Submit documents"}
        </h2>
        <VerificationForm />
      </Card>
    </div>
  );
}
