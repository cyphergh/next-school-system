import { RequestExpenditureCancelation } from "@/actions/finance/cancelation_request";
import { RevokeExpenditureCancelation } from "@/actions/finance/revoke_cancelation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Expenditure } from "@prisma/client";
import React, { useState } from "react";
import { Circles } from "react-loader-spinner";

function ECard({
  t,
  setExpenditure,
}: {
  t: Expenditure;
  setExpenditure: React.Dispatch<React.SetStateAction<Expenditure[]>>;
}) {
  const [canceling, setCanceling] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const { toast } = useToast();
  const cancel = async () => {
    try {
      setCanceling(true);
      const res = await RequestExpenditureCancelation(t.id, "");
      setCanceling(false);
      if (res.error)
        return toast({
          title: "Error Occurred",
          description: res.errorMessage,
          variant: "destructive",
        });
      if (res.expenses) setExpenditure(res.expenses);
    } catch (error) {
      setCanceling(false);
      toast({
        title: "!Oops",
        description: "Connection failed",
        variant: "destructive",
      });
    }
  };
  const revoke = async () => {
    try {
      setRevoking(true);
      const res = await RevokeExpenditureCancelation(t.id);
      setRevoking(false);
      if (res.error)
        return toast({
          title: "Error Occurred",
          description: res.errorMessage,
          variant: "destructive",
        });
      if (res.expenses) setExpenditure(res.expenses);
    } catch (error) {
      setRevoking(false);
      toast({
        title: "!Oops",
        description: "Connection failed",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="rounded-md w-full sm:w-[350px] p-4 flex flex-col justify-between  shadow-md cursor-pointer hover:border hover:border-blue-400 border">
      <div key={t.id} className="flex items-center">
        <div className="w-full">
          <div className="font-bold text-lg"> GH&#8373; {t.amount}</div>
          <div className=""> Description::</div>
          <div className="flex gap-x-2 capitalize p-2 italic">
            {t.description}
          </div>
          <div className="flex gap-x-2">
            Date <div>{t.createdAt.toLocaleDateString("en-GB")}</div>
          </div>
          <div className="flex gap-x-2">
            Time <div>{t.createdAt.toLocaleTimeString("en-GB")}</div>
          </div>
        </div>
        {!t.cancelationRequestId&&
          <div
          className={`w-[30px] h-[30px] rounded-full ${
            t.approved  ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        }
      </div>
      <div className="p-3 w-full ">
        {t.cancelationRequestId ? (
          <div className="flex text-center gap-x-2 w-full items-center font-bold">
            Cancelation request sent{" "}
            <Button className="flex-1 flex gap-x-1 items-center" disabled={revoking} onClick={revoke}>
              Revoke {revoking && <Circles width={20} color="white"></Circles>}
            </Button>{" "}
          </div>
        ) : (
          <Button
            className="w-full flex gap-x-2 items-center"
            disabled={canceling}
            onClick={cancel}
          >
            Send cancelation request{" "}
            {canceling && <Circles width={20} color="white"></Circles>}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ECard;
