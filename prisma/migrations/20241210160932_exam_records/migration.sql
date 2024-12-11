/*
  Warnings:

  - Added the required column `studentId` to the `ExamRecords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamRecords" ADD COLUMN     "studentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ExamRecords" ADD CONSTRAINT "ExamRecords_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
