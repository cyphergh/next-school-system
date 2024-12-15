"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export async function ReleaseExam(
  id: string
): Promise<{ error: boolean; errorMessage?: string,exams?:Prisma.ExaminationGetPayload<{
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
}>[] }> {
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
      await prisma.examination.update({
        where:{
          id:examination.id
        },
        data:{
          release:true,
          open:false,
        }
      })
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
            let core = [];
            let elective = [];
            for(let a=0;a<stage.subjects.length;a++){
                const subject = stage.subjects[a];
                const record = await prisma.examRecords.findFirst({
                    where:{
                        studentId:student.id,
                        subjectId:subject.id,
                    }
                })
                if(subject.isCore){
                    core.push(record)
                }else{
                    elective.push(record)
                }
                if(!record) throw "Can't release exam. Pending results";
                totalScore += Math.round(record.total)
            }
            let grade = 0;
            const position=0;
            core.sort((a,b)=>b?.total!-a?.total!);
            elective.sort((a,b)=>b?.total!-a?.total!);
            // !Calculating the core grade
             grade = core.reduce((acc, item) => acc + item?.grade!, 0);
            // !Adding 2 best elective grade
            grade += elective.slice(0,2).reduce((acc, item) => acc + item?.grade!, 0)
            await prisma.releaseExams.upsert({
                where:{
                    termId_studentId_examId:{
                        termId:term.id,
                        studentId:student.id,
                        examId:examination.id,
                    }
                },
                create:{
                    totalScore,
                    classId:stage.id,
                    examId:examination.id,
                    studentId:student.id,
                    termId:term.id,
                    grade,
                    position,
                },
                update:{
                    totalScore,
                    classId:stage.id,
                    examId:examination.id,
                    studentId:student.id,
                    termId:term.id,
                    grade,
                    position,
                },
            })
        }
        // ! Calculating positions
        const allResults = await prisma.releaseExams.findMany({
          where:{
            classId:stage.id,
            examId:examination.id,
          }
        });
        for (let j=0;j<stage.students.length;j++){
          const student = stage.students[j]
          const myTotalScore = allResults.find((e)=>e.studentId==student.id)?.totalScore;
          const myGrade = allResults.find((e)=>e.studentId==student.id)?.grade;
          if(!myTotalScore) throw `${student.firstName} ${stage.className} Total Score Is Invalid`;
          let pos = 1;
          allResults.forEach((e)=>{
            if(e.totalScore>myTotalScore) pos++;
          });
          await prisma.releaseExams.update({
            where:{
              termId_studentId_examId:{
                termId:term.id,
                studentId:student.id,
                examId:examination.id
              }
            },
            data:{
              position:pos
            }
          });
          console.log(student.firstName,pos, myTotalScore,myGrade)
        }
        const res = await prisma.releaseExams.findMany({
          where:{
            examId:examination.id
          }
        });
      }
    });
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
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
