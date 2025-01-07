/*
  Warnings:

  - You are about to drop the column `projectworkId` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `projectWorkId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_projectworkId_fkey";

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "projectworkId",
ADD COLUMN     "projectWorkId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_projectWorkId_fkey" FOREIGN KEY ("projectWorkId") REFERENCES "ProjectWork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
