import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { WaterIntake } from "@prisma/client";

export async function getWaterIntakes(): Promise<WaterIntake[]> {
  const session = await auth();
  const uid = session?.user?.id;

  if (!uid) {
    return [];
  }

  try {
    const waterIntakes = await prisma.waterIntake.findMany({
      where: { userId: uid },
      orderBy: { takenAt: "desc" },
    });
    return waterIntakes;
  } catch (_error) {
    return [];
  }
}
