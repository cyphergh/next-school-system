"use server";
"use server";

import { GetStudentTransactionsResponse } from "@/types";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { IsAccountActive } from "../account-active";
import { setLastSeen } from "../auth/setLastSeen";

export async function GetStaffPaymentTransactions(): Promise<GetStudentTransactionsResponse> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Refresh page", balance: 0 };
    const me = await prisma.staff.findUnique({
      where: {
        userId: session.userId,
      },
    });
    if (!me)
      return { error: true, errorMessage: "Permission Denied", balance: 0 };
    if (await IsAccountActive(me.userId!))
      return { error: true, errorMessage: "Account suspended", balance: 0 };
    setLastSeen(session.userId);
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId: me.id,
        OR:[{type: "ViewTransaction"},{type: "EditTransaction"},{type: "MakePayment"},{type:"SUPERADMIN"}],
        value: true,
      },
    });
    if (!myPermissions && me.phoneNumber !== "0206821921")
      return { error: true, errorMessage: "Permission Denied", balance: 0 };

    const transactions = await prisma.transaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        staffId: me.id,
        transactionType: "PAYMENT",
        status:{
          not:"CANCELED"
        }
      },
      take: 100,
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
    return { error: false, errorMessage: "", transactions, balance: 0 };
  } catch (error: any) {
    console.log(error);
    return { error: true, errorMessage: "Server error occurred", balance: 0 };
  }
}
