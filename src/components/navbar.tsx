import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight">
            BwAI Showcase
          </Link>
          <Link
            href="/undian"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Undian
          </Link>
        </div>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Dashboard
              </Link>
              <UserMenu
                email={user.email ?? ""}
                avatarUrl={user.user_metadata?.avatar_url as string | undefined}
                name={
                  (user.user_metadata?.full_name as string | undefined) ??
                  user.email ??
                  "User"
                }
              />
            </>
          ) : (
            <Link href="/login" className={buttonVariants({ size: "sm" })}>
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
