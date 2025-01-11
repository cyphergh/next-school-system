'use server'

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client"

export async function GetStudentsOnExercise(
    exerciseId:string
):Promise<{
    error:boolean,
    errorMessage:string,
    students?:Prisma.StudentsOnExerciseGetPayload<{
        include:{
          student:true,
          exercise:true,
        }
      }>[],
    submissions?:Prisma.SubmissionGetPayload<{
        include:{
          assessmentScore:true,
        }
      }>[],
}>{
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
        if(!term) throw "No Active Term";
        const exercise = await prisma.exercise.findFirst({
            where:{
                id:exerciseId,
                termId:term.id,
            },
            include:{
                subject:true,
            }
        });
        if(!exercise) throw "Exercise not found";
        if(exercise.subject.staffId != user.id) throw "Permission Denied";

        return {error:true,errorMessage:"Impl error"}
    } catch (error:any) {
        return {error:true,errorMessage:error.toString()}
    }
}