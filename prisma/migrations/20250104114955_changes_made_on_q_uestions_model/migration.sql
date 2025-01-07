-- AlterTable
ALTER TABLE "StudentOnAssignment" ADD COLUMN     "submitted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "StudentOnProjectWork" ADD COLUMN     "submitted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "StudentsOnExercise" ADD COLUMN     "submitted" BOOLEAN NOT NULL DEFAULT false;
