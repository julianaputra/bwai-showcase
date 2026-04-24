"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Karya } from "@/lib/types";
import { createKarya, updateKarya } from "@/app/dashboard/actions";

type Props =
  | { mode: "create"; defaultName?: string; onDone?: () => void }
  | { mode: "edit"; karya: Karya; onDone?: () => void };

export function KaryaForm(props: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const initial =
    props.mode === "edit"
      ? {
        title: props.karya.title,
        url: props.karya.url,
        participant_name: props.karya.participant_name,
      }
      : {
        title: "",
        url: "",
        participant_name: props.defaultName ?? "",
      };

  function onSubmit(form: FormData) {
    setError(null);
    startTransition(async () => {
      const action = props.mode === "create" ? createKarya : updateKarya;
      const result = await action(form);
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success(
        props.mode === "create" ? "Karya ditambahkan" : "Karya diperbarui",
      );
      props.onDone?.();
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <Field
        label="Judul karya"
        hint="Maks 120 karakter"
        name="title"
        defaultValue={initial.title}
        placeholder="My Portfolio Gweh"
        maxLength={120}
        required
      />
      <Field
        label="URL website"
        hint="Live link karya Anda"
        name="url"
        type="url"
        defaultValue={initial.url}
        placeholder="https://karya-anda.vercel.app"
        required
      />
      <Field
        label="Nama peserta"
        hint="Nama yang akan ditampilkan publik"
        name="participant_name"
        defaultValue={initial.participant_name}
        placeholder="Nama lengkap"
        maxLength={80}
        required
      />

      {error && (
        <p className="rounded-xl bg-[color:var(--google-red)]/10 px-3 py-2 text-sm text-[color:var(--google-red)]">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        {props.mode === "edit" && props.onDone && (
          <button
            type="button"
            onClick={props.onDone}
            disabled={pending}
            className="inline-flex h-10 items-center rounded-full px-5 text-sm font-medium text-[color:var(--google-blue)] hover:bg-[color:var(--accent)] disabled:opacity-60"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={pending}
          className="elev-1 elev-hover inline-flex h-10 items-center gap-2 rounded-full bg-[color:var(--google-blue)] px-6 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:opacity-60"
        >
          {pending
            ? "Menyimpan…"
            : props.mode === "create"
              ? "Tambahkan"
              : "Simpan"}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  hint?: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
};

function Field({
  label,
  hint,
  name,
  type = "text",
  defaultValue,
  placeholder,
  maxLength,
  required,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors hover:border-foreground/30 focus:border-[color:var(--google-blue)] focus:outline-none focus:ring-2 focus:ring-[color:var(--google-blue)]/30"
      />
      {hint && (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
