import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { GeminiSparkle } from "@/components/gemini-sparkle";
import { createClient } from "@/lib/supabase/server";
import { LoginButton } from "@/app/login/login-button";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <>
      <Navbar />
      <main className="relative mx-auto flex w-full max-w-md flex-1 items-center justify-center px-4 py-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        >
          <div className="size-[320px] rounded-full glow-conic" />
        </div>

        <div className="elev-2 w-full rounded-3xl border border-border bg-card p-8 sm:p-10">
          <div className="flex items-center justify-center">
            <GeminiSparkle className="size-10 sparkle-pulse" />
          </div>
          <h1 className="mt-5 text-center font-display text-3xl font-medium tracking-tight">
            Masuk ke <span className="gemini-text">BwAI</span>
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Gunakan akun Google untuk menambah atau merawat karya Anda di
            showcase.
          </p>

          <div className="mt-8">
            <LoginButton />
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Kami hanya menyimpan nama dan alamat email Anda. Dengan masuk, Anda
            setuju karya Anda tampil di showcase publik.
          </p>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-[color:var(--google-blue)] hover:underline"
            >
              ← Kembali ke showcase
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
