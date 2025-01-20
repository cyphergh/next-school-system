"use client";
import { ConfirmTransactions } from "@/actions/finance/confirm";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { CFADATA, CFAEXPENSES } from "@/types";
import React, { useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

function UI({ d, ex }: { d: CFADATA; ex: any }) {
  const [data, setData] = useState(d);
  const [expenses, setExpenses] = useState(ex);
  const [search, setSearch] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChanges = async (id: string) => {
    if (!password)
      return toast({
        title: "!Oops",
        description: "Invalid password",
        variant: "destructive",
      });
    setLoading(true);
    const res = await ConfirmTransactions(id, password);
    setLoading(false);
    if (res.error)
      return toast({
        title: "Error",
        description: res.errorMessage,
        variant: "destructive",
      });
    if(res.data){
        setPassword(""),
        setData(res.data.ts);
        setExpenses(res.data.exp);
    }
  };
  return (
    <>
      <AlertDialog open={loading} onOpenChange={setLoading}>
        <AlertDialogContent className="flex flex-col w-full justify-center items-center">
          <InfinitySpin></InfinitySpin>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex flex-1 p-2 flex-col overflow-hidden">
        <Card className="w-full p-4">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
        </Card>
        <div className="flex flex-wrap flex-row flex-1 overflow-scroll p-4 content-start">
          {data
            .filter((s) =>
              (
                s.user?.firstName +
                " " +
                s.user?.lastName +
                " " +
                s.user?.emailAddress +
                " " +
                s.user?.phoneNumber
              )
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((d) => {
              return (
                <div
                  key={d.staffId}
                  className="rounded-md w-full md:w-[350px] p-3 border hover:border-blue-400 flex flex-col gap-y-1"
                >
                  <div className="font-bold capitalize">
                    {d.user?.firstName} {d.user?.lastName}
                  </div>
                  <div>{d.user?.emailAddress}</div>
                  <div>{d.user?.phoneNumber}</div>
                  <div className="ml-4 border p-2 flex justify-between">
                    <div>Payment Received</div>
                    <div>&#8373; {d._sum.amount?.toFixed(2)}</div>
                  </div>
                  <div className="ml-4 border p-2 flex justify-between">
                    <div>Expenditure</div>
                    <div>
                      &#8373;{" "}
                      {expenses
                        .find((e: any) => e.staffId == d.staffId)
                        ._sum.amount?.toFixed(2)}
                    </div>
                  </div>
                  <div className="ml-4 border p-2 flex justify-between  font-bold text-red-600">
                    <div>Balance</div>
                    <div>
                      &#8373;{" "}
                      {(
                        (d._sum.amount ?? 0) -
                        (expenses.find((e: any) => e.staffId == d.staffId)._sum
                          .amount ?? 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Dialog open={show} onOpenChange={setShow}>
                      <DialogTrigger>
                        <Button>Confirm</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm transaction</DialogTitle>
                        </DialogHeader>
                        <div>
                          {" "}
                          Once you enter your password and confirm, the action
                          becomes irreversible, and you acknowledge that you
                          have received an amount of ₵{" "}
                          {(
                            (d._sum.amount ?? 0) -
                            (expenses.find((e: any) => e.staffId === d.staffId)
                              ?._sum.amount ?? 0)
                          ).toFixed(2)}{" "}
                          from {d.user?.firstName} {d.user?.lastName}.{" "}
                        </div>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                        ></Input>
                        <DialogFooter>
                          <Button onClick={()=>handleChanges(d.staffId)}>Confirm</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default UI;
