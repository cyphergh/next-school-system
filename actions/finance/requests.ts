"use server";

import prisma from "@/prisma/db";
import { getSession } from "../session";
import { IsAccountActive } from "../account-active";
import { setLastSeen } from "../auth/setLastSeen";
import { FinancialRequestResponse } from "@/types";

export async function GetTransactionRequests(): Promise<FinancialRequestResponse> {
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
    if(!isSuperAdmin) return  { error: true, errorMessage: "Access denied" };

    const requests = await prisma.financialCancelationRequests.findMany({
      where: {},
      include: {
        expenditure: true,
        staff: true,
        transaction: true,
      },
    });
    return { error: false, errorMessage: "",requests };
  } catch (error) {
    return { error: true, errorMessage: "Server error" };
  }
}
