"use server";

import { StudentsInformation } from "@/types";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { IsAccountActive } from "../account-active";
import { AddStaffActivity, setLastSeen } from "../auth/setLastSeen";

export async function GetStudentsInfo(): Promise<StudentsInformation> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Refresh page" };
    const me = await prisma.staff.findUnique({
      where: {
        userId: session.userId,
      },
    });
    if (!me) return { error: true, errorMessage: "Permission Denied" };
    if (await IsAccountActive(me.userId!))
      return { error: true, errorMessage: "Account suspended" };
    setLastSeen(session.userId);
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId: me.id,
        OR:[
          {type: "ViewStudentInfo"},
          {type: "EditStudentInfo",}
        ],
        value: true,
      },
    });
    if (!myPermissions && me.phoneNumber !== "0206821921")
      return { error: true, errorMessage: "Permission Denied" };
    const students = await prisma.student.findMany({
      where: {},
      orderBy:{
        class:{
          className:"asc"
        }
      },
      include: {
        images: {
          take: 1,
        },
        mother: {
          include: {
            images: {
              take: 1,
            },
          },
        },
        father: {
          include: {
            images: {
              take: 1,
            },
          },
        },
        class: {
            include:{
                formMaster:{
                    include:{
                        images:{
                            take:1,
                        }
                    }
                }
            }
        },
        user: {
            select:{
                password:false,
                id:true,
                lastSeen:true,
            }
        },
      },
    });
    AddStaffActivity(me.id,"OTHER",`Reading students information`);
    return { error: false, errorMessage: "", students };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
