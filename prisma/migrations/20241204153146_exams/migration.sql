/*
  Warnings:

  - Added the required column `classScorePercent` to the `Examination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classScoreSource` to the `Examination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimumExamScore` to the `Examination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showGrade` to the `Examination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showPosition` to the `Examination` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClassScoreSource" AS ENUM ('System', 'Manual', 'Full');

-- AlterTable
ALTER TABLE "Examination" ADD COLUMN     "classScorePercent" INTEGER NOT NULL,
ADD COLUMN     "classScoreSource" "ClassScoreSource" NOT NULL,
ADD COLUMN     "minimumExamScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "showGrade" BOOLEAN NOT NULL,
ADD COLUMN     "showPosition" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "ExaminationSubjects" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "ExaminationSubjects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExaminationSubjects" ADD CONSTRAINT "ExaminationSubjects_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Examination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExaminationSubjects" ADD CONSTRAINT "ExaminationSubjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
