import Link from "next/link";
import { Suspense } from "react";
import { Card } from "@/components/ui/primitives";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted">Sign in to your account.</p>
      </div>
      <Card>
        <Suspense>
          <LoginForm />
        </Suspense>
      </Card>
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/register" className="text-accent hover:underline">
          Create an account
        </Link>
      </p>
      <div className="rounded-[var(--radius)] border border-app bg-surface-2 p-3 text-xs text-muted">
        <p className="mb-1 font-medium text-fg">Demo logins</p>
        <p>admin@esc-site.demo · client@esc-site.demo · lena@esc-site.demo</p>
        <p>Passwords: admin1234 / client1234 / provider1234</p>
      </div>
    </div>
  );
}
