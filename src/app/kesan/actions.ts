"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UpsertKesanResult = { ok: true } | { ok: false; error: string };

export async function upsertKesan(
  formData: FormData
): Promise<UpsertKesanResult> {
  const rawWords = [
    formData.get("word1"),
    formData.get("word2"),
    formData.get("word3"),
  ]
    .map((w) => String(w ?? "").trim().toLowerCase())
    .filter((w) => w.length > 0);

  if (rawWords.length === 0) {
    return { ok: false, error: "Masukkan minimal 1 kata." };
  }

  if (rawWords.some((w) => /\s/.test(w))) {
    return { ok: false, error: "Setiap kata tidak boleh mengandung spasi." };
  }

  if (rawWords.some((w) => w.length > 30)) {
    return { ok: false, error: "Setiap kata maksimal 30 karakter." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Kamu harus login untuk mengirim kesan." };

  // Delete existing words for this user, then insert new ones
  const { error: deleteError } = await supabase
    .from("kesan")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    return { ok: false, error: "Gagal memperbarui. Coba lagi." };
  }

  const { error: insertError } = await supabase
    .from("kesan")
    .insert(rawWords.map((word) => ({ word, user_id: user.id })));

  if (insertError) {
    return { ok: false, error: "Gagal menyimpan. Coba lagi." };
  }

  revalidatePath("/kesan");
  return { ok: true };
}
