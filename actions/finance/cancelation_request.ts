"use server";

import {
  ExpenditureCancelationRequest,
  TransactionCancelationRequest,
} from "@/types";
import { getSession } from "../session";
import { setLastSeen } from "../auth/setLastSeen";
import { IsAccountActive } from "../account-active";
import prisma from "@/prisma/db";

export async function RequestExpenditureCancelation(
  expenditureId: string,
  reason: string
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
    await prisma.$transaction(async (prisma) => {
      const expense = await prisma.expenditure.findFirst({
        where: isSuperAdmin
          ? {
              id: expenditureId,
            }
          : {
              id: expenditureId,
              staffId: user.id,
            },
        include: {
          cancelationRequest: true,
        },
      });
      if (!expense) throw Error("Expenditure not found");
      if (expense.cancelationRequest)
        throw Error("Cancelation request already sent");
      const m = await prisma.financialCancelationRequests.create({
        data: {
          reason,
          staffId: user.id,
        },
      });
      await prisma.expenditure.update({
        where: {
          id: expenditureId,
        },
        data: {
          cancelationRequestId:m.id
        },
      });
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

export async function RequestTransactionCancelation(
  transactionId: string,
  reason: string
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
    await prisma.$transaction(async (prisma) => {
      const term = await prisma.term.findFirst({
        where: {
          isActve: true,
        },
      });

      const myPermissions = await prisma.permission.findFirst({
        where: {
          staffId: user.id,
          OR: [{ type: "SUPERADMIN" }],
          value: true,
        },
      });
      const transaction = await prisma.transaction.findFirst({
        where: !isSuperAdmin
          ? {
              id: transactionId,
              staffId: user.id,
              status:{
                not:"CANCELED"
              }
            }
          : {
              id: transactionId,
              status:{
                not:"CANCELED"
              }
            },
        include: {
          cancelationRequest: true,
        },
      });
      if (!transaction) throw Error("You don't own this transaction");
      if (transaction.cancelationRequest)
        throw Error("You have already requested to cancel this transaction");
      const m = await prisma.financialCancelationRequests.create({
        data: {
          reason,
          staffId: user.id,
        },
      });
      await prisma.transaction.update({
        where: {
          id: transactionId,
        },
        data: {
          cancelationRequestId: m.id,
        },
      });
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
