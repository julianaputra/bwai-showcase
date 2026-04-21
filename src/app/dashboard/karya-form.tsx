"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      toast.success(props.mode === "create" ? "Karya ditambahkan" : "Karya diperbarui");
      props.onDone?.();
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Judul karya</Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={120}
          defaultValue={initial.title}
          placeholder="Contoh: Resep Masakan Nusantara"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="url">URL website</Label>
        <Input
          id="url"
          name="url"
          required
          type="url"
          defaultValue={initial.url}
          placeholder="https://karya-anda.vercel.app"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="participant_name">Nama peserta</Label>
        <Input
          id="participant_name"
          name="participant_name"
          required
          maxLength={80}
          defaultValue={initial.participant_name}
          placeholder="Nama lengkap"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Menyimpan..."
            : props.mode === "create"
              ? "Tambahkan"
              : "Simpan perubahan"}
        </Button>
      </div>
    </form>
  );
}
