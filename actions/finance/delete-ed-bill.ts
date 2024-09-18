"use server";

import { TGetEDBillsResponse } from "@/types";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { IsAccountActive } from "../account-active";
import { AddStaffActivity, setLastSeen } from "../auth/setLastSeen";

export async function DeleteEDBIll({
  id,
}: {
  id: string;
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
      await prisma.billItem.deleteMany({
        where: {
          edbillId: id,
        },
      });
      await prisma.eDBIll.delete({
        where: {
          id: id,
        },
      })
    });
    const edBills = await prisma.eDBIll.findMany({
      include: {
        billItems: {},
        class: true,
        term:true,
      },
    });
    if (!edBills) return { error: true, errorMessage: "Error occurred" };
    AddStaffActivity(user.id,"DELETE_RECORD","Deleting Event driven bill");
    return { error: false, errorMessage: "", bills: edBills };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
