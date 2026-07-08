import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe base config. No database or bcrypt access here so it can run in
 * Next.js middleware (edge runtime). The Credentials provider with the
 * `authorize` callback lives in `lib/auth/index.ts` (Node runtime).
 */
export const authConfig = {
  trustHost: true,
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "client" | "provider" | "admin";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
