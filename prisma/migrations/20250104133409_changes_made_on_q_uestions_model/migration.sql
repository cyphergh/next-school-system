/*
  Warnings:

  - Added the required column `totalStudents` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "totalMarked" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalStudents" INTEGER NOT NULL,
ADD COLUMN     "totalSubmissions" INTEGER NOT NULL DEFAULT 0;
