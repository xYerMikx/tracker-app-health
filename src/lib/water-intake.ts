import prisma from "@/lib/prisma";
import { WaterIntake } from "@prisma/client";
import { unstable_cache } from "next/cache";

export const WATER_INTAKE_TAG = "water-intakes";

export const getWaterIntakes = unstable_cache(
  async (): Promise<WaterIntake[]> => {
    try {
      const waterIntakes = await prisma.waterIntake.findMany({
        orderBy: { takenAt: "desc" },
      });

      return waterIntakes;
    } catch (_error) {
      return [];
    }
  },
  ["water-intakes"],
  {
    tags: [WATER_INTAKE_TAG],
    revalidate: 3600,
  }
);
