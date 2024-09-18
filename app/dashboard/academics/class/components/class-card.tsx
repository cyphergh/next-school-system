'use client'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClassWithInfo } from "@/types";
import React, { useState } from "react";
import EditClass from "./edit-class";

function ClassCard({ e }: { e: ClassWithInfo }) {
    const [isShowEdit,setIsShowEdit] = useState(false)
  return (
    <>
      <Card className="w-full p-3">
        <div className="capitalize font-bold font-mono-">{e.className}</div>
        <div className="m-1">Form master:</div>
        <div className="ml-2 text-muted-foreground capitalize">
          {e.formMaster?.firstName} {e.formMaster?.lastName}
        </div>
        <div className="ml-2 text-muted-foreground lowercase">
          {e.formMaster?.emailAddress}
        </div>
        <div className="ml-2">
          <a
            href={`tel:${e.formMaster?.phoneNumber}`}
            className="text-blue-700"
          >
            {e.formMaster?.phoneNumber}
          </a>
        </div>
        <div className="flex flex-row w-full justify-end">
          <Button onClick={()=>setIsShowEdit(true)}>Manage</Button>
        </div>
      </Card>
      {
        isShowEdit&&
        <EditClass stage={e} isShow={isShowEdit} setIsShow={setIsShowEdit}></EditClass>
      }
    </>
  );
}

export default ClassCard;
