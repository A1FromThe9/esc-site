import { Flag } from "@phosphor-icons/react/dist/ssr";
import { submitReportAction } from "@/app/actions/reports";

const REASONS: { value: string; label: string }[] = [
  { value: "suspected_coercion", label: "Suspected coercion" },
  { value: "suspected_minor", label: "Suspected minor" },
  { value: "missing_registration_proof", label: "Missing registration proof" },
  { value: "harassment", label: "Harassment" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Other" },
];

export function ReportForm({
  targetType,
  targetId,
  returnTo,
  label = "Report",
}: {
  targetType: "profile" | "message" | "user";
  targetId: string;
  returnTo: string;
  label?: string;
}) {
  return (
    <details className="group text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-muted hover:text-fg">
        <Flag size={14} /> {label}
      </summary>
      <form
        action={submitReportAction}
        className="mt-3 space-y-3 rounded-[var(--radius)] border border-app bg-surface-2 p-3"
      >
        <input type="hidden" name="targetType" value={targetType} />
        <input type="hidden" name="targetId" value={targetId} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <select
          name="reasonCategory"
          required
          className="h-9 w-full rounded-md border border-app bg-surface px-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 ring-accent"
        >
          <option value="">Select a reason…</option>
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          rows={3}
          maxLength={1000}
          placeholder="Additional details (optional)"
          className="w-full rounded-md border border-app bg-surface px-2 py-1.5 text-sm text-fg placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 ring-accent"
        />

        <button
          type="submit"
          className="h-8 rounded-[var(--radius)] bg-[var(--color-danger)] px-3 text-xs font-medium text-black hover:opacity-90"
        >
          Submit report
        </button>
        <p className="text-xs text-muted">
          Reports of suspected coercion or minors immediately hide the profile pending review.
        </p>
      </form>
    </details>
  );
}
