/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `FinancialCancelationRequests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FinancialCancelationRequests" ADD COLUMN     "transactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "FinancialCancelationRequests_transactionId_key" ON "FinancialCancelationRequests"("transactionId");

-- AddForeignKey
ALTER TABLE "FinancialCancelationRequests" ADD CONSTRAINT "FinancialCancelationRequests_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
