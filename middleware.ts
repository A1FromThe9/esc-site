import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/config";

const { auth } = NextAuth(authConfig);

// Route-group prefix → required role.
const ROLE_GATES: Array<{ prefix: string; role: "client" | "provider" | "admin" }> = [
  { prefix: "/admin", role: "admin" },
  { prefix: "/provider-dashboard", role: "provider" },
  { prefix: "/dashboard", role: "client" },
];

const ROLE_HOME: Record<string, string> = {
  admin: "/admin",
  provider: "/provider-dashboard",
  client: "/dashboard",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const gate = ROLE_GATES.find((g) => pathname.startsWith(g.prefix));
  if (!gate) return NextResponse.next();

  const user = req.auth?.user;

  // Not logged in → send to login with a return path.
  if (!user) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Logged in but wrong role → bounce to their own dashboard.
  if (user.role !== gate.role) {
    return NextResponse.redirect(new URL(ROLE_HOME[user.role] ?? "/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/provider-dashboard/:path*", "/admin/:path*"],
};
