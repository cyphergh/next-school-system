"use server";
"use server";
import prisma from "@/prisma/db";
import { PassBillResponse } from "@/types";
import { getSession } from "../session";
import { IsAccountActive } from "../account-active";
import { setLastSeen } from "../auth/setLastSeen";
import bcrypt from "bcrypt";
import { sendMessage } from "../message/send_message";
import { createNote } from "../message/create-note";
import { TNewExpense } from "@/types";

export async function NewExpenditure({
  amount,
  description,
  recipientName,
  recipientPhoneNumber,
  password,
}: {
  amount: number;
  description: string;
  recipientName: string;
  recipientPhoneNumber: string;
  password: string;
}): Promise<TNewExpense> {
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
        OR: [{ type: "MakePayment" }, { type: "SUPERADMIN" }],
        value: true,
      },
    });
    if (!myPermissions)
      return { error: true, errorMessage: "Permission Denied" };
    const userInfo = await prisma.user.findFirst({
      where: {
        id: session.userId,
      },
    });
    if (!userInfo || !userInfo.active)
      return { error: true, errorMessage: "Permission Denied" };
    const valid = bcrypt.compareSync(password, userInfo.password);
    if (!valid) return { error: true, errorMessage: "Wrong password" };
    await prisma.expenditure.create({
      data: {
        amount,
        description,
        recipientName,
        recipientPhoneNumber,
        staffId: user.id,
        termId: term.id,
        title: description,
      },
    })
    return { error: false, errorMessage: "" };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
