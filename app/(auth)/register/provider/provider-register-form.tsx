"use client";

import { useActionState } from "react";
import { registerProviderAction, type FormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/primitives";

export function ProviderRegisterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    registerProviderAction,
    undefined,
  );
  const fe = state?.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      <Field label="Working / display name" htmlFor="displayName" error={fe.displayName}>
        <Input id="displayName" name="displayName" required />
      </Field>
      <Field label="Email" htmlFor="email" error={fe.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" htmlFor="password" error={fe.password} hint="At least 8 characters">
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
      </Field>
      <Field
        label="Date of birth"
        htmlFor="dateOfBirth"
        error={fe.dateOfBirth}
        hint="Providers must be at least 21 (ProstSchG registration minimum)."
      >
        <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
      </Field>

      <label className="flex items-start gap-2 text-sm text-muted">
        <input type="checkbox" name="acceptProstschg" className="mt-0.5 accent-[var(--color-accent)]" />
        <span>
          I confirm I hold a valid ProstSchG registration certificate
          (Anmeldebescheinigung) and health-counseling proof, and will upload them for
          verification.
        </span>
      </label>
      {fe.acceptProstschg && (
        <p className="text-xs text-[var(--color-danger)]">{fe.acceptProstschg}</p>
      )}

      <label className="flex items-start gap-2 text-sm text-muted">
        <input type="checkbox" name="acceptTos" className="mt-0.5 accent-[var(--color-accent)]" />
        <span>
          I accept the{" "}
          <a href="/legal/terms" className="text-accent hover:underline">
            Terms
          </a>{" "}
          and content policy (no coercion, no minors, no trafficking).
        </span>
      </label>
      {fe.acceptTos && <p className="text-xs text-[var(--color-danger)]">{fe.acceptTos}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Continue to verification"}
      </Button>
    </form>
  );
}
