'use server'

import { StudentsInformation } from "@/types";
import { AddStaffActivity, setLastSeen } from "../auth/setLastSeen";
import prisma from "@/prisma/db";
import { getSession } from "../session";
import { IsAccountActive } from "../account-active";

export async function GetDebtors():Promise<StudentsInformation>{
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
    const term = await prisma.term.findFirst({
      where: {
        isActve: true,
      },
    });
    if (!term) throw new Error("CreateActivate a new term first");
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId: user.id,
        OR: [
          { type: "CreateBill" },
          { type: "EditBill" },
          { type: "DeleteBill" },
          { type: "ViewTransaction" },
          { type: "MakePayment" },
          { type: "PrintTransaction" },
        ],
        value: true,
      },
    });

    if (!myPermissions && user.phoneNumber !== "0206821921")
      return { error: true, errorMessage: "Permission denied" };
    AddStaffActivity(user.id,"OTHER","Reading debtors list");
    const students = await prisma.student.findMany({
      where: {
        balance:{
            lt:0
        }
      },
      orderBy: {
        balance:"asc"  
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
          include: {
            formMaster: {
              include: {
                images: {
                  take: 1,
                },
              },
            },
          },
        },
        user: {
          select: {
            password: false,
            id:true,
            lastSeen:true,
          }
        }
      },
    });
    return {error:false,errorMessage:"",students}
    } catch (error:any) {
        return {error:true,errorMessage:error.toString()}
    }
}