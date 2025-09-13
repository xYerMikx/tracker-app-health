-- AlterTable
ALTER TABLE "public"."WaterIntake" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "WaterIntake_userId_idx" ON "public"."WaterIntake"("userId");

-- AddForeignKey
ALTER TABLE "public"."WaterIntake" ADD CONSTRAINT "WaterIntake_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
