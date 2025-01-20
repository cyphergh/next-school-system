import { CompleteTransactionType } from "@/types";
import React from "react";
import { Card } from "../ui/card";

function TransactionCard({
  transaction,
}: {
  transaction: CompleteTransactionType;
}) {
  return (
    <div className="w-full sm:w-[350px] p-4 flex flex-row justify-between items-center ">
      <div className="w-full">
        <div className="font-bold">{transaction.transactionType}</div>
        <div className="flex flex-row gap-x-2">
            <div className="">Amount</div>
            <div>GH&#8373; {transaction.amount}</div>
            </div>
        <div className="flex flex-row gap-x-2">
            <div className="">Date</div>
            <div>{transaction.createdAt.toLocaleDateString("en-GB")}</div>
        </div>
        <div className="flex flex-row gap-x-2">
            <div className="">Time</div>
            <div>{transaction.createdAt.toLocaleTimeString("en-GB")}</div>
        </div>
        <div className="flex flex-row gap-x-2">
            <div className="">Status</div>
            <div className="select-text">{transaction.status}</div>
        </div>
        <hr className="w-full"></hr>
        <div className="w-full text-center">Student Information</div>
        <hr className="w-full"></hr>
        <div className="pl-4 capitalize font-bold">{transaction.student?.firstName} {transaction.student?.lastName}</div>
        <div className="pl-4">{transaction.student?.userId}</div>
        <div className="pl-4 lowercase">{transaction.student?.emailAddress}</div>
      </div>
    {!transaction.cancelationRequest&& <div className={`w-[30px] h-[30px] rounded-full ${transaction.status==="SUCCESS"&&"bg-purple-900"} ${transaction.status==="APPROVED"&&"bg-green-600"} ${transaction.status==="PENDING"&&"bg-red-600"}`}></div>}
    </div>
  );
}

export default TransactionCard;
