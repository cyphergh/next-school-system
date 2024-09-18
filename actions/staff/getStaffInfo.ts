"use server"

import { TGetStaffInformation } from "@/types";
import { getSession } from "../session";
import { setLastSeen } from "../auth/setLastSeen";
import prisma from "@/prisma/db";
import { IsAccountActive } from "../account-active";

export async function getStaffInfo (id:string):Promise<TGetStaffInformation>{
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
          type: "ViewStaffInfo",
          value:true,
        },
      });
      if (!myPermissions && user.phoneNumber !== "0206821921")
        return { error: true, errorMessage: "Permission Denied" };
      const staff = await prisma.staff.findFirst({
        where:{
            id:id
        },
        include:{
            permissions:{},
            images:{},
            activities:{
                orderBy:[{
                    updatedAt:"desc"
                }]
            },
            user:{},
            transactions:{}, 
       }
      })
      if (!staff)
        return { error: true, errorMessage: "Reload site" };
      return {error:false,errorMessage:"",staff}
  } catch (error) {
    return {error:true,errorMessage:"Error Occurred"}
  }
}