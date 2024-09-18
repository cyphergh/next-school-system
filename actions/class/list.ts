"use server";

import { TClassList } from "@/types";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { setLastSeen } from "../auth/setLastSeen";
import { IsAccountActive } from "../account-active";

export async function ListClasses(): Promise<TClassList> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Error occurred" };
    const user = await prisma.staff.findFirst({
      where: { userId: session.userId },
    });
    if (!user) return { error: true, errorMessage: "Error occurred" };
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

    if (!myPermissions && user.phoneNumber !== "0206821921")
      return { error: true, errorMessage: "Error occurred" };

    const classes = await prisma.class.findMany({
      include: {
        students: {},
      },
      where: {
        disabled: false,
      },
    });
    if (!classes) return { error: true, errorMessage: "Error occurred" };
    return { error: false, errorMessage: "", classes: classes };
  } catch (error) {
    return { error: true, errorMessage: "Error occurred" };
  }
}
