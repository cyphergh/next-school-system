"use server";

import { TTransactions } from "@/types";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { IsAccountActive } from "../account-active";
import { AddStaffActivity, setLastSeen } from "../auth/setLastSeen";

export async function Transactions(): Promise<TTransactions> {
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
    if (!term) throw new Error("CreateActivate a new term first");
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId: user.id,
        OR: [{ type: "Blocked" }, { type: "Stopped" }],
        value: false,
      },
    });

    if (!myPermissions && user.phoneNumber !== "0206821921")
      return { error: true, errorMessage: "Permission denied" };
    await AddStaffActivity(user.id, "OTHER", "Reading transactions made");
    const isSuperAdmin = await prisma.permission.findFirst({
      where: {
        staffId: user.id,
        type: "SUPERADMIN",
        value: true,
      },
    });
    const transactions = await prisma.transaction.findMany({
      orderBy:{
        createdAt:"desc"
      },
      where: isSuperAdmin
        ? {
          termId:term.id,
          status:{
            not:"CANCELED"
          }
        }
        : {
            staffId: user.id,
            termId:term.id,
            status:{
              not:"CANCELED"
            }
          },
      include: {
        bill: {
          include: {
            items: true,
          },
        },
        Father: true,
        Mother: true,
        edBill: {
          include: {
            billItems: true,
          },
        },
        staff: true,
        term: true,
        student: true,
        cancelationRequest:true,
      },
    });
    const expenses = await prisma.expenditure.findMany({
      where: isSuperAdmin
        ? {termId:term.id}
        : {
            staffId: user.id,
            termId:term.id,
          },
        include:{
          cancelationRequest:true,
        }
    });
    return { error: false, errorMessage: "", transactions, expenses };
  } catch (error: any) {
    return { error: true, errorMessage: error.message };
  }
}
