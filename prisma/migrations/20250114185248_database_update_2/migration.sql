-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_projectWorkId_fkey";

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "assignmentId" DROP NOT NULL,
ALTER COLUMN "exerciseId" DROP NOT NULL,
ALTER COLUMN "projectWorkId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_projectWorkId_fkey" FOREIGN KEY ("projectWorkId") REFERENCES "ProjectWork"("id") ON DELETE SET NULL ON UPDATE CASCADE;
