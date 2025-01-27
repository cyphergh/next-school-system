'use server'

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export async function RecordExercise({exerciseId,soeId,score,studentId}:{
    exerciseId:string,
    soeId:string,
    score:number,
    studentId:string
}):Promise<{error:boolean,errorMessage:string,}>{
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
    if (!term) throw "No Active Term";
    const exercise = await prisma.exercise.findFirst({
      where: {
        id: exerciseId,
        termId: term.id,
      },
      include: {
        subject: true,
      },
    });
    if (!exercise) throw "Exercise not found";
    if (exercise.subject.staffId != user.id) throw "Permission Denied";
    const student = await prisma.student.findFirst({
        where:{
            id:studentId
        }
    });
    if(!student)throw "Student not found";
    const studentOnExercise = await prisma.studentsOnExercise.findFirst({
        where:{
            studentId:student.id,
            exerciseId:exercise.id,
        }
    });
    if(!studentOnExercise) throw "Exercise was not assigned to this student";
    await prisma.$transaction(async(db)=>{
        let isNew:boolean;
          const submission = await db.submission.upsert({
              where:{
                  studentId_exerciseId:{
                      studentId:student.id,
                      exerciseId:exercise.id,
                  }
              },
              update:{
                  updatedAt:new Date(Date.now())
              },
              create:{
                  studentId:student.id,
                  exerciseId:exercise.id,
                  termId:term.id,
              },
          })
        if(submission.createdAt.toString() != submission.updatedAt.toString()){
            isNew=false;
        }else{
            isNew=true;
        }
        console.log(isNew,"Welcome")
        const isRecorded = await db.assessmentScore.upsert({
            where:{
              studentId_submissionId:{
                studentId:student.id,
                submissionId:submission.id,
              },
            },
            update:{
                score,
                maxScore:exercise.totalScore,
                updatedAt:new Date(Date.now())
            },
            create:{
                maxScore:exercise.totalScore,
                score,
                type:"EXERCISE",
                studentId:student.id,
                submissionId:submission.id,
                termId:term.id,
                subjectId:exercise.subjectId,
            }
        })
        if(isNew){
            await prisma.exercise.update({
                where:{
                    id:exercise.id
                },
                data:{
                    totalMarked:exercise.totalMarked+1
                }
            })
        }
        await prisma.studentsOnExercise.update({
            where:{
                studentId_exerciseId:{
                  exerciseId:exercise.id,
                  studentId:student.id
                }
            },
            data:{
                submitted:true
            }
        })
    })
    return {error:false,errorMessage:''}
 } catch (error:any) {
    return {error:true,errorMessage:error.toString()}
 }
}



export async function GetTopic(id:string):Promise<{
  error:boolean,
  errorMessage:string,
  topic?: Prisma.TopicGetPayload<{
    include: {
      subject: true;
      exercises: true;
    };
  }>
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
    if (!term) throw "No Active Term";
    const topic = await prisma.topic.findUnique({
      where: { id: id,termId:term.id },
      include: { subject: true, exercises: {
        orderBy:{
          createdAt:'desc'
        }
      } },
    });
    if (!topic) throw "Topic not found";
    return {error:false,errorMessage:'',topic}
 } catch (error:any) {
    return {error:true,errorMessage:error.toString()}
 }
}
