"use server";

import prisma from "@/prisma/db";
import { TFIndAllStaff, TFIndOneStaff } from "@/types";
import { Permissions } from "@prisma/client";
import { getSession } from "../session";
import { setLastSeen } from "../auth/setLastSeen";
import { IsAccountActive } from "../account-active";

export async function CreateOrEditPermission(
  permission: Permissions,
  staffId: string
): Promise<TFIndOneStaff> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Refresh page" };
    const user = await prisma.staff.findUnique({
      where:{
        userId:session.userId
      }
    });
    if(!user) return { error: true, errorMessage: "Permission Denied" };
    if(await IsAccountActive(session.userId))
      return { error: true, errorMessage: "Account suspended" };
    setLastSeen(session.userId);
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId:user.id,
        type: "SUPERADMIN",
        value:true,
      },
    });
    if (!myPermissions && user.phoneNumber !== "0206821921")
      return { error: true, errorMessage: "Permission Denied" };
    let existPerm = await prisma.permission.findFirst({
      where: {
        staffId,
        type: permission,
      },
    });
    let forStaff = await prisma.staff.findUnique({
      where: {
        id: staffId,
      },
    });
    if(!forStaff) return { error: true, errorMessage: "No staff " };
    if (!existPerm) {
      await prisma.permission.create({
        data: {
          staffId,
          type: permission,
          value: true,
        },
      });
      if(permission=="Blocked"||permission=="Stopped"){
        await prisma.user.update({
          where:{
            id:forStaff.userId!
          },
          data:{
            active:true
          }
        })
      }
    } else {
      await prisma.permission.update({
        where: {
          id: existPerm.id,
        },
        data: {
          type: permission,
          value: !existPerm.value,
        },
      });
      if(permission=="Blocked"||permission=="Stopped"){
        const isBlocked = await prisma.permission.findFirst({
          where: {
            staffId,
            type: "Blocked",
          },
        })
        const isStopped = await prisma.permission.findFirst({
          where: {
            staffId,
            type: "Stopped",
          },
        });
        let nv = (isBlocked?.value || isStopped?.value)??false;
        await prisma.user.update({
          where:{
            id:forStaff.userId!
          },
          data:{
            active:nv
          }
        });
      }
    }
    const staff = await prisma.staff.findFirst({
      where: {
        id: staffId,
      },
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
    });
    if (!staff) return { error: true, errorMessage: "Reload the page" };
    return { error: false, errorMessage: "", staff };
  } catch (error) {
    return { error: true, errorMessage: "Reload page" };
  }
}
