"use client";
import { Transactions } from "@/actions/finance/transactions";
import TransactionCard from "@/components/transactions/trans_card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CompleteTransactionType } from "@/types";
import { Expenditure } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { IoRefreshCircle } from "react-icons/io5";

function UI({
  trans,
  expenses,
}: {
  trans: CompleteTransactionType[];
  expenses: Expenditure[];
}) {
  const [transaction, setTransactions] =
    useState<CompleteTransactionType[]>(trans);
  const [expenditure, setExpenditure] = useState(expenses);
  const [reloading, setReloading] = useState(false);
  const [type, setType] = useState<"BP" | "EP">("BP");
  const handleReload = async () => {
    try {
      setReloading(true);
      const res = await Transactions();
      if (res.error) throw new Error(res.errorMessage);
      setReloading(false);
      setTransactions(res.transactions ?? trans);
      setExpenditure(res.expenses ?? expenses);
    } catch (error) {
      setReloading(false);
    }
  };
  return (
    <div className="flex-1 flex flex-col pt-2 overflow-y-scroll sm:overflow-hidden w-full">
      <Card className="p-3 flex flex-col sm:flex-row sm:flex-wrap gap-4 items-center">
        <IoRefreshCircle
          onClick={handleReload}
          size={48}
          className={`${reloading ? "animate-spin" : ""} cursor-pointer`}
        ></IoRefreshCircle>
        <div className="font-bold text-xl text-red-600 p-2">
          GH&#8373;{" "}
          {!reloading
            ? transaction
                .filter(
                  (t) =>
                    t.transactionType === "PAYMENT" && t.status !== "APPROVED"
                )
                .reduce((a, b) => a + b.amount, 0)
                .toFixed(2)
            : "..."}
        </div>
        <div className="font-bold text-xl text-purple-600 p-2">
          GH&#8373;{" "}
          {!reloading
            ? expenditure.reduce((a, b) => a + b.amount, 0).toFixed(2)
            : "..."}
        </div>
        <select
          className="block w-full sm:w-auto px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:border-blue-500 dark:focus:border-blue-500"
          value={type}
          onChange={(e) => setType(e.target.value as "BP" | "EP")}
        >
          <option value="BP">Bill And Payments</option>
          <option value="EP">Expenditure</option>
        </select>
        <select className="block w-full sm:w-auto px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring focus:border-blue-500 dark:focus:border-blue-500">
          <option value="">All Transaction</option>
          <option value="expenditure">Pending</option>
          <option value="expenditure">Success</option>
          <option value="expenditure">Approved</option>
        </select>

        <Input className="p-4 h-10" placeholder="Search..."></Input>
      </Card>
      <div className="p-4 gap-y-3 w-full flex flex-col flex-1 sm:flex sm:flex-row sm:overflow-y-scroll sm:flex-wrap sm:content-start gap-2">
        {type === "BP" &&
          transaction.map((t, i) => {
            return (
              <Link key={t.id} href={"./my-transactions/" + t.id}>
                <TransactionCard transaction={t}></TransactionCard>
              </Link>
            );
          })}
        {type === "EP" &&
          expenditure.map((t, i) => {
            return (
              <div key={t.id}>
                <Card className="p-4">
                <div className="font-bold text-lg"> GH&#8373; {t.amount}</div>
                <div className="flex gap-x-2">Date <div>{t.createdAt.toLocaleDateString("en-GB")}</div></div>
                </Card>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default UI;
