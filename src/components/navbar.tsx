import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "@/components/user-menu";
import { GeminiSparkle } from "@/components/gemini-sparkle";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <GeminiSparkle className="size-5 transition-transform group-hover:rotate-12" />
          <GoogleWordmark />
          <span className="hidden text-sm font-medium text-foreground/80 sm:inline">
            Showcase
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink href="/undian">Undian</NavLink>
          {user ? (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <div className="ml-2">
                <UserMenu
                  email={user.email ?? ""}
                  avatarUrl={user.user_metadata?.avatar_url as string | undefined}
                  name={
                    (user.user_metadata?.full_name as string | undefined) ??
                    user.email ??
                    "User"
                  }
                />
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="ml-2 inline-flex h-9 items-center gap-2 rounded-full bg-[color:var(--google-blue)] px-4 text-sm font-medium text-white transition-colors hover:brightness-110"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-[color:var(--paper-soft)] hover:text-foreground"
    >
      {children}
    </Link>
  );
}

export function GoogleWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-2xl font-medium tracking-tight leading-none ${className}`}
    >
      <span style={{ color: "var(--google-blue)" }}>B</span>
      <span style={{ color: "var(--google-red)" }}>w</span>
      <span style={{ color: "var(--google-yellow)" }}>A</span>
      <span style={{ color: "var(--google-green)" }}>I</span>
    </span>
  );
}
