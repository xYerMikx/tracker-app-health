import { number, object, string, optional, minValue, pipe, InferInput } from "valibot";

export const waterIntakeSchema = object({
  volumeMl: pipe(number("Введите число"), minValue(1, "Минимум 1 мл")),
  takenAt: string(),
  note: optional(string()),
});

export type  WaterIntakeInput = InferInput<typeof waterIntakeSchema>;