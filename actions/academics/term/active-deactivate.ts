"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { TGetTerms } from "@/types";

export async function ActiveTerm(termId: string): Promise<TGetTerms> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Refresh page" };
    const user = await prisma.staff.findUnique({
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
        type: "SUPERADMIN",
        value: true,
      },
    });
    if (!myPermissions)
      return { error: true, errorMessage: "Permission Denied" };
    const termToEdit = await prisma.term.findFirst({
        where:{
            id:termId,
        }
    });
    if(!termToEdit) return { error: true, errorMessage: "Error Occurred" };
    await prisma.term.updateMany({
        where:{
            isActve:true
        },
        data:{
            isActve:false
        }
    });
    await prisma.term.update({
        where:{
            id:termId
        },
        data:{
            isActve:true
        }
    })
    const terms = await prisma.term.findMany({
      orderBy: {
        isActve: "desc",
      },
    });
    return { error: false, terms, errorMessage: "" };
  } catch (error) {
    return { error: true, errorMessage: "Error Occurred" };
  }
}
export async function DeActiveTerm(termId: string): Promise<TGetTerms> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Refresh page" };
    const user = await prisma.staff.findUnique({
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
        type: "SUPERADMIN",
        value: true,
      },
    });
    if (!myPermissions)
      return { error: true, errorMessage: "Permission Denied" };
    const termToEdit = await prisma.term.findFirst({
        where:{
            id:termId,
        }
    });
    if(!termToEdit) return { error: true, errorMessage: "Error Occurred" };
    await prisma.term.update({
        where:{
            id:termId
        },
        data:{
            isActve:false
        }
    })
    const terms = await prisma.term.findMany({
      orderBy: {
        isActve: "desc",
      },
    });
    return { error: false, terms, errorMessage: "" };
  } catch (error) {
    return { error: true, errorMessage: "Error Occurred" };
  }
}
