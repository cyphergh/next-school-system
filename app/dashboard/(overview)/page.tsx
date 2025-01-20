import { getSession } from "@/actions/session";
import React from "react";
import UI from "./ui";
import prisma from "@/prisma/db";

async function Dashboard() {
  const session = await getSession();
  const user = await prisma.staff.findFirst({
    where: { userId: session.userId },
  });
  if (!user) throw "!Oops";
  const term = await prisma.term.findFirst({
    where: {
      isActve: true,
    },
  });
  if (!term) throw new Error("CreateActivate a new term first");
  const subjects = await prisma.subject.findMany({
    where: {
      staffId: user.id,
    },
    include: {
      class: true,
      notes: {
        where: {
          termId: term.id,
        },
      },
      exercises: {
        where: {
          termId: term.id,
        },
      },
      assignment: {
        where: {
          termId: term.id,
        },
      },
      topics: {
        where: {
          termId: term.id,
        },
      },
    },
  });
  const transactions = await prisma.transaction.findMany({
    where:{
      staffId:user.id
    },
    orderBy:{
      createdAt:'desc'
    },
    take:10,
  });
  return <UI subjects={subjects} transactions={transactions}></UI>;
}

export default Dashboard;
