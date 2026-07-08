"use client";

import { useActionState } from "react";
import { requestBookingAction, type BookingFormState } from "@/app/actions/bookings";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/primitives";

export function BookingForm({ providerSlug }: { providerSlug: string }) {
  const [state, action, pending] = useActionState<BookingFormState, FormData>(
    requestBookingAction,
    undefined,
  );
  const fe = state?.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="providerSlug" value={providerSlug} />

      <Field label="Date" htmlFor="date" error={fe.date}>
        <Input id="date" name="date" type="date" required />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Start time" htmlFor="startTime" error={fe.startTime}>
          <Input id="startTime" name="startTime" type="time" required />
        </Field>
        <Field label="End time" htmlFor="endTime" error={fe.endTime}>
          <Input id="endTime" name="endTime" type="time" required />
        </Field>
      </div>

      <Field label="Location" htmlFor="locationType" error={fe.locationType}>
        <select
          id="locationType"
          name="locationType"
          defaultValue="incall"
          className="h-10 w-full rounded-[var(--radius)] border border-app bg-surface-2 px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 ring-accent"
        >
          <option value="incall">Incall</option>
          <option value="outcall">Outcall</option>
        </select>
      </Field>

      <Field label="Note (optional)" htmlFor="note" error={fe.note}>
        <Textarea id="note" name="note" rows={3} maxLength={500} />
      </Field>

      {state?.error && <p className="text-sm text-[var(--color-danger)]">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending request…" : "Send booking request"}
      </Button>
    </form>
  );
}
