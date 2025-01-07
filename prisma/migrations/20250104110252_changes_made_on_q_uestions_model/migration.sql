/*
  Warnings:

  - Changed the type of `type` on the `Assignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `StudentOnProjectWork` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AssType" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "type",
ADD COLUMN     "type" "AssType" NOT NULL;

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "type",
ADD COLUMN     "type" "AssType" NOT NULL,
ALTER COLUMN "totalScore" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "StudentOnProjectWork" DROP COLUMN "type",
ADD COLUMN     "type" "AssType" NOT NULL;

-- DropEnum
DROP TYPE "Asstype";
