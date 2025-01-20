'use server'

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export async function RecordAssignment({assignmentId,soeId,score,studentId}:{
    assignmentId:string,
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
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        termId: term.id,
      },
      include: {
        subject: true,
      },
    });
    if (!assignment) throw "Assignment not found";
    if (assignment.subject.staffId != user.id) throw "Permission Denied";
    const student = await prisma.student.findFirst({
        where:{
            id:studentId
        }
    });
    if(!student)throw "Student not found";
    const studentOnAssignment = await prisma.studentOnAssignment.findFirst({
        where:{
            studentId:student.id,
            assignmentId:assignment.id,
        }
    });
    if(!studentOnAssignment) throw "Assignment was not assigned to this student";
    await prisma.$transaction(async(db)=>{
        let isNew:boolean;
        const submission = await db.submission.upsert({
            where:{
                studentId_assignmentId:{
                    studentId:student.id,
                    assignmentId:assignment.id,
                }
            },
            update:{
                updatedAt:new Date(Date.now())
            },
            create:{
                studentId:student.id,
                assignmentId:assignment.id,
                termId:term.id,
            },
        })
        if(submission.createdAt.toString() != submission.updatedAt.toString()){
            isNew=false;
        }else{
            isNew=true;
        }
        const isRecorded = await db.assessmentScore.upsert({
            where:{
              studentId_submissionId:{
                studentId:student.id,
                submissionId:submission.id,
              },
            },
            update:{
                score,
                maxScore:assignment.totalScore,
                updatedAt:new Date(Date.now()),
                type:"ASSIGNMENT",
            },
            create:{
                maxScore:assignment.totalScore,
                score,
                type:"ASSIGNMENT",
                studentId:student.id,
                submissionId:submission.id,
                termId:term.id,
                subjectId:assignment.subjectId,
            }
        })
        if(isNew){
            await prisma.assignment.update({
                where:{
                    id:assignment.id
                },
                data:{
                    totalMarked:assignment.totalMarked+1
                }
            })
        }
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
      assignment: true;
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
      include: { subject: true, assignment: {
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
