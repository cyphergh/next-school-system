"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";

export async function GetStudentsOnAssignment(assignmentId: string): Promise<{
  error: boolean;
  errorMessage: string;
  records?: Prisma.StudentOnAssignmentGetPayload<{
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
      assignment: true;
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
    const records = await prisma.studentOnAssignment.findMany({
      where: {
        assignmentId: assignment.id,
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
                assignmentId: assignment.id,
              },
              include: {
                assessmentScore: true,
              },
            },
          },
        },
        assignment: true,
      },
    });
    return { error: false, errorMessage: "Impl error",records};
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
