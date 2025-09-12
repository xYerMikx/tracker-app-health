"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { Controller, useForm } from "react-hook-form";
import { WaterIntakeInput, waterIntakeSchema } from "../lib/validation-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { TimePicker } from "@/shared/ui/time-picker";
import { formatDateTimeFromIso } from "@/shared/utils/date";

export const WaterIntakeForm = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const formatDate = formatDateTimeFromIso(new Date().toISOString());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm<WaterIntakeInput>({
    resolver: valibotResolver(waterIntakeSchema),
    defaultValues: {
      volumeMl: 250,
      takenAt: formatDate,
      note: "",
    },
  });

  const mutation = useMutation({
    mutationKey: ["add-water-intake"],
    mutationFn: async (data: WaterIntakeInput) => {
      const payload = {
        volumeMl: Number(data.volumeMl),
        takenAt: new Date(data.takenAt).toISOString(),
        note: data.note?.trim(),
      };
      const res = await fetch("/api/water-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Не удалось сохранить запись");

      const mutationRes = await res.json();
      return mutationRes;
    },
    onSuccess: () => {
      setMessage("Запись сохранена");

      const takenAtCurrent = formatDateTimeFromIso(new Date().toISOString());

      queryClient.invalidateQueries({ queryKey: ["water-intakes"] });

      reset({ volumeMl: 250, takenAt: takenAtCurrent, note: "" });
      setTimeout(() => setMessage(null), 2500);
    },
    onError: (err) => {
      setMessage(err?.message ?? "Ошибка сохранения");

      setTimeout(() => setMessage(null), 3000);
    },
  });

  const onSubmit = (data: WaterIntakeInput) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="volumeMl" className="block text-sm mb-1">
          Объём (мл)
        </Label>
        <Input
          id="volumeMl"
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="например, 250"
          {...register("volumeMl", { valueAsNumber: true })}
        />
        {errors.volumeMl && (
          <p className="text-xs text-red-500 mt-1">
            {String(errors.volumeMl.message)}
          </p>
        )}
      </div>

      <div>
        <Label className="block text-sm mb-2">Время</Label>
        <Controller
          control={control}
          name="takenAt"
          render={({ field }) => (
            <TimePicker value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.takenAt && (
          <p className="text-xs text-red-500 mt-1">
            {String(errors.takenAt.message)}
          </p>
        )}
      </div>

      <div>
        <Label className="block text-sm mb-1" htmlFor="note">
          Заметка (опционально)
        </Label>
        <Textarea
          id="note"
          rows={2}
          {...register("note")}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10"
          placeholder="после тренировки, утром и т.п."
        />
        {errors.note && (
          <p className="text-xs text-red-500 mt-1">
            {String(errors.note.message)}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || mutation.isPending}
        className="w-full"
      >
        {mutation.isPending ? "Загрузка..." : "Сохранить"}
      </Button>

      {message && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          {message}
        </div>
      )}
    </form>
  );
};
