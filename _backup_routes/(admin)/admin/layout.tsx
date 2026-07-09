import {
  House,
  SealCheck,
  ClipboardText,
  Flag,
  Users,
  ListChecks,
} from "@phosphor-icons/react/dist/ssr";
import { requireRole } from "@/lib/auth/permissions";
import { DashboardShell, type NavItem } from "@/components/layout/dashboard-shell";

const nav: NavItem[] = [
  { href: "/admin", label: "Overview", icon: <House size={16} /> },
  { href: "/admin/verification", label: "Verification", icon: <SealCheck size={16} /> },
  { href: "/admin/moderation-queue", label: "Moderation", icon: <ClipboardText size={16} /> },
  { href: "/admin/reports", label: "Reports", icon: <Flag size={16} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={16} /> },
  { href: "/admin/audit-log", label: "Audit log", icon: <ListChecks size={16} /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin", "/admin");
  return (
    <DashboardShell title="Admin" nav={nav}>
      {children}
    </DashboardShell>
  );
}
