/*
  Warnings:

  - You are about to drop the column `city` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Spot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Spot" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "number",
DROP COLUMN "region",
DROP COLUMN "street",
ALTER COLUMN "photos" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "dangers" SET DEFAULT ARRAY[]::"SpotDanger"[];
