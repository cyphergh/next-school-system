/*
  Warnings:

  - Added the required column `totalStudents` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalStudents` to the `ProjectWork` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "totalMarked" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalStudents" INTEGER NOT NULL,
ADD COLUMN     "totalSubmissions" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProjectWork" ADD COLUMN     "totalMarked" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalStudents" INTEGER NOT NULL,
ADD COLUMN     "totalSubmissions" INTEGER NOT NULL DEFAULT 0;
