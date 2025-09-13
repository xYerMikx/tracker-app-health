"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import {
  formatDateTimeFromIso,
  formatTimeWithoutLocale,
  isTodayLocal,
} from "@/shared/utils/date";
import { Edit3, Trash2, Save, X } from "lucide-react";
import { ConfirmPopover } from "@/shared/ui/confirm-popover";
import { WaterIntake } from "@prisma/client";
import dynamic from "next/dynamic";

const TimePicker = dynamic(
  () => import("@/shared/ui/time-picker").then((module) => module.TimePicker),
  {
    ssr: false,
    loading: () => (
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <Label className="text-xs text-muted-foreground">Дата</Label>
          <Button variant="outline" disabled className="h-9">
            Загрузка...
          </Button>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <Label className="text-xs text-muted-foreground">Время</Label>
          <Input type="time" disabled />
        </div>
      </div>
    ),
  }
);

type Props = { entry: WaterIntake };

export function WaterIntakeItem({ entry }: Props) {
  const canEdit = isTodayLocal(entry.takenAt.toString());
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    volumeMl: entry.volumeMl,
    note: entry.note ?? "",
    takenAtLocal: formatDateTimeFromIso(entry.takenAt.toString()),
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
      <li className="flex items-center justify-between rounded-lg border border-border p-3 bg-card hover:bg-accent/50 transition-colors">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{entry.volumeMl} мл</span>
            {entry.note && (
              <span className="text-muted-foreground text-sm">
                • {entry.note}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {formatTimeWithoutLocale(entry.takenAt.toString())}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!canEdit}
            onClick={() => setEditing(true)}
            title={
              canEdit
                ? "Редактировать"
                : "Редактирование доступно только сегодня"
            }
            className="h-8 w-8 p-0"
          >
            <Edit3 className="size-4" />
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
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-4" />
            </Button>
          </ConfirmPopover>
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-lg border border-border p-4 bg-card space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`volume-${entry.id}`} className="text-sm">
            Объём (мл)
          </Label>
          <Input
            id={`volume-${entry.id}`}
            type="number"
            inputMode="numeric"
            min={1}
            value={form.volumeMl}
            onChange={(e) =>
              setForm((f) => ({ ...f, volumeMl: Number(e.target.value) }))
            }
            className="h-9"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm">Время</Label>
        <TimePicker
          value={form.takenAtLocal}
          onChange={(v) => setForm((f) => ({ ...f, takenAtLocal: v }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`note-${entry.id}`} className="text-sm">
          Заметка
        </Label>
        <Textarea
          id={`note-${entry.id}`}
          rows={2}
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          placeholder="Необязательная заметка..."
          className="resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end pt-2">
        <Button
          variant="outline"
          onClick={() => setEditing(false)}
          className="h-8 px-3"
        >
          <X className="size-3 mr-1" />
          Отмена
        </Button>
        <Button
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
          className="h-8 px-3"
        >
          <Save className="size-3 mr-1" />
          {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </li>
  );
}
