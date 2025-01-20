"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CompleteFinancialRequest } from "@/types";
import React, { useState } from "react";
import { FaSync } from "react-icons/fa";
import ECR, { TCR } from "./_components/card";

function UI({ requests }: { requests: CompleteFinancialRequest[] }) {
  const [req, setReg] = useState<CompleteFinancialRequest[]>(requests);
  const [search, setSearch] = useState("");
  return (
    <div className="flex-1 p-2 flex flex-col sm:overflow-hidden overflow-scroll">
      <Card className="w-full flex gap-2 p-4 items-center gap-x-4 overflow-y-scroll sm:overflow-hidden shrink-0">
        <FaSync size={25} className="cursor-pointer"></FaSync>
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></Input>
      </Card>
      <div className="flex-1 flex-col flex sm:content-start gap-2 p-2 sm:flex-row sm:flex-wrap sm:overflow-y-scroll">
        {req
          .filter((e) =>
            (e.reason + " " + e.staff.userId + " " + e.staff.firstName+" "+e.staff.lastName+" "+e.staff.phoneNumber+ " "+e.transaction?.transactionType)
              .toLowerCase()
              .includes(search.toLowerCase())
          )
          .map((e) => {
            if (e.transaction)
              return <TCR request={e} setRequest={setReg} key={e.id}></TCR>;
            if (e.expenditure)
              return <ECR request={e} setRequest={setReg} key={e.id}></ECR>;
            return <div key={e.id}></div>;
          })}
      </div>
    </div>
  );
}

export default UI;
