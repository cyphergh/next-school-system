"use server";

import { StaffWithPermission, TFIndAllStaff } from "@/types";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { setLastSeen } from "../auth/setLastSeen";
import { cookies } from "next/headers";

export async function FindAllStaff(): Promise<TFIndAllStaff> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Refresh page" };
    const user = await prisma.user.findFirst({
      where: {
        id: session.userId,
      },
    });
    if (!user) return { error: true, errorMessage: "Refresh the page" };
    if (!user.active)
      return { error: true, errorMessage: "Account suspended" };
    setLastSeen(user.id);
    const me = await prisma.staff.findUnique({
      where: {
        userId: session.userId,
      },
    });
    if(!me)  return { error: true, errorMessage: "Permission Denied" };
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId:me.id,
        OR: [{ type: "AddStaffInfo" }, { type: "EditStaffInfo" }],
        value: true,
      },
    });
    const staffs = await prisma.staff.findMany({
      include: {
        permissions: {},
        user: {},
        images: {
          take: 1,
          where: {
            isProfile: true,
          },
        },
      },
      where:{
        NOT:{
          phoneNumber:process.env.DEV_NUMBER
        }
      }
    });
    // if (staffs.length > 1 && me.phoneNumber !== "0206821921") {
    //   if (!myPermissions)
    //     return { error: true, errorMessage: "Permission Denied" };
    //   if (!myPermissions.value)
    //     return { error: true, errorMessage: "Permission Denied" };
    // }
    return { error: false, errorMessage: "", staffs };
  } catch (error) {
    return { error: true, errorMessage: "Reload page" };
  }
}
