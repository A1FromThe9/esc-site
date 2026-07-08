import { redirect } from "next/navigation";
import { auth } from "./index";

export type Role = "client" | "provider" | "admin";

export async function getSession() {
  return auth();
}

/** Redirect to login (optionally preserving a return path) if not authenticated. */
export async function requireUser(next?: string) {
  const session = await auth();
  if (!session?.user) {
    redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  }
  return session.user;
}

/**
 * Server-side role gate for pages and server actions — defense in depth on top
 * of middleware. Redirects non-matching roles to their own home.
 */
export async function requireRole(role: Role, next?: string) {
  const user = await requireUser(next);
  if (user.role !== role) {
    redirect(homeForRole(user.role));
  }
  return user;
}

export function homeForRole(role: Role): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "provider":
      return "/provider-dashboard";
    default:
      return "/dashboard";
  }
}
