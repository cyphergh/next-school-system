"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { TGetClassFullInfo } from "@/types";

export async function ChangeFormMaster({
  classId,
  newFormMaster,
  formMaster,
}: {
  classId: string;
  newFormMaster: string;
  formMaster: string;
}): Promise<TGetClassFullInfo> {
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
    const newStaff = await prisma.staff.findFirst({
      where: {
        id: newFormMaster,
      },
    });
    if (!newStaff) return { error: true, errorMessage: "Staff Does Not Exist" };
    if (newStaff.formMasterId)
      return {
        error: true,
        errorMessage: "Staff already assigned to class use swap",
      };
    await prisma.staff.update({
      where: {
        id: formMaster,
      },
      data: {
        formMasterId: null,
      },
    });
    await prisma.staff.update({
      where: {
        id: newFormMaster,
      },
      data: {
        formMasterId: classId,
      },
    });
    const classInfo = await prisma.class.findFirst({
      where: {
        id: classId,
      },

      include: {
        formMaster: {
          include: {
            images: {
              take: 1,
            },
          },
        },
        subjects: {
          orderBy: [{ updatedAt: "desc" }],
          include: {
            staff: {
              include: {
                images: {
                  take: 1,
                },
              },
            },
          },
        },
        students: {
          orderBy: [{ updatedAt: "desc" }],
          include: {
            images: {
              take: 1,
            },
          },
        },
        classPrefect: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    });
    const teachers = await prisma.staff.findMany({
      include: {
        images: {
          take: 1,
        },
      },
      where: {
        OR: [
          {
            role: "TEACHING",
          },
          {
            role: "ADMIN",
          },
        ],
      },
    });
    if (!teachers)
      return { error: true, errorMessage: "No Staff Available For Subject" };
    if (!classInfo) return { error: true, errorMessage: "Class Not Found " };
    return {
      error: false,
      class: classInfo,
      teachers: teachers,
      errorMessage: "",
    };
  } catch (error) {
    return { error: true, errorMessage: "Error Occurred" };
  }
}
export async function SwapFormMaster({
  classId,
  newFormMaster,
  formMaster,
}: {
  classId: string;
  newFormMaster: string;
  formMaster: string;
}): Promise<TGetClassFullInfo> {
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
    const fromStaff = await prisma.staff.findFirst({
      where: {
        id: formMaster,
      },
    });
    const toStaff = await prisma.staff.findFirst({
      where: {
        id: newFormMaster,
      },
    });
    if (
      !fromStaff ||
      !toStaff ||
      !fromStaff.formMasterId ||
      !toStaff.formMasterId
    )
      return {
        error: true,
        errorMessage: "Swapping failed due to staff not found",
      };
    const fromId: string = fromStaff.formMasterId;
    const toId: string = toStaff.formMasterId;
    await prisma.staff.update({
      where: {
        formMasterId: classId,
      },
      data: {
        formMasterId: null,
      },
    });
    await prisma.staff.update({
      where: {
        id: toStaff.id,
      },
      data: {
        formMasterId: null,
      },
    });
    //
    await prisma.staff.update({
      where: {
        id: formMaster,
      },
      data: {
        formMasterId: toId,
      },
    });
    await prisma.staff.update({
      where: {
        id: newFormMaster,
      },
      data: {
        formMasterId: fromId,
      },
    });
    const classInfo = await prisma.class.findFirst({
      where: {
        id: classId,
      },

      include: {
        formMaster: {
          include: {
            images: {
              take: 1,
            },
          },
        },
        subjects: {
          orderBy: [{ updatedAt: "desc" }],
          include: {
            staff: {
              include: {
                images: {
                  take: 1,
                },
              },
            },
          },
        },
        students: {
          orderBy: [{ updatedAt: "desc" }],
          include: {
            images: {
              take: 1,
            },
          },
        },
        classPrefect: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    });
    const teachers = await prisma.staff.findMany({
      include: {
        images: {
          take: 1,
        },
      },
      where: {
        OR: [
          {
            role: "TEACHING",
          },
          {
            role: "ADMIN",
          },
        ],
      },
    });
    if (!teachers)
      return { error: true, errorMessage: "No Staff Available For Subject" };
    if (!classInfo) return { error: true, errorMessage: "Class Not Found " };
    return {
      error: false,
      class: classInfo,
      teachers: teachers,
      errorMessage: "",
    };
  } catch (error) {
    return { error: true, errorMessage: "Error Occurred" };
  }
}
