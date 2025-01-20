"use client";
import { AcceptRequest } from "@/actions/finance/acceptRequest";
import { DeclinedRequest } from "@/actions/finance/declinedRequest";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CompleteFinancialRequest } from "@/types";
import { set } from "date-fns";
import React, { Dispatch, SetStateAction, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

export function TCR({
  request,
  setRequest,
}: {
  request: CompleteFinancialRequest;
  setRequest: Dispatch<SetStateAction<CompleteFinancialRequest[]>>;
}) {
  const [openDeclined, setOpenDeclined] = React.useState(false);
  const [openAccept, setOpenAccept] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [password,setPassword] = React.useState("");
  const { toast } = useToast();
  const declined = async () => {
    try {
      setLoading(true);
      const res = await DeclinedRequest(request.id,password);
      setLoading(false);
      if (res.error)
        return toast({ title: res.errorMessage, variant: "destructive" });
      if (res.requests) setRequest(res.requests);
      setOpenDeclined(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const accept = async () => {
    try {
      setLoading(true);
      const res = await AcceptRequest(request.id,password);
      setLoading(false);
      if (res.error)
        return toast({ title: res.errorMessage, variant: "destructive" });
      if (res.requests) setRequest(res.requests);
      setPassword("");
      setOpenDeclined(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  return (
    <>
      <Card className="w-full sm:w-[300px] p-2 flex flex-col gap-y-2 cursor-pointer">
        <div className="font-bold p-2">
          {request.transaction?.transactionType}
        </div>
        <hr></hr>
        <div className="border p-2 rounded-sm">
          <div>Request Date</div>
          <div className="pl-4">
            <div className="capitalize">
              {request.createdAt.toLocaleDateString("en-GB")}
            </div>
            <div className="lowercase">
              {request.createdAt.toLocaleTimeString("en-GB")}
            </div>
          </div>
        </div>
        <div className="border p-2 rounded-sm">
          <div className="font-mono font-bold">Staff Info</div>
          <div className="pl-4">
            <div className="capitalize">
              {request.staff.firstName} {request.staff.lastName}
            </div>
            <div className="lowercase">{request.staff.emailAddress}</div>
            <div className="lowercase">{request.staff.phoneNumber}</div>
          </div>
        </div>
        <div className="border p-2 rounded-sm">
          <div className="font-mono font-bold">Transaction Details</div>
          <div className="pl-4">
            <div className="capitalize text-red-500 font-bold">
              &#8373; {request.transaction?.amount}
            </div>
            <div className="lowercase">
              {request.transaction?.createdAt.toLocaleDateString("en-GB")}
            </div>
          </div>
        </div>
        <div className="p-2 flex flex-row justify-between">
          <Button variant="outline" onClick={() => setOpenAccept(true)}>Accept</Button>
          <Button onClick={() => setOpenDeclined(true)}>Declined</Button>
        </div>
      </Card>
      <AlertDialog open={openDeclined} onOpenChange={setOpenDeclined}>
        <AlertDialogContent>
          {loading ? (
            <div className="w-full p-3">
              <InfinitySpin></InfinitySpin>
            </div>
          ) : (
            <>
              <AlertDialogHeader className="font-bold text-lg">
                Are sure you want to declined the request?
              </AlertDialogHeader>
              <p>
                <b>NB:</b> This action can&apos;t be revoke
              </p>
              <Input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Your Password" type="password"></Input>
              <AlertDialogFooter>
                <Button onClick={declined}>Declined</Button>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={openAccept} onOpenChange={setOpenAccept}>
        <AlertDialogContent>
          {loading ? (
            <div className="w-full p-3">
              <InfinitySpin></InfinitySpin>
            </div>
          ) : (
            <>
              <AlertDialogHeader className="font-bold text-lg">
                Are sure you want to accept the request?
              </AlertDialogHeader>
              <p>
                <b>NB:</b> This action can&apos;t be revoke
              </p>
              <Input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Your Password" type="password"></Input>
              <AlertDialogFooter>
                <Button onClick={accept}>Accept</Button>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function ECR({
  request,
  setRequest,
}: {
  request: CompleteFinancialRequest;
  setRequest: Dispatch<SetStateAction<CompleteFinancialRequest[]>>;
}) {
  const [openDeclined, setOpenDeclined] = React.useState(false);
  const [openAccept, setOpenAccept] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [password,setPassword] = useState("");
  const { toast } = useToast();
  const declined = async () => {
    try {
      setLoading(true);
      
      alert(request.id)
      const res = await DeclinedRequest(request.id,password);
      setLoading(false);
      if (res.error)
        return toast({ title: res.errorMessage, variant: "destructive" });
      if (res.requests) setRequest(res.requests);
      setOpenDeclined(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const accept = async () => {
    try {
      setLoading(true);
      const res = await AcceptRequest(request.id,password);
      setLoading(false);
      if (res.error)
        return toast({ title: res.errorMessage, variant: "destructive" });
      if (res.requests) setRequest(res.requests);
      setOpenDeclined(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  return (
    <>
    <Card className="w-full sm:w-[300px] p-2 flex flex-col gap-y-2 cursor-pointer">
      <div className="font-bold p-2">Expenditure</div>
      <hr></hr>
      <div className="border p-2 rounded-sm">
        <div>Request Date</div>
        <div className="pl-4">
          <div className="capitalize">
            {request.createdAt.toLocaleDateString("en-GB")}
          </div>
          <div className="lowercase">
            {request.createdAt.toLocaleTimeString("en-GB")}
          </div>
        </div>
      </div>
      <div className="border p-2 rounded-sm">
        <div className="font-mono font-bold">Staff Info</div>
        <div className="pl-4">
          <div className="capitalize">
            {request.staff.firstName} {request.staff.lastName}
          </div>
          <div className="lowercase">{request.staff.emailAddress}</div>
          <div className="lowercase">{request.staff.phoneNumber}</div>
        </div>
      </div>
      <div className="border p-2 rounded-sm">
        <div className="font-mono font-bold">Expenditure Details</div>
        <div className="pl-4">
          <div className="capitalize text-red-500 font-bold">
            &#8373; {request.expenditure?.amount}
          </div>
          <div className="lowercase">
            {request.expenditure?.createdAt.toLocaleDateString("en-GB")}
          </div>
        </div>
      </div>
      <div className="p-2 flex flex-row justify-between">
          <Button variant="outline" onClick={() => setOpenAccept(true)}>Accept</Button>
          <Button onClick={() => setOpenDeclined(true)}>Declined</Button>
        </div>
      </Card>
      <AlertDialog open={openDeclined} onOpenChange={setOpenDeclined}>
        <AlertDialogContent>
          {loading ? (
            <div className="w-full p-3">
              <InfinitySpin></InfinitySpin>
            </div>
          ) : (
            <>
              <AlertDialogHeader className="font-bold text-lg">
                Are sure you want to declined the request?
              </AlertDialogHeader>
              <p>
                <b>NB:</b> This action can&apos;t be revoke
              </p>
              <Input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Your Password" type="password"></Input>
              <AlertDialogFooter>
                <Button onClick={declined}>Declined</Button>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={openAccept} onOpenChange={setOpenAccept}>
        <AlertDialogContent>
          {loading ? (
            <div className="w-full p-3">
              <InfinitySpin></InfinitySpin>
            </div>
          ) : (
            <>
              <AlertDialogHeader className="font-bold text-lg">
                Are sure you want to accept the request?
              </AlertDialogHeader>
              <p>
                <b>NB:</b> This action can&apos;t be revoke
              </p>
              <Input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Your Password" type="password"></Input>
              <AlertDialogFooter>
                <Button onClick={accept}>Accept</Button>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog> 
</>
  );
}
function DeclineRequest(id: string) {
  throw new Error("Function not implemented.");
}
