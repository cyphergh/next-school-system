/*
  Warnings:

  - Added the required column `topicId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicId` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "topicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "topicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProjectWork" ADD COLUMN     "topicId" TEXT;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectWork" ADD CONSTRAINT "ProjectWork_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
