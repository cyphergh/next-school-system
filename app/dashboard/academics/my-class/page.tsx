import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import React from "react";
import UI from "./ui";

async function Page() {
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
  const subjects = await prisma.subject.findMany({
    where: {
        staffId:user.id
    },
    orderBy:{
        classId:"asc"
    },
    include:{
        class:true
    }
  });
  if(!subjects) return <div className="flex-1 text-center">
    <h1>No subjects found</h1>
  </div>
  return <UI subjects={subjects} />
}

export default Page;
