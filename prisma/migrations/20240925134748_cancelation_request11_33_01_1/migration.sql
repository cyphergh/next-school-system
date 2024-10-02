/*
  Warnings:

  - You are about to drop the column `expenditureId` on the `FinancialCancelationRequests` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `FinancialCancelationRequests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cancelationRequestId]` on the table `Expenditure` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cancelationRequestId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "FinancialCancelationRequests" DROP CONSTRAINT "FinancialCancelationRequests_expenditureId_fkey";

-- DropForeignKey
ALTER TABLE "FinancialCancelationRequests" DROP CONSTRAINT "FinancialCancelationRequests_transactionId_fkey";

-- DropIndex
DROP INDEX "FinancialCancelationRequests_expenditureId_key";

-- DropIndex
DROP INDEX "FinancialCancelationRequests_transactionId_key";

-- AlterTable
ALTER TABLE "Expenditure" ADD COLUMN     "cancelationRequestId" TEXT;

-- AlterTable
ALTER TABLE "FinancialCancelationRequests" DROP COLUMN "expenditureId",
DROP COLUMN "transactionId";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "cancelationRequestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Expenditure_cancelationRequestId_key" ON "Expenditure"("cancelationRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_cancelationRequestId_key" ON "Transaction"("cancelationRequestId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_cancelationRequestId_fkey" FOREIGN KEY ("cancelationRequestId") REFERENCES "FinancialCancelationRequests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenditure" ADD CONSTRAINT "Expenditure_cancelationRequestId_fkey" FOREIGN KEY ("cancelationRequestId") REFERENCES "FinancialCancelationRequests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
