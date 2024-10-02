-- CreateTable
CREATE TABLE "FinancialCancelationRequests" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "expenditureId" TEXT,
    "granted" BOOLEAN NOT NULL DEFAULT false,
    "deniedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "FinancialCancelationRequests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinancialCancelationRequests_expenditureId_key" ON "FinancialCancelationRequests"("expenditureId");

-- AddForeignKey
ALTER TABLE "FinancialCancelationRequests" ADD CONSTRAINT "FinancialCancelationRequests_expenditureId_fkey" FOREIGN KEY ("expenditureId") REFERENCES "Expenditure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialCancelationRequests" ADD CONSTRAINT "FinancialCancelationRequests_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
