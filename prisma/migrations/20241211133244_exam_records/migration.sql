/*
  Warnings:

  - A unique constraint covering the columns `[examId,studentId,subjectId]` on the table `ExamRecords` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExamRecords_examId_studentId_subjectId_key" ON "ExamRecords"("examId", "studentId", "subjectId");
