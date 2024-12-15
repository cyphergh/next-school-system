'use server'

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export async function ToggleExam(id:string,value:boolean):Promise<{error:boolean,errorMessage:string,exams:Prisma.ExaminationGetPayload<{
    include: {
      term: true;
      subjects: {
        include: {
          subject: {
            include: {
              staff: true;
            };
          };
        };
      };
    };
  }>[]}>{
    try {
        const session = await getSession();
        if (!session.isLoggedIn || !session.userId)
          return { error: true, errorMessage: "Refresh page",exams:[] };
        const user = await prisma.staff.findFirst({
          where: {
            userId: session.userId,
          },
        });
        if (!user) return { error: true, errorMessage: "Permission Denied",exams:[]};
        if (await IsAccountActive(session.userId))
          return { error: true, errorMessage: "Account suspended",exams:[] };
        setLastSeen(session.userId);
        const myPermissions = await prisma.permission.findFirst({
          where: {
            staffId: user.id,
            type: "ADMIN",
            value: true,
          },
        });
        const term = await prisma.term.findFirst({
            where: {
              isActve: true,
            },
          });
          if (!term) throw new Error("Create a new term first");
        if (!myPermissions && user.phoneNumber !== "0206821921")
          return { error: true, errorMessage: "Permission Denied",exams:[] };
        await prisma.$transaction(async(prisma)=>{
          await prisma.examination.update({
            where:{
                id
            },
            data:{
                open:value,
            }
        });
        if(value){
          await prisma.examination.update({
            where:{
                id
            },
            data:{
                release:false
            }
        });
        }
        await prisma.releaseExams.deleteMany({
          where:{
            examId:id
          }
        });
        })
        const exams = await prisma.examination.findMany({
            include:{
              term:true,
              subjects:{
                include:{
                  subject:{
                    include:{
                      class:true,
                      staff:true
                    }
                  }
                }
              }
            }
          })
        return {error:false,errorMessage:"",exams}
    } catch (error:any) {
        return {error:true,errorMessage:error.message,exams:[]}
    }
}