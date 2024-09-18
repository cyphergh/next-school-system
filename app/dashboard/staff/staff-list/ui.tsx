"use client";
import { FindAllStaff } from "@/actions/staff/get-staff";
import StaffMiniInfo from "@/components/staff/staff-mini-info";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { StaffWithPermission } from "@/types";
import { Staff } from "@prisma/client";
import React, { useState } from "react";
import { IoRefreshCircle } from "react-icons/io5";
export const dynamic = "force-dynamic";

function StaffInfoMainUI({
  staffs,
  me,
}: {
  staffs: StaffWithPermission[];
  me: StaffWithPermission;
}) {
  const [staffList, setStaffList] = useState(staffs);
  const [reloading, setReloading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const handleReload = async () => {
    try {
      setReloading(true);
      const ss = await FindAllStaff();
      setReloading(false);
      if (ss.error)
        return toast({
          variant: "destructive",
          title: "Error",
          description: ss.errorMessage!,
          action: <ToastAction altText={ss.errorMessage!}>Ok</ToastAction>,
        });
      if (!ss.staffs)
        return toast({
          variant: "destructive",
          title: "Error",
          description: "Reload page",
          action: <ToastAction altText={ss.errorMessage!}>Ok</ToastAction>,
        });
      setStaffList([]);
      setStaffList([...ss.staffs]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error occurred",
        action: <ToastAction altText={"oops"}>Ok</ToastAction>,
      });
    }
  };
  return (
    <div className="flex-1  mx-auto whitespace-wrap break-words break-all flex flex-col">
      <Card className="w-full flex flex-col sm:flex-row gap-4 p-4">
        <input
          className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-300 h-10"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        ></input>
        <input
          className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-300 h-10"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        ></input>
        <div className="flex flex-row w-full gap-x-4">
          <input
            type="text"
            className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-300 h-10"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone number"
          ></input>
          <IoRefreshCircle
            onClick={handleReload}
            size={38}
            className={`${reloading ? "animate-spin" : ""} cursor-pointer`}
          ></IoRefreshCircle>
        </div>
      </Card>
      <div className="p-4 flex flex-col gap-2 flex-wrap content-start items-start w-full flex-1 sm:flex-row">
        {staffList.map((staff) => {
          const nameCheck:boolean = (staff.firstName.toLowerCase()+" "+staff.lastName.toLowerCase()).includes(name.toLowerCase());
          const phoneCheck:boolean = staff.phoneNumber.includes(phoneNumber.toLowerCase());
          const emailCheck:boolean = staff.emailAddress.toLowerCase().includes(email.toLowerCase());
          if(nameCheck&&phoneCheck&&emailCheck){
          return (
            <StaffMiniInfo
              key={
                staff.id +
                "" +
                staff.user?.lastSeen +
                staff.updatedAt.toString()
              }
              staff={staff}
              me={me}
            ></StaffMiniInfo>
          );
        }
        return <></>;
        })}
      </div>
    </div>
  );
}

export default StaffInfoMainUI;
