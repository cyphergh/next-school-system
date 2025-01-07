-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_projectworkId_fkey";

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "exerciseId" DROP NOT NULL,
ALTER COLUMN "assignmentId" DROP NOT NULL,
ALTER COLUMN "projectworkId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_projectworkId_fkey" FOREIGN KEY ("projectworkId") REFERENCES "ProjectWork"("id") ON DELETE SET NULL ON UPDATE CASCADE;
