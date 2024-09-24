"use server";

import { EDBillItem, TGetEDBillsResponse } from "@/types";
import { EDBillEvents, StudentType } from "@prisma/client";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { IsAccountActive } from "../account-active";
import { AddStaffActivity, setLastSeen } from "../auth/setLastSeen";

export async function CreateEDBill({
  title,
  items,
  classes,
  type,
  studentType,
}: {
  title: string;
  items: EDBillItem[];
  classes: string[];
  type: EDBillEvents;
  studentType: StudentType|null;
  
}): Promise<TGetEDBillsResponse> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Error occurred" };
    const user = await prisma.staff.findFirst({
      where: { userId: session.userId },
    });
    if (!user) return { error: true, errorMessage: "Error occurred" };
    if (await IsAccountActive(session.userId))
      return { error: true, errorMessage: "Account suspended" };
    setLastSeen(session.userId);
    const term = await prisma.term.findFirst({
      where: {
        isActve: true,
      },
    });
    if (!term) throw new Error("Create a new term first");
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId: user.id,
        OR: [
          { type: "CreateBill" },
          { type: "EditBill" },
          { type: "DeleteBill" },
        ],
        value: true,
      },
    });
    if (!myPermissions && user.phoneNumber !== "0206821921")
        return { error: true, errorMessage: "Permission denied" };
    const result = await prisma.$transaction(async (prisma) => {
      const amount = items.reduce(
        (sum, item) => sum + (item.amount * item.quantity),
        0
      );
      if (isNaN(amount)) throw new Error("Transaction Failed");
      for (const x in classes) {
        const classId = classes[x];
        const exist = await prisma.eDBIll.findFirst({
          where: {
            title: title.toLowerCase(),
            event: type,
            termId: term.id,
            classId: classId,
          },
        });
        if (exist) throw new Error("Error Duplicate Bill");
        if(!studentType){
          studentType=null
        }
        const edBill = await prisma.eDBIll.create({
          data: {
            amount,
            event: type,
            title: title.toLowerCase(),
            classId: classId,
            termId: term.id,
            forStudent: studentType??undefined,
          },
        });
        for (const y in items) {
          const item = items[y];
          const newItem = await prisma.billItem.create({
            data: {
              title: item.name,
              amount: item.amount,
              quantity: item.quantity,
              edbillId: edBill.id,
              delivered:true,
            },
          });
        }
      }
    });
    if (!myPermissions && user.phoneNumber !== "0206821921")
      return { error: true, errorMessage: "Permission denied" };
    const edBills = await prisma.eDBIll.findMany({
        where:{
            termId:term.id
        },
      include: {
        billItems: {},
        class: true,
        term:true,
      },
    });
    AddStaffActivity(user.id,"DELETE_RECORD","Creating Event driven bill");
    if (!edBills) return { error: true, errorMessage: "Error occurred" };
    return { error: false, errorMessage: "", bills: edBills };
  } catch (error: any) {
    console.log(error)
    return { error: true, errorMessage: error.toString() };
  }
}
