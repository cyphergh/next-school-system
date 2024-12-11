/*
  Warnings:

  - A unique constraint covering the columns `[title,termId]` on the table `Examination` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Examination" ADD COLUMN     "open" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ExamRecords" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "classScore" INTEGER NOT NULL,
    "examScore" INTEGER NOT NULL,
    "Remark" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ExamRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Examination_title_termId_key" ON "Examination"("title", "termId");

-- AddForeignKey
ALTER TABLE "ExamRecords" ADD CONSTRAINT "ExamRecords_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Examination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRecords" ADD CONSTRAINT "ExamRecords_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
