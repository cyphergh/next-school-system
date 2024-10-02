import { RequestTransactionCancelation } from "@/actions/finance/cancelation_request";
import { RevokeTransactionCancelation } from "@/actions/finance/revoke_cancelation";
import TransactionCard from "@/components/transactions/trans_card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CompleteTransactionType } from "@/types";
import Link from "next/link";
import React, { useState } from "react";
import { InfinitySpin, Circles } from "react-loader-spinner";

function TCard({
  t,
  setTransactions,
}: {
  t: CompleteTransactionType;
  setTransactions: React.Dispatch<
    React.SetStateAction<CompleteTransactionType[]>
  >;
}) {
  const [cancelling, setCancelling] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const { toast } = useToast();
  const cancel = async () => {
    try {
      setCancelling(true);
      const res = await RequestTransactionCancelation(
        t.id,
        "Requesting a cancelation"
      );
      setCancelling(false);
      if (res.error)
        return toast({
          title: "Error Occurred",
          description: res.errorMessage,
          variant: "destructive",
        });
      if (res.transactions) setTransactions(res.transactions);
    } catch (error) {
      setCancelling(false);
      return toast({
        title: "Error Occurred",
        description: "Connection failed",
        variant: "destructive",
      });
    }
  };
  const revoke = async () => {
    try {
      setRevoking(true)
      const res = await RevokeTransactionCancelation(t.id);
      setRevoking(false)
      if (res.error) return toast({
        title: "Oops!",
        description: res.errorMessage,
        variant: "destructive",
      });
      if(res.transactions) setTransactions(res.transactions)
    } catch (error) {
      setRevoking(false)
      toast({
        title: "Error Occurred",
        description: "Connection failed",
        variant: "destructive",
      });
    }
  };
  return (
    <div
      key={t.id}
      className="cursor-pointer hover:border hover:border-blue-400 shadow-md rounded-lg border"
    >
      <Link href={"./my-transactions/" + t.id}>
        <TransactionCard transaction={t}></TransactionCard>
      </Link>
      <div className="p-3 w-full">
        {!t.cancelationRequest && (
          <Button
            onClick={cancel}
            disabled={cancelling}
            className="w-full flex gap-x-4"
          >
            {!cancelling ? "Send cancelation request" : "Cancelling"}{" "}
            {cancelling && <Circles width={20} color="white"></Circles>}
          </Button>
        )}
        
        {t.cancelationRequest && !t.cancelationRequest.granted && <div className="w-full text-center font-bold flex gap-x-2 items-center justify-center">Cancelation Request Sent <Button disabled={revoking} onClick={revoke}>revoke {revoking && <Circles width={20} color="white"></Circles>}</Button></div>}
        {t.cancelationRequest && t.cancelationRequest.granted && <div className="w-full text-center font-bold text-muted-foreground">Canceled</div>}
      </div>
    </div>
  );
}

export default TCard;
