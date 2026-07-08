"use client";

import { useActionState } from "react";
import { registerClientAction, type FormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/primitives";

export function ClientRegisterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    registerClientAction,
    undefined,
  );
  const fe = state?.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      <Field label="Display name" htmlFor="displayName" error={fe.displayName}>
        <Input id="displayName" name="displayName" required />
      </Field>
      <Field label="Email" htmlFor="email" error={fe.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" htmlFor="password" error={fe.password} hint="At least 8 characters">
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
      </Field>

      <label className="flex items-start gap-2 text-sm text-muted">
        <input type="checkbox" name="confirmAge" className="mt-0.5 accent-[var(--color-accent)]" />
        <span>I confirm I am at least 18 years old.</span>
      </label>
      {fe.confirmAge && <p className="text-xs text-[var(--color-danger)]">{fe.confirmAge}</p>}

      <label className="flex items-start gap-2 text-sm text-muted">
        <input type="checkbox" name="acceptTos" className="mt-0.5 accent-[var(--color-accent)]" />
        <span>
          I accept the <a href="/legal/terms" className="text-accent hover:underline">Terms</a> and{" "}
          <a href="/legal/privacy" className="text-accent hover:underline">Privacy Policy</a>.
        </span>
      </label>
      {fe.acceptTos && <p className="text-xs text-[var(--color-danger)]">{fe.acceptTos}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
