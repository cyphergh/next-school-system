"use client";
import { createBill } from "@/actions/finance/create-bill";
import { GetStudentsInfo } from "@/actions/student/info_students";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { StInfo } from "@/types";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import React, { useActionState, useState } from "react";
import { FaMinusCircle, FaPlusCircle, FaSync } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { InfinitySpin } from "react-loader-spinner";

interface BillItem {
  title: string;
  quantity: number;
  price: number;
  total: number;
}
export default function PassBillUI({ st }: { st: StInfo[] }) {
  const [students, setStudents] = useState<StInfo[]>(st);
  const [items, setItems] = useState<BillItem[]>([]);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showFinalize, setShowFinalize] = useState(false);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("");
  const [showStudents, setShowStudents] = useState(false);
  const [showSelectedStudents, setShowSelectedStudents] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const refreshStudents = async () => {
    try {
      setRefreshing(true);
      const res = await GetStudentsInfo();
      setRefreshing(false);
      if (res.error) throw Error(res.errorMessage);
      if (!res.students) throw Error("No students found");
      if(res.students) setStudents(res.students);

    } catch (error: any) {
      setRefreshing(false);
      return toast({
        title: "Error",
        description: error.toString(),
        variant: "destructive",
        action: <ToastAction altText="">Ok</ToastAction>,
      });
    }
  };
  const removeAllStudents = () => {
    setSelectedStudents([]);
  };
  const removeStudent = (id: string) => {
    const p = selectedStudents.filter((e) => e != id);
    setSelectedStudents([...p]);
  };
  const addAllStudents = () => {
    const fit = students.filter(
      (e) =>
        (
          e.firstName +
          " " +
          e.lastName +
          " " +
          e.class.className +
          " " +
          e.emailAddress +
          " " +
          e.type +
          " " +
          e.phoneNumber
        )
          .toLowerCase()
          .includes(filter.toLowerCase()) && !e.stopped
    );
    let p: string[] = [];
    for (let m of fit) {
      if (p.includes(m.id)) return;
      p.push(m.id);
      setSelectedStudents([...p]);
    }
  };
  const addStudent = (id: string) => {
    if (selectedStudents.includes(id)) return;
    setSelectedStudents([...selectedStudents, id]);
  };
  const addItem = () => {
    if (!name || !price || !quantity) {
      return toast({
        title: "Error",
        description: "All fields required",
        variant: "destructive",
        action: <ToastAction altText="Password mismatch">Ok</ToastAction>,
      });
    }
    if (isNaN(parseFloat(price)) || isNaN(parseInt(quantity))) {
      return toast({
        title: "Error",
        description: "Price and quantity should be number",
        variant: "destructive",
        action: <ToastAction altText="Password mismatch">Ok</ToastAction>,
      });
    }
    if (parseFloat(price) <= 0 || parseInt(quantity) <= 0) {
      return toast({
        title: "Error",
        description: "Price and quantity should be greater than 0",
        variant: "destructive",
        action: <ToastAction altText="Password mismatch">Ok</ToastAction>,
      });
    }
    if (items.find((e) => e.title.toLowerCase() == name.toLowerCase())) {
      return toast({
        title: "Error",
        description: "Item already exists",
        variant: "destructive",
        action: <ToastAction altText="Password mismatch">Ok</ToastAction>,
      });
    }
    setItems([
      ...items,
      {
        title: name,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        total: parseFloat(price) * parseInt(quantity),
      },
    ]);
    setName("");
    setPrice("");
    setQuantity("");
  };
  const deleteItem = (name: string) => {
    let newList = items.filter((item) => item.title != name);
    setItems([...newList]);
  };
  const sendBill = async () => {
    if (items.length < 1)
      return toast({
        title: "Error",
        description: "Add items to the bill",
        variant: "destructive",
      });
    if (!title)
      return toast({
        title: "Error",
        description: "Bill title is required",
        variant: "destructive",
      });
    if (selectedStudents.length < 1)
      return toast({
        title: "No student selected",
        description: "Please select a student",
        variant: "destructive",
      });

    setShowFinalize(true);
  };
  const [waiting, setWaiting] = useState(false);
  const finalize = async () => {
    try {
      setWaiting(true);
      const res = await createBill({
        items,
        students: selectedStudents,
        title,
        password,
      });
      setWaiting(false);
      if (res.error) throw Error(res.errorMessage);
      setTitle("");
      setPassword("");
      setSelectedStudents([]);
      setItems([]);
      setShowFinalize(false);

      return toast({
        title: "Bill passed successfully",
        description: "Bill passed",
      });
    } catch (error: any) {
      setWaiting(false);
      return toast({
        title: "Error",
        description: error.toString(),
        variant: "destructive",
      });
    }
  };
  return (
    <>
      <AlertDialog
        open={showSelectedStudents}
        defaultOpen={showSelectedStudents}
        onOpenChange={setShowSelectedStudents}
      >
        <AlertDialogContent className="flex flex-col h-[80%]">
          <AlertDialogHeader>
            <h3 className="text-lg font-semibold">Selected Student</h3>
            <div className="flex gap-2">
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter"
              ></Input>
              <Button onClick={removeAllStudents}>Remove All</Button>
            </div>
          </AlertDialogHeader>
          <div className="flex flex-col overflow-hidden gap-y-2 overflow-y-scroll flex-1">
            {students
              .filter(
                (e) =>
                  selectedStudents.includes(e.id) &&
                  (
                    e.firstName +
                    " " +
                    e.lastName +
                    " " +
                    e.class.className +
                    " " +
                    e.emailAddress +
                    " " +
                    e.type +
                    " " +
                    e.phoneNumber
                  )
                    .toLowerCase()
                    .includes(filter.toLowerCase()) &&
                  !e.stopped
              )
              .map((student) => {
                return (
                  <div
                    onClick={() => removeStudent(student.id)}
                    key={student.id}
                    className="flex items-center gap-x-4 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      className="w-[40px] h-[40px] rounded-full"
                    ></Checkbox>
                    <Avatar className="w-[50px] h-[50px] cursor-pointer dark:text-white text-black font-normal text-xl">
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${student?.images[0]?.id}`}
                        alt="profile"
                      />
                      <AvatarFallback>
                        {student.firstName[0]}
                        {student.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {student.firstName} {student.lastName}
                    </div>
                  </div>
                );
              })}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={showStudents}
        defaultOpen={showStudents}
        onOpenChange={setShowStudents}
      >
        <AlertDialogContent className="flex flex-col h-[80%]">
          <AlertDialogHeader>
            <h3 className="text-lg font-semibold">Add Student</h3>
            <div className="flex gap-2">
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter"
              ></Input>
              <Button onClick={addAllStudents}>Select All</Button>
            </div>
          </AlertDialogHeader>
          <div className="flex flex-col overflow-hidden gap-y-2 overflow-y-scroll flex-1">
            {students
              .filter(
                (e) =>
                  (
                    e.firstName +
                    " " +
                    e.lastName +
                    " " +
                    e.class.className +
                    " " +
                    e.emailAddress +
                    " " +
                    e.type +
                    " " +
                    e.phoneNumber
                  )
                    .toLowerCase()
                    .includes(filter.toLowerCase()) &&
                  !e.stopped &&
                  !selectedStudents.includes(e.id)
              )
              .map((student) => {
                return (
                  <div
                    onClick={() => addStudent(student.id)}
                    key={student.id}
                    className="flex items-center gap-x-4 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      className="w-[40px] h-[40px] rounded-full"
                    ></Checkbox>
                    <Avatar className="w-[50px] h-[50px] cursor-pointer dark:text-white text-black font-normal text-xl">
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${student?.images[0]?.id}`}
                        alt="profile"
                      />
                      <AvatarFallback>
                        {student.firstName[0]}
                        {student.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {student.firstName} {student.lastName}
                    </div>
                  </div>
                );
              })}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex-1 flex p-6 flex-col overflow-scroll sm:overflow-y-hidden pl-1 pr-1">
        <Card className="p-4 flex gap-2 items-center flex-wrap content-start justify-between sm:justify-normal ">
          <FaSync onClick={refreshStudents}  size={20} className={`cursor-pointer ${refreshing&&"animate-spin"}`}></FaSync>
          <Button
            onClick={() => setShowStudents(true)}
            variant={"outline"}
            className="p-2 flex gap-x-2"
          >
            <FaPlusCircle></FaPlusCircle>
            Students
          </Button>
          <Button
            onClick={() => setShowSelectedStudents(true)}
            variant={"outline"}
            className="p-2 flex gap-x-2"
          >
            <FaMinusCircle></FaMinusCircle>
            Selected Student ({selectedStudents.length})
          </Button>
        </Card>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bill Title"
          className="mt-3"
        ></Input>
        <div className="p-2 flex flex-col gap-3 sm:flex-row">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item"
          />
          <Input
            type={"number"}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
          />
          <Input
            type={"number"}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />
          <Button variant={"outline"} onClick={addItem}>
            Add
          </Button>
        </div>
        <div className="sm:flex-1 sm:overflow-y-scroll p-6">
          <table className="w-full border table rounded-md">
            <thead>
              <tr className="p-2 border text-left">
                <th className="p-2">Item</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Price</th>
                <th className="p-2">Total</th>
                <th className="p-2 w-[10px] bg-blue-400"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.title} className="p-2 border text-left">
                  <td className="p-2">{e.title}</td>
                  <td className="p-2">{e.quantity}</td>
                  <td className="p-2">{e.price}</td>
                  <td className="p-2">{e.total}</td>
                  <td className="p-2 w-[10px]">
                    <FiDelete
                      onClick={() => deleteItem(e.title)}
                      className="cursor-pointer text-red-500"
                    ></FiDelete>
                  </td>
                </tr>
              ))}
              <tr className="p-2 border text-left">
                <td></td>
                <td></td>
                <td>Total</td>
                <td>GH&#8373; {items.reduce((a, b) => a + b.total, 0)}</td>
              </tr>
            </tbody>
          </table>
          <Button
            onClick={sendBill}
            variant={"outline"}
            className="p-4 flex gap-x-2 mt-3"
          >
            <IoSend></IoSend>
            Send Bill
          </Button>
        </div>
      </div>
      <AlertDialog
        open={showFinalize}
        defaultOpen={showFinalize}
        onOpenChange={setShowFinalize}
      >
        {waiting ? (
          <AlertDialogContent className="p-6 flex w-full justify-center items-center">
            <InfinitySpin color="blue" width="250"></InfinitySpin>
          </AlertDialogContent>
        ) : (
          <AlertDialogContent className="p-6">
            <AlertDialogHeader>
              <h1 className="font-semibold">Confirm password</h1>
              <p className="text-muted-foreground">
                You are about to pass a bill to {selectedStudents.length}{" "}
                student with amount GH&#8373;{" "}
                {items.reduce((a, i) => (a += i.total), 0)}
              </p>
            </AlertDialogHeader>
            <div className="flex">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
              ></Input>
            </div>
            <AlertDialogFooter className="gap-2">
              <Button onClick={finalize}>Confirm</Button>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  );
}
