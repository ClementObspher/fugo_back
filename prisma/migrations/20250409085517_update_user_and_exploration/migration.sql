/*
  Warnings:

  - The `dangers` column on the `Spot` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `jobs` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Equipment" AS ENUM ('MASK', 'SNORKEL', 'FINS', 'WETSUIT', 'DIVE_LIGHTS', 'DIVING_BOOTS', 'DIVING_GLOVES', 'FLASHLIGHT', 'WEIGHT_BELT');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('EXCELLENT', 'GOOD', 'AVERAGE', 'TIRED', 'INJURED', 'SICK', 'RECOVERING', 'EXHAUSTED');

-- CreateEnum
CREATE TYPE "SpotDanger" AS ENUM ('STRONG_CURRENTS', 'HIGH_WAVES', 'LOW_VISIBILITY', 'EXTREME_TEMPERATURE', 'DEEP_WATER', 'SHARP_ROCKS_CORALS', 'CAVES_AND_BLUE_HOLES', 'VENOMOUS_FISH', 'SHARKS', 'BOAT_TRAFFIC', 'ACCESSIBILITY');

-- AlterTable
ALTER TABLE "Spot" DROP COLUMN "dangers",
ADD COLUMN     "dangers" "SpotDanger"[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "jobs",
ADD COLUMN     "avatar" TEXT;

-- CreateTable
CREATE TABLE "Exploration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exploration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exploration_userId_spotId_date_key" ON "Exploration"("userId", "spotId", "date");

-- AddForeignKey
ALTER TABLE "Exploration" ADD CONSTRAINT "Exploration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exploration" ADD CONSTRAINT "Exploration_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
