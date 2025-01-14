/*
  Warnings:

  - A unique constraint covering the columns `[studentId,exerciseId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,projectWorkId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,assignmentId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Submission_studentId_exerciseId_key" ON "Submission"("studentId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_studentId_projectWorkId_key" ON "Submission"("studentId", "projectWorkId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_studentId_assignmentId_key" ON "Submission"("studentId", "assignmentId");
