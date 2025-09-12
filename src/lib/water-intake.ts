import { BASE_URL } from "@/shared/config/constants";
import { WaterIntake } from "@prisma/client";

export async function getWaterIntakes(): Promise<WaterIntake[]> {
  const res = await fetch(`${BASE_URL}/api/water-intake`);

  if (!res.ok) {
    throw new Error("Failed to load water intakes from server");
  }

  const data = await res.json();
  return data;
}
