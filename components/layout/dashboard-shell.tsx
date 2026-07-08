import Link from "next/link";
import type { ReactNode } from "react";

export type NavItem = { href: string; label: string; icon: ReactNode };

export function DashboardShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1200px] gap-6 px-4 py-8 md:grid md:grid-cols-[220px_1fr]">
      <aside className="mb-6 md:mb-0">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-muted">
          {title}
        </p>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-[var(--radius)] px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
