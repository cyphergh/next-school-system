"use server";
import prisma from "@/prisma/db";
import { ClassWithInfo, TGetTeachingStaffInformation } from "@/types";
import { error } from "console";
import { getSession } from "../session";
import { setLastSeen } from "../auth/setLastSeen";
import { IsAccountActive } from "../account-active";

export async function GetTeachingStaffWithNoClass(): Promise<TGetTeachingStaffInformation> {
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
    if(await IsAccountActive(session.userId))
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
      return { error: true, errorMessage: "Permission Denied" };
    let staffs = await prisma.staff.findMany({
      where: {
        OR:[
          {role: "TEACHING",},
          {role: "ADMIN",},
        ],
        formMasterId: null,
      },
      include: {
        permissions: {
          take: 1,
        },
        images: {
          take: 1,
        },
        user: {},
      },
    });
    let retClass = await prisma.class.findMany({
      where: {},
      include:{
        formMaster:{
          include:{
            images:{
              take:1,
            }
          }
        },
        classPrefect:{
          include:{
            images:{
              take:1,
            }
          }
        },
      }
    });
    if (!staffs)
      return { error: true, errorMessage: "No teaching staff", };
    return { error: false, errorMessage: "", staffs: staffs, classes:retClass };
  } catch (error) {
    return { error: true, errorMessage: "Error occurred" };
  }
}
