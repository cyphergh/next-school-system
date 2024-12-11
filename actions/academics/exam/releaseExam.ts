"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";

export async function ReleaseExam(
  id: string
): Promise<{ error: boolean; errorMessage?: string }> {
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
      return { error: true, errorMessage: "Permission Denied" };
    const examination = await prisma.examination.findFirst({
        where:{
            id:id
        }
    });
    if(!examination) return { error: true, errorMessage: "Exams not found" };
    await prisma.$transaction(async(prisma)=>{
      const classes =  await prisma.class.findMany({
        include:{
            subjects:true,
            students:true,
        }
      })
      for (let i=0;i<classes.length;i++){
        const stage = classes[i];
        for (let j=0;j<stage.students.length;j++){
            const student = stage.students[j];
            let totalScore = 0;
            for(let a=0;a<stage.subjects.length;a++){
                const subject = stage.subjects[a];
                const record = await prisma.examRecords.findFirst({
                    where:{
                        studentId:student.id,
                        subjectId:subject.id,
                    }
                })
                if(!record) throw "Can't release exam. Pending results";
                totalScore += Math.round(record.total)
            }
            const grade = 0;
            const position=0;
            await prisma.releaseExams.create({
                data:{
                    totalScore,
                    classId:stage.id,
                    examId:examination.id,
                    studentId:student.id,
                    termId:term.id,
                    grade,
                    position,
                    
                }
            })
        }
      }
    })
    return { error: true, errorMessage: "Implementation error" };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
