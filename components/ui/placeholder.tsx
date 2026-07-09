import { Wrench } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/primitives";

export function Placeholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <Card className="flex items-start gap-3">
        <Wrench className="mt-0.5 shrink-0 text-accent" size={18} />
        <div>
          <p className="font-medium">Coming in {phase}</p>
          <p className="text-sm text-muted">
            This screen is scaffolded. The feature is planned for {phase} of the build.
          </p>
        </div>
      </Card>
    </div>
  );
}
