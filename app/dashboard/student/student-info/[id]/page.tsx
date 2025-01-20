"use server";

import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import React from "react";
import UI from "./ui";

async function StudentInfo({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId)
    return { error: true, errorMessage: "Refresh page" };
  const user = await prisma.user.findFirst({
    where: {
      id: session.userId,
    },
  });
  if (!user) throw Error("Refresh the page");
  if (!user.active) throw Error("Account suspended" );
  setLastSeen(user.id);
  const me = await prisma.staff.findUnique({
    where: {
      userId: session.userId,
    },
  });
  if (!me) throw Error("Account not found" );
  const student = await prisma.student.findFirst({
    where:{
      id:params.id
    },
    include:{
      mother:true,
      father:true,
      class:{
        include:{
          formMaster:true,
        },
      },
      transactions:{
        take:10,
        orderBy:{
          createdAt:'desc'
        }
      },
      activities:{
        take:10,
        
        orderBy:{
          createdAt:'desc'
        }
      },
      submissions:{
        include:{
          exercise:true,
          assessmentScore:{},
        },
        take:10,
        orderBy:{
          createdAt:'desc'
        }
      },
      images:{
        take:1,
        where:{
          isProfile:true,
        }
      }
    }
  })
  if (!student) throw Error("Student not found" );
  const stages = await prisma.class.findMany({});
  return <UI student={student} stages={stages}></UI>
}

export default StudentInfo;
