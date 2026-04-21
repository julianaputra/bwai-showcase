import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
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
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    "";

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Dashboard Karya
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Setiap peserta dapat menambahkan satu karya. Anda bisa mengubah
            atau menghapusnya kapan saja.
          </p>
        </div>

        {karya ? (
          <KaryaManage karya={karya} />
        ) : (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-medium">Tambah karya</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Isi detail website karya Anda.
            </p>
            <KaryaForm mode="create" defaultName={defaultName} />
          </div>
        )}
      </main>
    </>
  );
}
