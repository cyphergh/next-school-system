import { GetStudentTransactions } from "@/actions/student/get_transactions";
import PaymentTransactionCard from "@/app/dashboard/finance/payment/components/payment-transaction-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompleteTransactionType } from "@/types";
import React, { useEffect, useState } from "react";
import { FaPrint } from "react-icons/fa";
import { IoPrintOutline } from "react-icons/io5";
import { InfinitySpin } from "react-loader-spinner";

function TransactionsTab({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [transactions, setTransactions] = useState<CompleteTransactionType[]>(
    []
  );
  const [balance, setBalance] = useState(0);
  const getTransactions = async () => {
    setLoading(true);
    try {
      const res = await GetStudentTransactions(studentId);
      setLoading(false);
      setError(res.error);
      setBalance(res.balance);
      setErrorMessage(res.errorMessage);
      if (res.transactions) setTransactions([...res.transactions]);
    } catch (error: any) {
      setLoading(false);
      setError(true);
      setErrorMessage(error.toString());
    }
  };
  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {loading && (
        <div>
          <h1 className="text-xl text-muted-foreground">
            Loading transactions
          </h1>
          <InfinitySpin color="blue"></InfinitySpin>
        </div>
      )}
      {!loading && error && (
        <div className="w-full text-center flex flex-col gap-y-7">
          <h1 className="text-3xl text-muted-foreground text-red-700">!Oops</h1>
          <p>{errorMessage}</p>
          <div>
            <Button onClick={getTransactions} className="p-8">
              Try again
            </Button>
          </div>
        </div>
      )}
      {!loading && !error && (
        <div className="gap-x-4 w-full sm:w-full  flex flex-col">
          <Card className="p-3 flex justify-between items-center">
            <div className="font-bold text-center text-red-600">
              &#8373;{balance}
            </div>
            <Button className="" onClick={getTransactions}>
              Refresh
            </Button>
            <Button className="p-3 rounded-full">
              <IoPrintOutline size={23}></IoPrintOutline>
            </Button>
          </Card>
          <div className="overflow-x-auto font-normal text-sm">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-1">Transaction Type</th>
                  <th className="border p-1">Amount</th>
                  <th className="border p-1">Status</th>
                  <th className="border p-1">Transaction Date</th>
                  <th className="border p-1">Previous Balance</th>
                  <th className="border p-1">Confirmation Status</th>
                  <th className="border p-1">Staff Email</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className={"hover:bg-gray-200 dark:hover:bg-gray-700"}
                  >
                    <td className="border p-1">
                      {transaction.transactionType}
                    </td>
                    <td className="border p-1">{transaction.amount}</td>
                    <td className="border p-1">{transaction.status}</td>
                    <td className="border p-1">
                      {new Date(
                        transaction.transactionDate
                      ).toLocaleDateString()}
                    </td>
                    <td className="border p-1">
                      {transaction.previousBalance}
                    </td>
                    <td className="border p-1">
                      {transaction.status}
                    </td>
                    <td className="border p-1 lowercase">{transaction.staff?.emailAddress}</td>
                  
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default TransactionsTab;
