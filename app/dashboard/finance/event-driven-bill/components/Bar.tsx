"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EDBillEvents, Prisma, StudentType } from "@prisma/client";
import { PiSelection } from "react-icons/pi";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { CreateEDBill } from "@/actions/finance/new-ed-bills";
import { Circles } from "react-loader-spinner";
import { TGetEDBills } from "@/types";
import { FaPrint } from "react-icons/fa";
import { IoPrintOutline } from "react-icons/io5";
import EDBillCard from "./bill-card";

interface Items {
  name: string;
  amount: number;
  quantity: number;
}
function Bar({
  stages,
  bills,
}: {
  stages: Prisma.ClassGetPayload<{ include: { students: true } }>[];
  bills: TGetEDBills[];
}) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [event, setEvent] = useState<EDBillEvents>("ADMISSION");
  const [items, setItems] = useState<Items[]>([]);
  const [studentType,setStudentType] = useState<StudentType|null>(null)
  const [edBills, setEDBills] = useState<TGetEDBills[]>(bills);
  const { toast } = useToast();
  const createEdBill = async () => {
    let classes = [];
    try {
      if (!title)
        return toast({
          title: "Error",
          description: "Title required",
          variant: "destructive",
          action: <ToastAction altText={"Password mismatch"}>Ok</ToastAction>,
        });
      if (!selected.length)
        return toast({
          title: "Select class",
          description: "Select at least a class",
          variant: "destructive",
          action: <ToastAction altText={"Password mismatch"}>Ok</ToastAction>,
        });
      if (!items.length)
        return toast({
          title: "No Bill Item",
          description: "Add item to bill",
          variant: "destructive",
          action: <ToastAction altText={"Password mismatch"}>Ok</ToastAction>,
        });
      setCreating(true);
      setOpen(false);
      const res = await CreateEDBill({
        title: title.toLowerCase(),
        classes: selected,
        items: items,
        type: event,
        studentType:studentType
      });
      setCreating(false);
      if (res.error)
        return toast({
          title: "Error",
          description: res.errorMessage,
          variant: "destructive",
          action: <ToastAction altText={"Password mismatch"}>Ok</ToastAction>,
        });
      setTitle("");
      setEvent("ADMISSION");
      setItems([]);
      setSelected([]);
      if (res.bills) setEDBills(res.bills);
    } catch (error) {
      setCreating(false);
      return toast({
        title: "Connection failed",
        description: "Error connecting to server",
        variant: "destructive",
        action: <ToastAction altText={"Password mismatch"}>Ok</ToastAction>,
      });
    }
  };
  const deleteItem = (name: string) => {
    let newList = items.filter((item) => item.name != name);
    setItems([...newList]);
  };
  const addBillItem = () => {
    if (!name || !amount || !quantity)
      return toast({
        title: "!Oops",
        description: "Item name, price and quantity required",
        variant: "destructive",
        action: <ToastAction altText={"Password mismatch"}>Ok</ToastAction>,
      });
    let price = parseFloat(amount);
    let quant = parseInt(quantity);
    if (isNaN(price) || isNaN(quant))
      return toast({
        title: "!Oops",
        description: "price and quantity should be number",
        variant: "destructive",
        action: <ToastAction altText={"Password mismatch"}>Ok</ToastAction>,
      });
    let newItems = items.filter(
      (e) => e.name.toLowerCase() != name.toLowerCase()
    );
    let toAdd: Items[] = [
      ...newItems,
      { name: name, amount: price, quantity: quant },
    ];
    setItems([...toAdd]);
    setName("");
    setQuantity("");
    setAmount("");
  };
  const addItem = (id: string) => {
    if (selected.includes(id)) {
      let m = [...selected];
      const index = m.indexOf(id);
      if (index! < 0) return;
      m.splice(index, 1);
      setSelected(m);
      return;
    }
    setSelected([...selected, id]);
  };
 
  return (
    <>
      <div className="p-4 flex flex-1 flex-col overflow-hidden ">
        <div className="w-full">
          <Card className="p-2 flex flex-row gap-4">
            <Input className="w-full p-4" placeholder="Search..."></Input>
            <Button disabled={creating} onClick={() => setOpen(true)}>
              Add new{" "}
              {creating && (
                <div className="ml-2">
                  <Circles width="20" color="white"></Circles>
                </div>
              )}
            </Button>
          </Card>
        </div>
        <div className="flex-1 p-2 flex flex-col sm:flex-row sm:flex-wrap content-start overflow-y-scroll">
          {edBills.map((bill) => {
            return (
              <div
                key={bill.id}
                className="p-2 sm:w-[48%]  w-full lg:w-[300px]"
              >
                <EDBillCard bill={bill} setEDBills={setEDBills} />
              </div>
            );
          })}
        </div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="h-[80%] flex flex-col">
            <AlertDialogHeader>
              <AlertDialogTitle>Add new event driven bill</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="p-4  flex-col gap-2 flex">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event Driven Bill Title"
              ></Input>
              <select
                className="block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                onChange={(e) => setEvent(e.target.value as EDBillEvents)}
              >
                <option value="ADMISSION" selected>
                  Admission
                </option>
                <option value="ATTENDANCE">Attendance</option>
                <option value="ID_PRINTING">ID Printing</option>
                <option value="NOTE_USAGE">E-Note Usage</option>
              </select>
              <select
                className="block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                onChange={(e) => setStudentType(e.target.value as StudentType)}
              >
                <option value="">All Students</option>
                <option value="DAY">DAY</option>
                <option value="BOARDING">BOARDING</option>
              </select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex justify-between">
                    Select Class <div>{selected.length}</div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-[60%] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Classes</DialogTitle>
                    <DialogDescription>
                      Select classes this ED bill will affect
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col flex-1 overflow-y-scroll gap-2">
                    {stages.map((e) => {
                      return (
                        <div
                          key={"s-" + e.id}
                          className="cursor-pointer"
                          onClick={() => addItem(e.id)}
                        >
                          <Card className="p-2">
                            <div className="capitalize flex flex-row gap-x-1 items-center">
                              <div>
                                {selected.includes(e.id) && <PiSelection />}
                              </div>
                              <div className="flex justify-between flex-1">
                                {e.className}{" "}
                                <div>Total:{e.students.length}</div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex w-full justify-end">
              <div className="mr-4">
                Total: &#8373;
                {items.reduce(
                  (acc, item) => (acc += item.amount * item.quantity),
                  0
                )}
              </div>
              <AlertDialog open={openAddItem} onOpenChange={setOpenAddItem}>
                <AlertDialogTrigger>
                  <Button>Add Item</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <div className="flex flex-col gap-y-3">
                    <Input
                      placeholder="Item name"
                      className="p-2"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Input>
                    <Input
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      type="number"
                      placeholder="Item Quantity"
                      className="p-2"
                    ></Input>
                    <Input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      placeholder="Item Price"
                      className="p-2"
                    ></Input>
                    {items.length}
                    <div className="flex gap-x-2 p-4 w-full justify-between">
                      <Button
                        onClick={() => setOpenAddItem(false)}
                        variant={"secondary"}
                      >
                        Done
                      </Button>
                      <Button onClick={addBillItem}>Add</Button>
                    </div>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex-1 flex flex-col overflow-y-scroll gap-y-2 text-center ">
              <div className="p-2 border-1 rounded-lg max-w-full w-full flex justify-between shadow-sm gap-x-2 font-bold">
                <div className="capitalize flex-1 text-left">Item</div>
                <div className="capitalize w-[60px]">Quantity</div>
                <div className="capitalize w-[50px]">Price</div>
                <div className="capitalize w-[80px]">Total</div>
              </div>
              {items.map((item) => {
                return (
                  <div
                    key={"item-" + item.name}
                    className="p-2 border-1 rounded-lg max-w-full w-full flex justify-between shadow-sm gap-x-2"
                  >
                    <div className="capitalize flex-1 text-left flex items-center">
                      <MdDelete
                        onClick={() => deleteItem(item.name)}
                        className="cursor-pointer"
                        color="red"
                      ></MdDelete>{" "}
                      {item.name}
                    </div>
                    <div className="capitalize w-[50px]">{item.quantity}</div>
                    <div className="capitalize w-[50px]">
                      &#8373;{item.amount}
                    </div>
                    <div className="capitalize w-[80px] ">
                      &#8373;{item.amount * item.quantity}
                    </div>
                  </div>
                );
              })}
            </div>
            <AlertDialogFooter className="flex flex-row gap-x-3 w-full">
              <Button onClick={() => setOpen(false)} variant={"outline"}>
                {" "}
                Cancel
              </Button>
              <Button onClick={createEdBill}> Create</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}

export default Bar;
