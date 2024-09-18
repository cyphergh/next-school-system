"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { TGetTerms } from "@/types";

export async function GetTerms():Promise<TGetTerms> {
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
    const terms = await prisma.term.findMany({
        orderBy: {
            isActve: "desc",
        }
    });
    return { error: false, terms,errorMessage:"" };
  } catch (error) {
    return { error: true, errorMessage: "Error Occurred" };
  }
}
