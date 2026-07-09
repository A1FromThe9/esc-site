import { Warning } from "@phosphor-icons/react/dist/ssr";

export function DemoBanner() {
  return (
    <div className="w-full border-b border-app bg-accent-soft">
      <div className="mx-auto flex max-w-[1200px] items-center gap-2 px-4 py-2 text-xs text-fg sm:text-sm">
        <Warning weight="fill" className="shrink-0 text-accent" size={16} />
        <span>
          <strong>Portfolio demo</strong> — fictional data, mock payments, no real identity
          verification. Not an operating marketplace.
        </span>
      </div>
    </div>
  );
}
