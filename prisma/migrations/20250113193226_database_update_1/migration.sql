/*
  Warnings:

  - The primary key for the `StudentOnProjectWork` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `projectworkId` on the `StudentOnProjectWork` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `AssessmentScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termId` to the `AssessmentScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectWorkId` to the `StudentOnProjectWork` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudentOnProjectWork" DROP CONSTRAINT "StudentOnProjectWork_projectworkId_fkey";

-- AlterTable
ALTER TABLE "AssessmentScore" ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "termId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StudentOnProjectWork" DROP CONSTRAINT "StudentOnProjectWork_pkey",
DROP COLUMN "projectworkId",
ADD COLUMN     "projectWorkId" TEXT NOT NULL,
ADD CONSTRAINT "StudentOnProjectWork_pkey" PRIMARY KEY ("studentId", "projectWorkId");

-- AddForeignKey
ALTER TABLE "StudentOnProjectWork" ADD CONSTRAINT "StudentOnProjectWork_projectWorkId_fkey" FOREIGN KEY ("projectWorkId") REFERENCES "ProjectWork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentScore" ADD CONSTRAINT "AssessmentScore_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentScore" ADD CONSTRAINT "AssessmentScore_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
