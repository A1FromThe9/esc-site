import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { homeForRole } from "@/lib/auth/permissions";
import { ButtonLink, Button } from "@/components/ui/button";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-app bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-[var(--color-accent-fg)] text-sm">
            e
          </span>
          <span>
            escort<span className="text-accent">.</span>demo
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/search"
            className="hidden rounded-[var(--radius)] px-3 py-2 text-sm text-muted hover:text-fg sm:block"
          >
            Browse
          </Link>
          <Link
            href="/safety"
            className="hidden rounded-[var(--radius)] px-3 py-2 text-sm text-muted hover:text-fg sm:block"
          >
            Safety
          </Link>

          {user ? (
            <>
              <ButtonLink href={homeForRole(user.role)} variant="secondary" size="sm">
                Dashboard
              </ButtonLink>
              <form action={logoutAction}>
                <Button variant="ghost" size="sm" type="submit">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">
                Sign in
              </ButtonLink>
              <ButtonLink href="/register" variant="primary" size="sm">
                Join
              </ButtonLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
