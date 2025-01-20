"use server";

import prisma from "@/prisma/db";
import { getSession } from "../session";
import { IsAccountActive } from "../account-active";
import { setLastSeen } from "../auth/setLastSeen";
import bcrypt from "bcrypt";
import { CFADATA } from "@/types";
export async function ConfirmTransactions(
  staffId: string,
  password: string,
 
):Promise<{error:boolean,errorMessage:string, data?: {
    ts: CFADATA,
    exp: any
  }}> {
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
    if (!term) throw new Error("Create a new term first");
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId: user.id,
        type: "SUPERADMIN",
        value: true,
      },
    });
    if (!myPermissions)
      return { error: true, errorMessage: "Permission Denied" };
    const userInfo = await prisma.user.findFirst({
      where: {
        id: session.userId,
      },
    });
    if (!userInfo || !userInfo.active)
      return { error: true, errorMessage: "Permission Denied" };
    const valid = bcrypt.compareSync(password, userInfo.password);
    if (!valid) return { error: true, errorMessage: "Wrong password" };
    const staff = await prisma.staff.findUnique({
        where:{
            id:staffId
        }
    });
    if(!staff) throw "Staff not found";
    await prisma.$transaction(async(db)=>{
        await db.transaction.updateMany({
            where:{
                staffId
            },
            data:{
                status:"APPROVED"
            }
        });
        await db.expenditure.updateMany({
            where:{
                staffId
            },
            data:{
                approved:true,
            }
        })
    });
    const transactions = await prisma.transaction.groupBy({
        _sum: {
          amount: true, // Summing the amount field
        },
        where: {
          transactionType: "PAYMENT",
          status: "PENDING",
        },
        by: "staffId",
      });
      const resultsWithUser = await Promise.all(
        transactions.map(async (group) => {
          const user = await prisma.staff.findUnique({
            where: { id: group.staffId },
          });
          return {
            ...group,
            user
          };
        })
      );
      const expenses = await prisma.expenditure.groupBy({
        _sum: {
          amount: true,
        },
        where: {
          approved:false,
        },
        by:'staffId'
      });
    return { error: false, errorMessage: '',data:{
        exp:expenses,
        ts:resultsWithUser,
    } };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
