"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { TimePicker } from "@/shared/ui/time-picker";
import { formatDateTimeFromIso, isTodayLocal } from "@/shared/utils/date";
import { Edit3, Trash2, Save, X } from "lucide-react";
import { ConfirmPopover } from "@/shared/ui/confirm-popover";

export type WaterIntake = {
  id: number;
  volumeMl: number;
  takenAt: string; 
  note?: string | null;
};

export function WaterIntakeItem({ entry }: { entry: WaterIntake }) {
  const canEdit = isTodayLocal(entry.takenAt);
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    volumeMl: entry.volumeMl,
    note: entry.note ?? "",
    takenAtLocal: formatDateTimeFromIso(entry.takenAt),
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-water-intake", entry.id],
    mutationFn: async () => {
      const res = await fetch("/api/water-intake", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id }),
      });

      if (!res.ok) throw new Error("Не удалось удалить запись");

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water-intakes"] });
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["update-water-intake", entry.id],
    mutationFn: async () => {
      const payload = {
        id: entry.id,
        volumeMl: Number(form.volumeMl),
        note: form.note?.trim() || undefined,
        takenAt: new Date(form.takenAtLocal).toISOString(),
      };
      const res = await fetch("/api/water-intake", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Не удалось обновить запись");

      return res.json();
    },
    onSuccess: () => {
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["water-intakes"] });
    },
  });

  if (!editing) {
    return (
      <li className="flex items-start justify-between rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2">
        <div>
          <div className="text-sm">
            <span className="font-semibold">{entry.volumeMl} мл</span>
            {entry.note ? <span className="text-gray-500"> · {entry.note}</span> : null}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(entry.takenAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!canEdit}
            onClick={() => setEditing(true)}
            title={canEdit ? "Редактировать" : "Редактирование доступно только сегодня"}
          >
            <Edit3 className="size-4" />
            Редактировать
          </Button>
          <ConfirmPopover
            title="Удалить запись?"
            description="Действие необратимо."
            confirmText="Удалить"
            onConfirm={() => deleteMutation.mutate()}
            disabled={!canEdit || deleteMutation.isPending}
          >
            <Button
              variant="ghost"
              size="sm"
              disabled={!canEdit || deleteMutation.isPending}
              title={canEdit ? "Удалить" : "Удаление доступно только сегодня"}
            >
              <Trash2 className="size-4" />
              Удалить
            </Button>
          </ConfirmPopover>
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div>
          <Label htmlFor={`volume-${entry.id}`} className="block text-xs mb-1 text-gray-500">Объём (мл)</Label>
          <Input
            id={`volume-${entry.id}`}
            type="number"
            inputMode="numeric"
            min={1}
            value={form.volumeMl}
            onChange={(e) => setForm((f) => ({ ...f, volumeMl: Number(e.target.value) }))}
          />
        </div>
        <div>
          <Label className="block text-xs mb-1 text-gray-500">Время</Label>
          <TimePicker
            value={form.takenAtLocal}
            onChange={(v) => setForm((f) => ({ ...f, takenAtLocal: v }))}
          />
        </div>
        <div>
          <Label htmlFor={`note-${entry.id}`} className="block text-xs mb-1 text-gray-500">Заметка</Label>
          <Textarea
            id={`note-${entry.id}`}
            rows={1}
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          />
        </div>
      </div>
      <div className="mt-3 flex gap-2 justify-end">
        <Button variant="ghost" onClick={() => setEditing(false)}>
          <X className="size-4" />
          Отмена
        </Button>
        <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
          <Save className="size-4" />
          Сохранить
        </Button>
      </div>
    </li>
  );
}
