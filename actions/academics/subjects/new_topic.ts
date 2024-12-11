"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { TTopicsResponse } from "@/types";

export async function AddTopic(
  title: string,
  subjectId: string
): Promise<TTopicsResponse> {
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
    const term = await prisma.term.findFirst({
      where: {
        isActve: true,
      },
    });
    if (!term) throw new Error("Create a new term first");
    if (!title)
      return {
        error: false,
        errorMessage: "Title cannot be empty",
        topics: [],
      };
    const exist = await prisma.topic.findFirst({
      where: {
        title: title.toLowerCase(),
      },
    });
    if (exist)
      return { error: false, errorMessage: "Title already exist", topics: [] };
    const subject = await prisma.subject.findFirst({
      where: {
        id: subjectId,
      },
    });
    if (!subject)
      return { error: false, errorMessage: "Subject not found", topics: [] };
    const topic = await prisma.topic.create({
      data: {
        title: title.toLowerCase(),
        subjectId: subject.id,
        termId: term.id,
      },
    });
    const topics = await prisma.topic.findMany({
        orderBy: {
            createdAt: "desc",
          },
      where: {
        subjectId:subject.id
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
        subject:true,
      },
    });
    return { error: false, errorMessage: "Implementation error", topics };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString(), topics: [] };
  }
}
