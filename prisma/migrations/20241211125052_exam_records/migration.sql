/*
  Warnings:

  - Added the required column `grade` to the `ExamRecords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `ExamRecords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamRecords" ADD COLUMN     "grade" INTEGER NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "classScore" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "examScore" SET DATA TYPE DOUBLE PRECISION;
