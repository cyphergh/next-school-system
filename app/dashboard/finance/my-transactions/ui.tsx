"use client";
import PaymentCard from "@/components/transactions/payment";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CompleteTransactionType } from "@/types";
import { Expenditure } from "@prisma/client";
import Link from "next/link";
import React from "react";

function UI({
  trans,
  expenses,
}: {
  trans: CompleteTransactionType[];
  expenses: Expenditure[];
}) {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-scroll sm:overflow-hidden">
      <Card className="p-3">
        <Input placeholder="Search..."></Input>
      </Card>
      <div className="p-4 flex-1 sm:flex sm:overflow-y-scroll sm:flex-wrap sm:content-start gap-2">
        {trans.map((t, i) => {
          if (t.transactionType === "PAYMENT")
            return (
              <Link key={t.id} href={"./my-transactions/" + t.id}>
                <PaymentCard transaction={t}></PaymentCard>;
              </Link>
            );
          return <></>;
        })}
      </div>
    </div>
  );
}

export default UI;
