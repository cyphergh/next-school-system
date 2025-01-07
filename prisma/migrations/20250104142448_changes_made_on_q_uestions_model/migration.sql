-- AlterTable
ALTER TABLE "Assignment" ALTER COLUMN "dueDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Exercise" ALTER COLUMN "dueDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProjectWork" ALTER COLUMN "dueDate" DROP NOT NULL;
