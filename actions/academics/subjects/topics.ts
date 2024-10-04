"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { TTopicsResponse } from "@/types";

export async function GetTopics({
  subjectId,
}: {
  subjectId: string;
}): Promise<TTopicsResponse> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Error occurred", topics: [] };
    const user = await prisma.staff.findFirst({
      where: { userId: session.userId },
    });
    if (!user)
      return { error: true, errorMessage: "Client request error", topics: [] };
    if (await IsAccountActive(session.userId))
      return { error: true, errorMessage: "Account suspended", topics: [] };
    setLastSeen(session.userId);
    const subject = await prisma.subject.findFirst({
      where: {
        id: subjectId,
      },
      include: {
        class: true,
      },
    });
    if (!subject) throw Error("Subject Not Found");
    const topics = await prisma.topic.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        subjectId: subject.id,
      },
      include: {
        notes: true,
        exercises: {
          include: {
            _count: true,
          },
        },
        assignment: {
          include: {
            _count: true,
          },
        },
        projectworks: {
          include: {
            _count: true,
          },
        },
        term:true,
      },
    });
    return { error: false, errorMessage: "Implementation error", topics };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString(), topics: [] };
  }
}
