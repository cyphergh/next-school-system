"use server";

import {
  ExpenditureCancelationRequest,
  TransactionCancelationRequest,
} from "@/types";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { IsAccountActive } from "../account-active";
import { setLastSeen } from "../auth/setLastSeen";

export async function RevokeTransactionCancelation(
  transactionId: string
): Promise<TransactionCancelationRequest> {
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
    const isSuperAdmin = await prisma.permission.findFirst({
      where: {
        staffId: user.id,
        type: "SUPERADMIN",
        value: true,
      },
    });
    const t = await prisma.transaction.findFirst({
      where: isSuperAdmin
        ? {
            id: transactionId,
            status:{
              not:"CANCELED"
            }
          }
        : {
            id: transactionId,
            staffId: user.id,
            status:{
              not:"CANCELED"
            }
          },
    });
    if (!t) return { error: true, errorMessage: "Transaction not found" };
    if (!t.cancelationRequestId)
      return { error: true, errorMessage: "Transaction revoked" };
    await prisma.financialCancelationRequests.delete({
      where: {
        id: t.cancelationRequestId,
      },
    });

    const transactions = await prisma.transaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: isSuperAdmin
        ? {
            status:{
              not:"CANCELED"
            }
          }
        : {
            staffId: user.id,
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
        cancelationRequest: true,
      },
    });
    return { error: false, errorMessage: "", transactions };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
export async function RevokeExpenditureCancelation(
  expenditureId: string
): Promise<ExpenditureCancelationRequest> {
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
    const isSuperAdmin = await prisma.permission.findFirst({
      where: {
        staffId: user.id,
        type: "SUPERADMIN",
        value: true,
      },
    });
    const t = await prisma.expenditure.findFirst({
      where: isSuperAdmin
        ? {
            id: expenditureId,
          }
        : {
            id: expenditureId,
            staffId: user.id,
          },
    });
    if (!t) return { error: true, errorMessage: "Expenditure not found" };
    if (!t.cancelationRequestId)
      return { error: true, errorMessage: "Transaction revoked" };
    await prisma.financialCancelationRequests.delete({
      where: {
        id: t.cancelationRequestId,
      },
    });

    const expenses = await prisma.expenditure.findMany({
      where: isSuperAdmin
        ? { termId: term.id }
        : {
            staffId: user.id,
            termId: term.id,
          },
      include: {
        cancelationRequest: true,
      },
    });
    return { error: false, errorMessage: "", expenses };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
