"use server";
import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import React from "react";
import UI from "./ui";

async function Page() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) throw "Error occurred";
  const user = await prisma.staff.findFirst({
    where: { userId: session.userId },
    include: {
      user: true,
    },
  });
  if (!user) throw "Error occurred";
  if (await IsAccountActive(session.userId)) throw "Account suspended";
  setLastSeen(session.userId);
  const term = await prisma.term.findFirst({
    where: {
      isActve: true,
    },
  });
  const isSuperAdmin = await prisma.permission.findFirst({
    where: {
      staffId: user.id,
      type: "SUPERADMIN",
      value: true,
    },
  });
  if (!isSuperAdmin) throw "Access denied";
  const transactions = await prisma.transaction.groupBy({
    _sum: {
      amount: true, // Summing the amount field
    },
    where: {
      transactionType: "PAYMENT",
      status: "PENDING",
    },
    by: "staffId",
  });
  const resultsWithUser = await Promise.all(
    transactions.map(async (group) => {
      const user = await prisma.staff.findUnique({
        where: { id: group.staffId },
      });
      return {
        ...group,
        user
      };
    })
  );
  const expenses = await prisma.expenditure.groupBy({
    _sum: {
      amount: true,
    },
    where: {
      approved:false,
    },
    by:'staffId'
  });
//   return <div>{JSON.stringify(resultsWithUser)}</div>
  return <UI d={resultsWithUser} ex={expenses}></UI>;
}

export default Page;
