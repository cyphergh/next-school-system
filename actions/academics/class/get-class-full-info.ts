"use server";
import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { TGetClassFullInfo } from "@/types";

export async function GetClassFullInfo(id: string): Promise<TGetClassFullInfo> {
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
    if (!myPermissions)
      return { error: true, errorMessage: "Permission Denied" };
    const classInfo = await prisma.class.findFirst({
      where: {
        id,
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
    return { error: true, errorMessage: "Error retrieving data" };
  }
}
