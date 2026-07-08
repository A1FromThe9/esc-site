import {
  House,
  UserCircle,
  SealCheck,
  ChatCircle,
  CalendarCheck,
} from "@phosphor-icons/react/dist/ssr";
import { requireRole } from "@/lib/auth/permissions";
import { DashboardShell, type NavItem } from "@/components/layout/dashboard-shell";

const nav: NavItem[] = [
  { href: "/provider-dashboard", label: "Overview", icon: <House size={16} /> },
  { href: "/provider-dashboard/profile/edit", label: "Edit profile", icon: <UserCircle size={16} /> },
  { href: "/provider-dashboard/verification", label: "Verification", icon: <SealCheck size={16} /> },
  { href: "/provider-dashboard/messages", label: "Messages", icon: <ChatCircle size={16} /> },
  { href: "/provider-dashboard/bookings", label: "Bookings", icon: <CalendarCheck size={16} /> },
];

export default async function ProviderLayout({ children }: { children: React.ReactNode }) {
  await requireRole("provider", "/provider-dashboard");
  return (
    <DashboardShell title="Provider" nav={nav}>
      {children}
    </DashboardShell>
  );
}
