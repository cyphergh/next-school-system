import { CompleteTransactionType } from "@/types";
import React from "react";
import { Card } from "../ui/card";

function PaymentCard({
  transaction,
}: {
  transaction: CompleteTransactionType;
}) {
  return (
    <Card className="w-full sm:w-[350px] p-4 flex flex-row justify-between items-center cursor-pointer hover:border hover:border-blue-400">
      <div>
        <div className="font-bold">{transaction.transactionType}</div>
        <div className="flex flex-row gap-x-2">
            <div className="font-bold">Amount</div>
            <div>GH&#8373; {transaction.amount}</div>
            </div>
        <div className="flex flex-row gap-x-2">
            <div className="font-bold">Date</div>
            <div>{transaction.createdAt.toLocaleDateString()}</div>
        </div>
        <div className="flex flex-row gap-x-2">
            <div className="font-bold">Time</div>
            <div>{transaction.createdAt.toLocaleTimeString()}</div>
        </div>
        <div className="flex flex-row gap-x-2">
            <div className="font-bold">ID</div>
            <div className="select-text">{transaction.id}</div>
        </div>
      </div>
      <div className={`w-[30px] h-[30px] rounded-full ${transaction.status==="SUCCESS"&&"bg-purple-900"} ${transaction.status==="APPROVED"&&"bg-green-600"} ${transaction.status==="PENDING"&&"bg-red-600"}`}></div>
    </Card>
  );
}

export default PaymentCard;
