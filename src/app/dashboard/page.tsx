import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { GeminiSparkle } from "@/components/gemini-sparkle";
import { createClient } from "@/lib/supabase/server";
import { KaryaForm } from "@/app/dashboard/karya-form";
import { KaryaManage } from "@/app/dashboard/karya-manage";
import type { Karya } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("karya")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  const karya = data as Karya | null;

  const defaultName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "";

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex items-start gap-3">
          <GeminiSparkle className="mt-1 size-6 sparkle-pulse" />
          <div>
            <span className="eyebrow">Workspace</span>
            <h1 className="mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              {karya ? (
                <>
                  <span className="gemini-text">Karya</span> Anda
                </>
              ) : (
                <>
                  Tambah <span className="gemini-text">karya</span>
                </>
              )}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              Setiap peserta hanya boleh mendaftarkan satu karya. Anda bebas
              memperbaruinya kapan saja.
            </p>
          </div>
        </div>

        {karya ? (
          <KaryaManage karya={karya} />
        ) : (
          <div className="elev-1 rounded-3xl border border-border surface-container p-6 sm:p-8">
            <KaryaForm mode="create" defaultName={defaultName} />
          </div>
        )}
      </main>
    </>
  );
}
