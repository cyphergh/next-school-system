import React from "react";
import ClassManagementPage from "./ui";
import { GetTeachingStaffWithNoClass } from "@/actions/staff/get-teaching-staff";
import { ClassWithInfo, StaffWithPermission } from "@/types";

async function ClassPage() {
  let staffs: StaffWithPermission[] = [];
  let classes: ClassWithInfo[] = [];
  try {
    const res = await GetTeachingStaffWithNoClass();
    if (res.error) throw Error(res.errorMessage);
    if (!res.staffs) throw Error("Create new staff first");
    staffs = [...res.staffs];
    if (res.classes) classes = [...res.classes];
  } catch (error) {
    throw Error("Connection Failed");
  }

  return (
    <ClassManagementPage
      classesString={JSON.stringify(classes)}
      dataString={JSON.stringify(staffs)}
    ></ClassManagementPage>
  );
}

export default ClassPage;
