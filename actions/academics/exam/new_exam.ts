"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";

export async function CreateExam({
  body,
}: {
  body: {
    title: string;
    showPosition: boolean;
    showGrade: boolean;
    classScoreSource: "System" | "Manual" | "Full";
    classScorePercent: number;
    minimumScore: number;
    dueDate: Date;
    subjects: string[];
  };
}): Promise<{ error: Boolean; errorMessage?: String }> {
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
    await prisma.$transaction(async(prisma)=>{
      const examination = await prisma.examination.create({
        data:{
            title:body.title,
            date:body.dueDate,
            showGrade:body.showGrade,
            showPosition:body.showPosition,
            classScoreSource:body.classScoreSource as "System" | "Manual" | "Full",
            classScorePercent:body.classScorePercent,
            minimumExamScore:body.minimumScore,
            termId:term.id,
        }
      });
      for(let i=0;i<body.subjects.length;i++){
        const subjects = await prisma.examinationSubjects.create({
            data:{
                examId:examination.id,
                subjectId:body.subjects[i],
            }
        })
      }
    })
    return { error: false };
  } catch (error) {
    return { error: true, errorMessage: "Error Occurred" };
  }
}
