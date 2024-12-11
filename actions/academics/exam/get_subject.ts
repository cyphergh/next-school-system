'use server'

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { error } from "console"

export async function getSubject(id:string,examId:string):Promise<{error:boolean,errorMessage?:string,subject?:Prisma.SubjectGetPayload<{
    include:{
        examRecords:true,
        exams:true,
        class:{
            include:{
                students:true,
            }
        }
    }
}>}> {
    try {
        const session = await getSession();
        if (!session.isLoggedIn || !session.userId)
          return { error: true, errorMessage: "Refresh page" };
        const user = await prisma.staff.findFirst({
          where: {
            userId: session.userId,
          },
        });
        if (!user) return { error: true, errorMessage: "Permission Denied" };
        if (await IsAccountActive(session.userId))
          return { error: true, errorMessage: "Account suspended" };
        setLastSeen(session.userId);
        const term = await prisma.term.findFirst({
            where: {
              isActve: true,
            },
          });
          if (!term) throw new Error("Create a new term first");
        const subject = await prisma.subject.findFirst({
            where:{
                staffId:user.id,
                id:id
            },
            include:{
                examRecords:{
                    where:{
                        examId:examId
                    }
                },
                exams:{
                    where:{
                        examId:examId
                    }
                },
                class:{
                    include:{
                        students:{
                            where:{
                                stopped:false
                            }
                        }
                    }
                }
            }
        })
        if(!subject) throw "Subject not found";
        return {error:false,errorMessage:'',subject}
    } catch (error:any) {
        return {error:true,errorMessage:error.message}
        
    }
}