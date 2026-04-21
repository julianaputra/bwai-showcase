"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; error: string };

function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function validate(input: {
  title: string;
  url: string;
  participant_name: string;
}): string | null {
  if (!input.title || input.title.length > 120)
    return "Judul wajib diisi (maks 120 karakter)";
  if (!input.participant_name || input.participant_name.length > 80)
    return "Nama peserta wajib diisi (maks 80 karakter)";
  try {
    const u = new URL(input.url);
    if (!["http:", "https:"].includes(u.protocol)) return "URL tidak valid";
  } catch {
    return "URL tidak valid";
  }
  return null;
}

export async function createKarya(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Tidak terautentikasi" };

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    url: normalizeUrl(String(formData.get("url") ?? "")),
    participant_name: String(formData.get("participant_name") ?? "").trim(),
  };
  const err = validate(payload);
  if (err) return { ok: false, error: err };

  const { error } = await supabase
    .from("karya")
    .insert({ ...payload, user_id: user.id });
  if (error) {
    if (error.code === "23505")
      return { ok: false, error: "Anda sudah memiliki karya terdaftar" };
    return { ok: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateKarya(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Tidak terautentikasi" };

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    url: normalizeUrl(String(formData.get("url") ?? "")),
    participant_name: String(formData.get("participant_name") ?? "").trim(),
  };
  const err = validate(payload);
  if (err) return { ok: false, error: err };

  const { error } = await supabase
    .from("karya")
    .update(payload)
    .eq("user_id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteKarya(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Tidak terautentikasi" };

  const { error } = await supabase
    .from("karya")
    .delete()
    .eq("user_id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true };
}
