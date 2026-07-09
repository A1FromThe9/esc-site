import { House, ChatCircle, CalendarCheck, Flag } from "@phosphor-icons/react/dist/ssr";
import { requireRole } from "@/lib/auth/permissions";
import { DashboardShell, type NavItem } from "@/components/layout/dashboard-shell";

const nav: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: <House size={16} /> },
  { href: "/dashboard/messages", label: "Messages", icon: <ChatCircle size={16} /> },
  { href: "/dashboard/bookings", label: "Bookings", icon: <CalendarCheck size={16} /> },
  { href: "/dashboard/reports", label: "My reports", icon: <Flag size={16} /> },
];

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  await requireRole("client", "/dashboard");
  return (
    <DashboardShell title="Client" nav={nav}>
      {children}
    </DashboardShell>
  );
}
