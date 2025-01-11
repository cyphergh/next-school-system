"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export async function GetStudentsOnExercise(exerciseId: string): Promise<{
  error: boolean;
  errorMessage: string;
  records?: Prisma.StudentsOnExerciseGetPayload<{
    include: {
      student: {
        include: {
            images:{
                take:1,
              },
          submissions: {
            include: {
              assessmentScore: true;
            };
          };
        };
      };
      exercise: true;
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
    const records = await prisma.studentsOnExercise.findMany({
      where: {
        exerciseId: exercise.id,
      },
      include: {
        student: {
          include: {
            images:{
                where:{
                    isProfile:true,
                },
                take:1,
              },
            submissions: {
              where: {
                exerciseId: exercise.id,
              },
              include: {
                assessmentScore: true,
              },
            },
          },
        },
        exercise: true,
      },
    });
    return { error: false, errorMessage: "Impl error",records};
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
