"use client";
import React, { useState } from "react";
import { Circles } from "react-loader-spinner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/router";
import {
  ClassWithInfo,
  StaffWithPermission,
  TGetStaffInformation,
} from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { NewClass } from "@/actions/class/new";
function NewClassDialog({
  shown,
  setShown,
  staff,
  setStaffs,
  setClasses,
}: {
  shown: boolean;
  setShown: React.Dispatch<React.SetStateAction<boolean>>;
  setStaffs: React.Dispatch<React.SetStateAction<StaffWithPermission[]>>;
  setClasses: React.Dispatch<React.SetStateAction<ClassWithInfo[]>>;
  staff: StaffWithPermission[];
}) {
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [staffId, setStaffId] = useState("");
  const { toast } = useToast();
  const handleCreateClass = async () => {
    if (!stage || !staffId)
      return toast({
        title: "Error",
        variant: "destructive",
        description: "Class name and form master required",
        action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
      });
    setLoading(true);
    try {
      const res = await NewClass({ staffId, stageName: stage });
      setLoading(false);
      if (res.error) {
        setShown(false);
        return toast({
          title: "!Oh",
          variant: "destructive",
          description: res.errorMessage,
          action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
        });
      }
      setClasses([]);
      setClasses([...res.classes!]);
      setStaffs([]);
      setStaffs([...res.staffs!]);
      setStage("");
      setStaffId("");
      setShown(false);
    } catch (error) {
      setShown(false);
      setLoading(false);
      return toast({
        title: "!Oops",
        variant: "destructive",
        description: "Server connection error",
        action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
      });
    }
  };
  return (
    <AlertDialog open={shown} defaultOpen={shown}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Class</AlertDialogTitle>
          <AlertDialogDescription>
            you are about to create a new class
          </AlertDialogDescription>
        </AlertDialogHeader>
        <label>Enter class name</label>
        <input
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          disabled={loading}
          type="text"
          className="block w-full px-4 py-2 pl-2 border rounded-lg shadow-sm outline-none focus:ring focus:ring-opacity-50 transition-colors
          bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500
          dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          placeholder="Class Name"
        />
        <label>Select form master</label>
        <div className="w-full flex flex-row">
          <Select
            disabled={loading}
            onValueChange={(e: string) => setStaffId(e)}
          >
            <SelectTrigger className="w-full h-[50px]">
              <SelectValue placeholder="Select form master" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Teaching Staffs</SelectLabel>
                {staff.map((e) => {
                  return (
                    <SelectItem value={e.id} key={e.id}>
                      <div className="flex p-2 gap-x-4 text-lg items-center">
                        <Avatar className="w-[40px] h-[40px] cursor-pointer">
                          <AvatarImage
                            src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${e.images[0]?.id}`}
                            alt="profile"
                          />
                          <AvatarFallback>
                            {e.firstName[0]}
                            {e.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="capitalize">
                          {e.firstName} {e.lastName}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <AlertDialogFooter className="gap-2">
          <AlertDialogAction
            disabled={loading}
            className="bg-none bg-transparent text-red-600"
            onClick={() => setShown(false)}
          >
            cancel
          </AlertDialogAction>
          <AlertDialogAction
            onClick={handleCreateClass}
            className="flex gap-x-2"
            disabled={loading}
          >
            Create {loading && <Circles width={"20px"}></Circles>}{" "}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default NewClassDialog;
