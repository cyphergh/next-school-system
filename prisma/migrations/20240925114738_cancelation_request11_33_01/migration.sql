-- AlterEnum
ALTER TYPE "TransactionStatus" ADD VALUE 'CANCELED';

-- AlterTable
ALTER TABLE "Expenditure" ADD COLUMN     "canceled" BOOLEAN NOT NULL DEFAULT false;
