/*
  Warnings:

  - A unique constraint covering the columns `[title,termId,subjectId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Note_title_termId_subjectId_key" ON "Note"("title", "termId", "subjectId");
