"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export async function ReleaseExam(id: string): Promise<{
  error: boolean;
  errorMessage?: string;
  exams?: Prisma.ExaminationGetPayload<{
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
  }>[];
}> {
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
      where: {
        id: id,
      },
    });
    if (!examination) return { error: true, errorMessage: "Exams not found" };
    await prisma.$transaction(async (prisma) => {
      await prisma.examination.update({
        where: {
          id: examination.id,
        },
        data: {
          release: true,
          open: false,
        },
      });
      const classes = await prisma.class.findMany({
        include: {
          subjects: true,
          students: true,
        },
      });
      let totalStudents =0;
      for (let i = 0; i < classes.length; i++) {
        totalStudents =0;
        const stage = classes[i];
        for (let j = 0; j < stage.students.length; j++) {
          const student = stage.students[j];
          let totalScore = 0;
          let core = [];
          let elective = [];
          for (let a = 0; a < stage.subjects.length; a++) {
            const subject = stage.subjects[a];
            const record = await prisma.examRecords.findUnique({
              where: {
                examId_studentId_subjectId: {
                  studentId: student.id,
                  subjectId: subject.id,
                  examId: examination.id,
                },
              },
            });
            const eT = Date.parse(examination.createdAt.toString());
            const sT = Date.parse(student.createdAt.toString());
            if (!record && eT > sT)
              throw `No marks recorded for ${student.firstName} ${student.lastName} ${subject.name} ${stage.className}`;
            if (subject.isCore) {
              core.push(record);
            } else {
              elective.push(record);
            }
            if (!record) {
              totalScore = 0;
            } else {
              totalScore += Math.round(record.total);
            }
          }
          let grade = 0;
          const position = 0;
          core.sort((a, b) => b?.total! - a?.total!);
          elective.sort((a, b) => b?.total! - a?.total!);
          // !Calculating the core grade
          grade = core.reduce((acc, item) => acc + item?.grade!, 0);
          // !Adding 2 best elective grade
          grade += elective
            .slice(0, 2)
            .reduce((acc, item) => acc + item?.grade!, 0);
          const eT = Date.parse(examination.createdAt.toString());
          const sT = Date.parse(student.createdAt.toString());
          await prisma.releaseExams.upsert({
            where: {
              termId_studentId_examId: {
                termId: term.id,
                studentId: student.id,
                examId: examination.id,
              },
            },
            create: {
              totalScore,
              classId: stage.id,
              examId: examination.id,
              studentId: student.id,
              termId: term.id,
              grade,
              position,
              totalStudents: stage.students.length,
            },
            update: {
              totalScore,
              classId: stage.id,
              examId: examination.id,
              studentId: student.id,
              termId: term.id,
              grade,
              position,
              totalStudents: stage.students.length,
            },
          });
          if (eT < sT && totalScore == 0) {
            await prisma.releaseExams.deleteMany({
              where: {
                studentId: student.id,
                examId: examination.id,
              },
            });
          }else{
            totalStudents++;
          }
        }
        await prisma.releaseExams.updateMany({
          where: {
            classId:stage.id,
            examId:examination.id,
          },
          data: {
            totalStudents:totalStudents
          },
        });
        // ! Calculating positions
        const allResults = await prisma.releaseExams.findMany({
          where: {
            classId: stage.id,
            examId: examination.id,
          },
        });
        for (let j = 0; j < stage.students.length; j++) {
          const student = stage.students[j];
          let myTotalScore = allResults.find(
            (e) => e.studentId == student.id
          )?.totalScore;
          const myGrade = allResults.find(
            (e) => e.studentId == student.id
          )?.grade;
          if (!myTotalScore) myTotalScore = 0;
          let pos = 1;
          allResults.forEach((e) => {
            if (e.totalScore > myTotalScore) pos++;
          });
          const release = await prisma.releaseExams.findFirst({
            where: {
              termId: term.id,
              studentId: student.id,
              examId: examination.id,
            },
          });
          if (release) {
            await prisma.releaseExams.update({
              where: {
                termId_studentId_examId: {
                  termId: term.id,
                  studentId: student.id,
                  examId: examination.id,
                },
              },
              data: {
                position: pos,
              },
            });
          }
        }
        const res = await prisma.releaseExams.findMany({
          where: {
            examId: examination.id,
          },
        });
      }
    });
    const exams = await prisma.examination.findMany({
      include: {
        term: true,
        subjects: {
          include: {
            subject: {
              include: {
                class: true,
                staff: true,
              },
            },
          },
        },
      },
    });
    return { error: false, errorMessage: "", exams };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
