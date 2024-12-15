"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { getWAECGrade } from "./func";

export async function Record(
  examId: string,
  subjectId: string,
  classScore: number,
  examScore: number,
  studentId:string,
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
    const term = await prisma.term.findFirst({
      where: {
        isActve: true,
      },
    });
    const examination = await prisma.examination.findFirst({
        where:{
            id:examId,
            open:true,
        }
    });
    if(!examination) throw "Examination is not open"
    if(!examination.open) throw "Exams is not open"
    let total:number =0;
    let cs:number|null = classScore;
    let es:number|null = examScore;
    let done:boolean = true;
    if(isNaN(examScore)){
        es = null;
        done=false;
    }else{
        es = examScore;
        total += examScore*(((100-examination.classScorePercent)/100));
    }
    if(isNaN(classScore)){
        cs = null
        done=false;
    }else{
        cs = classScore;
        total += classScore*(((examination.classScorePercent)/60));
    }
    const gg = getWAECGrade(Math.round(total));

    if (!term) throw new Error("Create a new term first");
    const examsRecord = await prisma.examRecords.upsert({
        where:{   
            examId_studentId_subjectId:{
                examId:examId,
                studentId:studentId,
                subjectId:subjectId
            }
        },
        create:{
            grade:gg.grade,
            Remark:gg.remarks,
            total:Math.round(total),
            classScore:cs,
            examScore:es,
            done:done,
            examId:examId,
            studentId:studentId,
            subjectId:subjectId,            
        },
        update:{
            grade:gg.grade,
            Remark:gg.remarks,
            total:Math.round(total),
            classScore:cs,
            examScore:es,
            done:done,
            examId:examId,
            studentId:studentId,
            subjectId:subjectId,            
        }
    });
    return { error: false };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
