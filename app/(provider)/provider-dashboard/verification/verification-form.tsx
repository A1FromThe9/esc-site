"use client";

import { useActionState } from "react";
import { submitVerificationAction, type VerificationState } from "@/app/actions/verification";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/primitives";

const fileClass =
  "block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:text-fg";

export function VerificationForm() {
  const [state, action, pending] = useActionState<VerificationState, FormData>(
    submitVerificationAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      <Field label="ID document (mock)" htmlFor="id_document" hint="Passport or ID card.">
        <input id="id_document" name="id_document" type="file" className={fileClass} />
      </Field>
      <Field
        label="ProstSchG registration certificate (mock)"
        htmlFor="prostschg_certificate"
        hint="Anmeldebescheinigung — required to publish."
      >
        <input
          id="prostschg_certificate"
          name="prostschg_certificate"
          type="file"
          className={fileClass}
        />
      </Field>
      <Field
        label="Health counseling proof (mock)"
        htmlFor="health_counseling_proof"
        hint="Bescheinigung der Gesundheitsberatung."
      >
        <input
          id="health_counseling_proof"
          name="health_counseling_proof"
          type="file"
          className={fileClass}
        />
      </Field>

      {state?.error && <p className="text-sm text-[var(--color-danger)]">{state.error}</p>}
      {state?.ok && (
        <p className="text-sm text-[var(--color-success)]">
          Submitted for review. An admin will approve or reject your documents.
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit for verification"}
      </Button>
    </form>
  );
}
