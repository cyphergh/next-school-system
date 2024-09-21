import React from "react";
import StaffListLoading from "./loading";
import TopComponent from "./top-component";
import { FindAllStaff } from "@/actions/staff/get-staff";
import StaffInfoMainUI from "./ui";
import { Staff } from "@prisma/client";
import { notFound } from "next/navigation";
import { StaffWithPermission } from "@/types";
import { getUser } from "@/actions/auth/getUser";

async function StaffInfo() {
  let staffs: StaffWithPermission[] = [];
  let me: StaffWithPermission;
  try {
    const res = await FindAllStaff();
    if (res.error) throw new Error(res.errorMessage);
    if (!res.staffs ) throw Error("No staff available")
    staffs = res.staffs;
    let user = await getUser();
    if (!user || user.error || !user.user) return Error("Reload the page");
    me = user.user as StaffWithPermission;
  } catch (error: any) {
    throw new Error(error.toString());
  }
  return (
    <div
      className="flex-1 h-full flex overflow-y-scroll p-2"
      suppressHydrationWarning
    >
      <StaffInfoMainUI me={me} staffs={staffs}></StaffInfoMainUI>
    </div>
  );
}

export default StaffInfo;
