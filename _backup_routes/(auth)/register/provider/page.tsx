import Link from "next/link";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/primitives";
import { ProviderRegisterForm } from "./provider-register-form";

export default function ProviderRegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Register as a provider</h1>
        <p className="text-sm text-muted">
          Create your profile, then submit documents for verification before going live.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-[var(--radius)] border border-app bg-surface-2 p-3 text-xs text-muted">
        <ShieldCheck className="mt-0.5 shrink-0 text-accent" size={16} />
        <span>
          Your profile stays hidden until an admin approves your (mock) ID and ProstSchG
          registration documents. This is a demo — no real documents are checked.
        </span>
      </div>

      <Card>
        <ProviderRegisterForm />
      </Card>
      <p className="text-center text-sm text-muted">
        Looking to book instead?{" "}
        <Link href="/register" className="text-accent hover:underline">
          Create a client account
        </Link>
      </p>
    </div>
  );
}
