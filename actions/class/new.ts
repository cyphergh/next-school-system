"use server";

import prisma from "@/prisma/db";
import { ClassWithInfo, TGetTeachingStaffInformation } from "@/types";
import { AddStaffActivity, setLastSeen } from "../auth/setLastSeen";
import { getSession } from "../session";
import { IsAccountActive } from "../account-active";

export async function NewClass(params: {
  stageName: string;
  staffId: string;
}): Promise<TGetTeachingStaffInformation> {
  try {
    const classes: ClassWithInfo[] = [];
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
    let isStaffFormMaster = await prisma.staff.findFirst({
      where: {
        id: params.staffId,
        formMaster: null,
      },
    });
    if (!isStaffFormMaster)
      return {
        error: true,
        errorMessage: "Form master has already been assigned to class",
      };
    let ifClassExist = await prisma.class.findUnique({
      where: {
        className: params.stageName,
      },
    });
    if (ifClassExist)
      return { error: true, errorMessage: `${params.stageName} is exist` };
    await AddStaffActivity(
       user.id,
      "CREATED_CLASS",
      `Creating class ${params.stageName}`
    );
    let createdClass = await prisma.class.create({
      data: {
        className: params.stageName,
      },
    });
    await prisma.staff.update({
      where: {
        id: params.staffId,
      },
      data: {
        formMasterId: createdClass.id,
      },
    });
    let staffs = await prisma.staff.findMany({
      where: {
        OR: [{ role: "TEACHING" }, { role: "ADMIN" }],
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
            },
          }
        },
        classPrefect:{
          include:{
            images:{
              take:1
            }
          }
        },
      }
    });
    return { error: false, errorMessage: "", staffs,classes:retClass };
  } catch (error) {
    return { error: true, errorMessage: "Error occurred" };
  }
}
