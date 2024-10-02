"use server";

import { FinancialRequestResponse } from "@/types";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { IsAccountActive } from "../account-active";
import { setLastSeen } from "../auth/setLastSeen";

export async function DeclinedRequest(
  requestId: string
): Promise<FinancialRequestResponse> {
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
    if (!isSuperAdmin) return { error: true, errorMessage: "Access denied" };
    await prisma.$transaction(async (prisma) => {
      const req = await prisma.financialCancelationRequests.findFirst({
        where: {
          id: requestId,
        },
        include: {
          transaction: true,
          expenditure: true,
        },
      });
      if (!req) throw Error("Request not found");
      if (req.transaction) {
        await prisma.transaction.update({
          where: {
            id: req.transaction.id,
          },
          data: {
            cancelationRequestId: null,
          },
        });
      }
      if (req.expenditure) {
        await prisma.expenditure.update({
          where: {
            id: req.expenditure.id,
          },
          data: {
            cancelationRequestId: null,
          },
        });
      }
      await prisma.financialCancelationRequests.delete({
        where: {
          id: requestId,
        },
      });
    });
    const requests = await prisma.financialCancelationRequests.findMany({
      where: {},
      include: {
        expenditure: true,
        staff: true,
        transaction: true,
      },
    });
    return { error: false, errorMessage: "", requests };
  } catch (error) {
    return { error: true, errorMessage: "Server error" };
  }
}
