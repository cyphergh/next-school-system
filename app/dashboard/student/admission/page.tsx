import React from "react";
import AdmissionUI from "./ui";
import { ClassWithInfo } from "@/types";
import { GetTeachingStaffWithNoClass } from "@/actions/staff/get-teaching-staff";
import { ListClasses } from "@/actions/class/list";
import { Prisma } from "@prisma/client";
import AdmissionFormPrinting from "./form";

export async function AdmissionPage() {
  let classes: Prisma.ClassGetPayload<{ include: { students: true } }>[] = [];
  try {
    const res = await ListClasses();
    if (res.error) throw Error(res.errorMessage);
    if (!res.classes) throw Error("Create new staff first");
    if (res.classes) classes = [...res.classes];
  } catch (error) {
    throw Error("Connection Failed");
  }
  return (
    <>
      <AdmissionUI classesString={JSON.stringify(classes)} />

    </>
  );
}

export default AdmissionPage;
