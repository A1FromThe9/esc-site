import { requireRole } from "@/lib/auth/permissions";
import { getRecentAuditLog } from "@/lib/data/audit";
import { Card, Badge } from "@/components/ui/primitives";

export default async function AuditLogPage() {
  await requireRole("admin");
  const entries = await getRecentAuditLog(150);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
        <p className="text-sm text-muted">Every moderation and admin decision, most recent first.</p>
      </div>

      {entries.length === 0 ? (
        <Card>
          <p className="text-muted">No activity yet.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius)] border border-app">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Actor</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Target</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-t border-app">
                  <td className="whitespace-nowrap px-3 py-2 text-muted">
                    {new Date(e.createdAt).toLocaleString("de-DE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-3 py-2">{e.actorLabel}</td>
                  <td className="px-3 py-2">
                    <Badge tone="neutral">{e.action}</Badge>
                  </td>
                  <td className="px-3 py-2 text-muted">
                    {e.targetType ? `${e.targetType}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
