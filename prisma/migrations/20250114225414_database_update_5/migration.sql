/*
  Warnings:

  - A unique constraint covering the columns `[studentId,submissionId]` on the table `AssessmentScore` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AssessmentScore_studentId_submissionId_key" ON "AssessmentScore"("studentId", "submissionId");
