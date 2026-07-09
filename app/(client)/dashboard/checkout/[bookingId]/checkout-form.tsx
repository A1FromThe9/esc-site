"use client";

import { useActionState } from "react";
import { CreditCard } from "@phosphor-icons/react";
import { checkoutAction, type CheckoutState } from "@/app/actions/payments";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/primitives";

export function CheckoutForm({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(
    checkoutAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="bookingId" value={bookingId} />

      <Field label="Card number (mock)" htmlFor="cardNumber" hint="Any digits work — this is a demo.">
        <Input
          id="cardNumber"
          name="cardNumber"
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          defaultValue="4242 4242 4242 4242"
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Expiry" htmlFor="exp">
          <Input id="exp" name="exp" placeholder="12/30" defaultValue="12/30" />
        </Field>
        <Field label="CVC" htmlFor="cvc">
          <Input id="cvc" name="cvc" placeholder="123" defaultValue="123" />
        </Field>
      </div>

      {state?.error && <p className="text-sm text-[var(--color-danger)]">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        <CreditCard size={16} /> {pending ? "Processing (mock)…" : "Pay now (mock)"}
      </Button>
    </form>
  );
}
