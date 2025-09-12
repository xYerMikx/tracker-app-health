import { WaterIntakeForm } from "@/features/water-intake/ui/water-intake-form";
import { WaterIntakeList } from "@/features/water-intake/ui/water-intake-list";
import { getWaterIntakes } from "@/lib/water-intake";
import { NotificationTestButton } from "@/shared/ui/notify-test";
import { WaterIntake } from "@prisma/client";
import { Suspense } from "react";

export default async function Home() {
  const initialIntakeList: WaterIntake[] = await getWaterIntakes();

  return (
    <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm bg-white/60 dark:bg-black/40 backdrop-blur">
          <h1 className="text-xl font-semibold tracking-tight mb-1">
            Water Intake
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Запиши, сколько воды ты выпил
          </p>
          <WaterIntakeForm />
        </div>
        <div className="mt-6">
          <Suspense fallback={<div>Идёт загрузка приёмов воды...</div>}>
            <WaterIntakeList initialIntakeList={initialIntakeList} />
          </Suspense>
        </div>
        <NotificationTestButton />
      </div>
    </main>
  );
}
