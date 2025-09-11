"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { WaterIntakeItem } from "./water-intake-item";

type WaterIntake = {
  id: number;
  volumeMl: number;
  takenAt: string; 
  note?: string | null;
};

// TODO: store in db
const DAILY_GOAL_ML = 3000;


function isTodayLocal(iso: string) {
  const d = new Date(iso);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

export function WaterIntakeList() {
  const { data, isLoading, isError } = useQuery<WaterIntake[]>({
    queryKey: ["water-intakes"],
    queryFn: async () => {
      const res = await fetch("/api/water-intake");

      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();
      return data;
    },
    staleTime: 15_000,
  });

  const entries = data ?? [];
  const todayTotal = entries
    .filter((e) => isTodayLocal(e.takenAt))
    .reduce((acc, e) => acc + e.volumeMl, 0);
  const progress = Math.min(100, Math.round((todayTotal / DAILY_GOAL_ML) * 100));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Сегодня</CardTitle>
        <CardDescription>
          {todayTotal} мл / {DAILY_GOAL_ML} мл
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progress} />
          <div className="mt-1 text-xs text-gray-500">{progress}% к цели</div>
        </div>

        <div className="text-sm font-medium mb-2">Последние приёмы</div>
        {isLoading && <div className="text-sm text-gray-500">Загружаю...</div>}
        {isError && <div className="text-sm text-red-500">Ошибка загрузки</div>}
        {!isLoading && entries.length === 0 && (
          <div className="text-sm text-gray-500">Пока нет записей</div>
        )}

        <ul className="space-y-2">
          {entries.map((e) => (
            <WaterIntakeItem key={e.id} entry={e} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
