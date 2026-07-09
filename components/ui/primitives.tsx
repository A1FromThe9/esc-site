import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-app bg-surface p-5 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-[var(--radius)] border border-app bg-surface-2 px-3 text-sm text-fg",
        "placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 ring-accent",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-[var(--radius)] border border-app bg-surface-2 px-3 py-2 text-sm text-fg",
        "placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 ring-accent",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-fg", className)} {...props} />;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-muted border-app",
  accent: "bg-accent-soft text-accent border-[var(--color-accent)]/30",
  success: "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/30",
  warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/30",
  danger: "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/30",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  );
}
