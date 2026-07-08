import { requireRole } from "@/lib/auth/permissions";
import { getAllUsers } from "@/lib/data/users";
import { Card, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { setUserStatusAction } from "@/app/actions/admin";

const STATUS_TONE = { active: "success", suspended: "warning", banned: "danger" } as const;

export default async function AdminUsersPage() {
  const admin = await requireRole("admin");
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted">Suspend or reinstate accounts.</p>
      </div>

      <div className="overflow-x-auto rounded-[var(--radius)] border border-app">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-app">
                <td className="px-3 py-2">{u.displayName ?? "—"}</td>
                <td className="px-3 py-2 text-muted">{u.email}</td>
                <td className="px-3 py-2">
                  <Badge tone="neutral">{u.role}</Badge>
                </td>
                <td className="px-3 py-2">
                  <Badge tone={STATUS_TONE[u.status]}>{u.status}</Badge>
                </td>
                <td className="px-3 py-2">
                  {u.id === admin.id ? (
                    <span className="text-xs text-muted">You</span>
                  ) : (
                    <div className="flex gap-2">
                      {u.status !== "active" && (
                        <form action={setUserStatusAction}>
                          <input type="hidden" name="userId" value={u.id} />
                          <input type="hidden" name="status" value="active" />
                          <Button type="submit" size="sm" variant="secondary">
                            Reinstate
                          </Button>
                        </form>
                      )}
                      {u.status !== "suspended" && (
                        <form action={setUserStatusAction}>
                          <input type="hidden" name="userId" value={u.id} />
                          <input type="hidden" name="status" value="suspended" />
                          <Button type="submit" size="sm" variant="ghost">
                            Suspend
                          </Button>
                        </form>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Card>
        <p className="text-xs text-muted">
          Suspended users cannot sign in (checked in the credentials login flow).
        </p>
      </Card>
    </div>
  );
}
