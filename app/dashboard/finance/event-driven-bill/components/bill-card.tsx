import { DeleteEDBIll } from "@/actions/finance/delete-ed-bill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { TGetEDBills } from "@/types";
import logo from "@/public/logo.png";
import gesLogo from "@/public/ges.png";
import React, {
  forwardRef,
  ReactInstance,
  Ref,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { IoPrintOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { Circles } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import QRCode from "react-qr-code";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
function EDBillCard({
  bill,
  setEDBills,
}: {
  bill: TGetEDBills;
  setEDBills: React.Dispatch<SetStateAction<TGetEDBills[]>>;
}) {
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const deleteEDBill = async (id: string) => {
    try {
      setLoading(true);
      const res = await DeleteEDBIll({ id });
      setLoading(false);
      if (res.error)
        return toast({
          title: "Error",
          description: res.errorMessage,
          variant: "destructive",
          action: <ToastAction altText={"Password mismatch"}>Ok</ToastAction>,
        });
      if (res.bills) setEDBills(res.bills);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Connection failed",
        description: "Error connecting to server",
        variant: "destructive",
        action: <ToastAction altText={"Password mismatch"}>Ok</ToastAction>,
      });
    }
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Card className="p-3 flex flex-col gap-y-1">
      <div className="capitalize">{bill.title}</div>
      <div className="uppercase font-bold">{bill.class.className}</div>
      <div className="uppercase font-bold">GH&#8373; {bill.amount}</div>
      {!loading ? (
        <div className="flex w-full p-2 justify-between">
          <Dialog>
            <DialogTrigger>
              <MdDeleteOutline
                title="Delete"
                className="cursor-pointer"
                size={30}
                color="red"
              ></MdDeleteOutline>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
              </DialogHeader>
              <p className="capitalize text-muted-foreground">
                You are about to delete {bill.title} for {bill.class.className}
              </p>
              <DialogFooter>
                <Button onClick={() => deleteEDBill(bill.id)} className="mr-4">Delete</Button>
                <DialogClose>Close</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <IoPrintOutline
            onClick={() => handlePrint()}
            title="Print"
            className="cursor-pointer"
            size={30}
            color="red"
          ></IoPrintOutline>
        </div>
      ) : (
        <div className="w-full flex gap-x-2 items-center">
          <div>Loading...</div>
          <Circles width={"30"} height={"30"} color="red"></Circles>
        </div>
      )}
      <div className="hidden">
        <PrintEDBill ref={printRef} bill={bill}></PrintEDBill>
      </div>
    </Card>
  );
}

const PrintEDBill = forwardRef(
  (props: { bill: TGetEDBills }, ref: Ref<HTMLDivElement>) => {
    return (
      <div ref={ref} className="w-[215mm]">
        <div className="bg-gradient-to-r from-blue-900 to-blue-400 p-6 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                className="h-[150px] w-[150px] mr-4"
                src={logo}
                alt="logo"
              ></Image>
              <div>
                <h1 className="text-white text-2xl font-bold">
                  {process.env.NEXT_PUBLIC_SCHOOL}
                </h1>
                <h1 className="text-white text-lg font-bold">
                  Ghana Education Service
                </h1>
                <p className="text-blue-100">
                  {process.env.NEXT_PUBLIC_DOMAIN}
                </p>
                <p className="text-blue-100">
                  {process.env.NEXT_PUBLIC_SCHOOL_SLOGAN}
                </p>
              </div>
            </div>
            <div className="text-right text-white">
              <p>{process.env.NEXT_PUBLIC_SCHOOL_LOCATION}</p>
              <p>{process.env.NEXT_PUBLIC_SCHOOL_CONTACT}</p>
              <p>{process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</p>
              <p>{props.bill.id}</p>
            </div>
          </div>
        </div>
        <div className="p-8 w-full flex gap-x-5 items-center">
          <QRCode
            fgColor="blue"
            size={100}
            value={`${process.env.NEXT_PUBLIC_DOMAIN}/qr/view-edbill/${props.bill.id}`}
          />
          <div className="flex flex-col ">
            <div className="uppercase font-bold text-xl">
              {props.bill.title}
            </div>
            <div className="uppercase text-lg">
              {props.bill.class.className}
            </div>
            <div className="capitalize text-xl">{props.bill.term.name}</div>
            <div className="capitalize text-xl">
              GH&#8373; {props.bill.amount}
            </div>
          </div>
          <div className="flex-1 flex justify-end items-center">
            <Image
              className="h-[100px] w-[100px] mr-4"
              src={logo}
              alt="logo"
            ></Image>
            <Image
              className="h-[110px] w-[110px] mr-4"
              src={gesLogo}
              alt="ges-logo"
            ></Image>
          </div>
        </div>
        <div className="p-4">
          <div>
            Created At: {props.bill.createdAt.toLocaleDateString("en-GB")}
          </div>
        </div>
        <div className="w-full text-center p-14 text-lg">
          <Table>
            <TableCaption>Bill Items and description</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2} className="text-left text-lg font-bold">
                  Item
                </TableHead>
                <TableHead className="text-lg font-bold">Quantity</TableHead>
                <TableHead className="text-lg font-bold">
                  Unit Price (GH&#8373;)
                </TableHead>
                <TableHead className="text-left text-lg font-bold">
                  Total (GH&#8373;)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.bill.billItems.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell colSpan={2} className="text-left">
                    {invoice.title}
                  </TableCell>
                  <TableCell className="text-left">
                    {invoice.quantity}
                  </TableCell>
                  <TableCell className="text-left"> {invoice.amount}</TableCell>
                  <TableCell className="text-left">
                    {invoice.quantity * invoice.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}></TableCell>
                <TableCell colSpan={1} className="text-left text-lg">
                  Total
                </TableCell>
                <TableCell className="text-left text-lg">
                  GH&#8373;{props.bill.amount}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    );
  }
);
PrintEDBill.displayName = "EDBillCard-print";
export default EDBillCard;
