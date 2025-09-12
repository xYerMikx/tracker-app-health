import prisma from "@/lib/prisma";
import { WaterIntake } from "@prisma/client";

export async function getWaterIntakes(): Promise<WaterIntake[]> {
  try {
    const waterIntakes = await prisma.waterIntake.findMany({
      orderBy: { takenAt: "desc" },
    });

    return waterIntakes;
  } catch (_error) {
    throw new Error("Failed to fetch water intake records");
  }
}
