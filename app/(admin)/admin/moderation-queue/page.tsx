import { requireRole } from "@/lib/auth/permissions";
import { getPendingModerationItems } from "@/lib/data/moderation";
import { Card, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { resolveModerationItemAction } from "@/app/actions/moderation";

export default async function ModerationQueuePage() {
  await requireRole("admin");
  const items = await getPendingModerationItems();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Moderation queue</h1>
        <p className="text-sm text-muted">
          Profile edits flagged by the content policy scan. Provider verifications are handled on
          the Verification page.
        </p>
      </div>

      <Card className="bg-surface-2 text-sm text-muted">
        <p className="font-medium text-fg">Content policy reference</p>
        <p className="mt-1">
          Prohibited: language suggesting coercion, trafficking, or the involvement of minors.
          Flags are heuristic (keyword-based) — use judgement, not just the match, when deciding.
        </p>
      </Card>

      {items.length === 0 ? (
        <Card>
          <p className="text-muted">Nothing pending review.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium">{item.targetLabel}</h2>
                  <Badge tone="warning">{item.targetType.replace("_", " ")}</Badge>
                </div>
                {item.notes && <p className="mt-1 text-sm text-muted">{item.notes}</p>}
              </div>
              <div className="flex gap-2">
                <form action={resolveModerationItemAction}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <input type="hidden" name="status" value="approved" />
                  <Button type="submit" size="sm">
                    Approve
                  </Button>
                </form>
                <form action={resolveModerationItemAction}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <Button type="submit" size="sm" variant="secondary">
                    Reject
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
