"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileFormState } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/primitives";

type City = { id: string; name: string };

export function ProfileForm({
  cities,
  initial,
}: {
  cities: City[];
  initial: {
    tagline: string;
    bio: string;
    cityId: string;
    district: string;
    services: string;
    languages: string;
    ratePerHour: string;
  };
}) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    updateProfileAction,
    undefined,
  );
  const fe = state?.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      <Field label="Tagline" htmlFor="tagline" error={fe.tagline} hint="One-line summary shown on cards.">
        <Input id="tagline" name="tagline" defaultValue={initial.tagline} maxLength={120} />
      </Field>

      <Field label="City" htmlFor="cityId" error={fe.cityId}>
        <select
          id="cityId"
          name="cityId"
          defaultValue={initial.cityId}
          className="h-10 w-full rounded-[var(--radius)] border border-app bg-surface-2 px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 ring-accent"
        >
          <option value="">Select a city…</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="District (optional)" htmlFor="district" error={fe.district}>
        <Input id="district" name="district" defaultValue={initial.district} />
      </Field>

      <Field label="Bio" htmlFor="bio" error={fe.bio}>
        <Textarea id="bio" name="bio" rows={5} defaultValue={initial.bio} maxLength={2000} />
      </Field>

      <Field
        label="Services"
        htmlFor="services"
        error={fe.services}
        hint="Comma separated, e.g. Dinner dates, Events, Travel companion"
      >
        <Input id="services" name="services" defaultValue={initial.services} />
      </Field>

      <Field
        label="Languages"
        htmlFor="languages"
        error={fe.languages}
        hint="Comma separated, e.g. Deutsch, English"
      >
        <Input id="languages" name="languages" defaultValue={initial.languages} />
      </Field>

      <Field label="Rate per hour (EUR)" htmlFor="ratePerHour" error={fe.ratePerHour}>
        <Input
          id="ratePerHour"
          name="ratePerHour"
          type="number"
          min={0}
          defaultValue={initial.ratePerHour}
        />
      </Field>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        {state?.ok && <span className="text-sm text-[var(--color-success)]">Saved.</span>}
      </div>
    </form>
  );
}
