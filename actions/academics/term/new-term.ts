"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { TGetTerms } from "@/types";

export async function CreateTerm({
  name,
}: {
  name: string;
}): Promise<TGetTerms> {
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
    const currentYear = new Date().getFullYear();

    const exist = await prisma.term.findFirst({
      where: {
        name: name.toLowerCase(),
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
    });
    if(exist) return { error: true, errorMessage: "You've already created a term with this name for this yea" };
    const total = await prisma.term.count({});
    let v;
    total<1?v=true:v=false 
    await prisma.term.create({
      data: {
        name: name.toLowerCase(),
        isActve:v
      },
    });
    const terms = await prisma.term.findMany({
        orderBy: {
            isActve: "desc",
        }
    });
    return { error: false, terms, errorMessage: "" };
  } catch (error) {
    return { error: true, errorMessage: "Error Occurred" };
  }
}
