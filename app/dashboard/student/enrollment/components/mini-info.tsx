import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StInfo } from "@/types";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import React, { useState } from "react";
import InfoTab from "./info-tab/tab";
import { QrScan } from 'pastel-qr-scan';
import TransactionsTab from "./transactions-tab/tab";

function StudentMiniInfo({ student }: { student: StInfo }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Card
        onClick={() => setShow(true)}
        title={student.firstName}
        className="flex shadow-sm gap-x-3 p-4 w-full cursor-pointer items-center"
      >
        <Avatar className="w-[120px] h-[120px] cursor-pointer dark:text-white text-black font-normal text-3xl">
          <AvatarImage
            src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${student?.images[0]?.id}`}
            alt="profile"
          />
          <AvatarFallback>
            {student.firstName[0]}
            {student.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="capitalize">
            {student.firstName} {student.lastName}
          </div>
          <div className="uppercase font-bold">{student.class.className}</div>
          <div className="uppercase">{student.type}</div>
          <div className="">{student.address}</div>
        </div>
      </Card>
      <AlertDialog open={show} onOpenChange={setShow}>
        <AlertDialogContent className="h-[90%] w-[90%] max-w-[100%] flex flex-col rounded-md overflow-y-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {student.firstName}
              {"'"}s Information
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex-1 flex flex-col overflow-y-hidden w-full">
            <Tabs
              defaultValue="info"
              className="flex-1 overflow-hidden flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              <TabsContent
                value="info"
                className="flex flex-col items-center  overflow-y-scroll"
              >
                <InfoTab student={student}></InfoTab>
              </TabsContent>
              <TabsContent
                value="transactions"
                className="flex flex-col items-center  overflow-y-scroll "
              ><TransactionsTab studentId={student.id}></TransactionsTab>
              </TabsContent>
            </Tabs>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default StudentMiniInfo;
