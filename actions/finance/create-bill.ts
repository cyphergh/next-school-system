"use server";
import prisma from "@/prisma/db";
import { PassBillResponse } from "@/types";
import { getSession } from "../session";
import { IsAccountActive } from "../account-active";
import { setLastSeen } from "../auth/setLastSeen";
import bcrypt from "bcrypt";
import { sendMessage } from "../message/send_message";
import { createNote } from "../message/create-note";
interface BillItem {
  title: string;
  quantity: number;
  price: number;
  total: number;
}
export async function createBill({
  title,
  items,
  students,
  password,
}: {
  title: string;
  items: BillItem[];
  students: string[];
  password: string;
}): Promise<PassBillResponse> {
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
        OR: [{ type: "MakePayment" }, { type: "SUPERADMIN" }],
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
    const totalAmount = items.reduce((a, i) => (a += i.total), 0);
    const bill = await prisma.bill.create({
      data: {
        amount: totalAmount,
        payedAmount: 0,
        status: "UNPAID",
        termId: term.id,
        totalAmount: totalAmount,
        title: title,
      },
    });
    await prisma.billItem.createMany({
      data: items.map((e) => {
        return {
          amount: e.price,
          quantity: e.quantity,
          billId: bill.id,
          title: e.title,
          delivered: true,
        };
      }),
    });
    await prisma.$transaction(async (prisma) => {
      for (let studentId of students) {
        let student = await prisma.student.findFirst({
          where: {
            id: studentId,
          },
        });
        if (!student) throw Error("One of the student has invalid address");
        if (student.stopped)
          throw Error(
            `${student.firstName} ${
              student.lastName
            } has stop schooling and you are trying to pass a bill to ${
              student.gender === "FEMALE" ? "her" : "him"
            }`
          );
        const trans = await prisma.transaction.create({
          data: {
            amount: totalAmount,
            currency: "GHS",
            payment_info: "",
            previousBalance: student.balance,
            status: "APPROVED",
            transactionType: "BILL",
            transactionFee: 0,
            billId: bill.id,
            studentId: student.id,
            staffId: user.id,
            termId: term.id,
            billRef: bill.ref,
          },
        });
        const balance = student.balance - totalAmount;
        await prisma.student.update({
          where: {
            id: student.id,
          },
          data: {
            balance,
          },
        });
        const mom = await prisma.mother.findFirst({
          where:{
            id:student.mothersId,
          }
        })
        const dad = await prisma.father.findFirst({
          where:{
            id:student.fathersId,
          }
        })
        if(!mom || !dad) throw Error("One of the student has invalid parents details");
        await sendMessage(
          student.guardianPhone,
          `${title} Bill has been passed to ${student.firstName} ${student.lastName} with a total of ${totalAmount} GHS, ${process.env.NEXT_PUBLIC_DOMAIN}/bill/${trans.id} `
        );
        await sendMessage(
          mom.phoneNumber,
          `${title} Bill has been passed to ${student.firstName} ${student.lastName} with a total of ${totalAmount} GHS, ${process.env.NEXT_PUBLIC_DOMAIN}/bill/${trans.id} `
        );
        await sendMessage(
          dad.phoneNumber,
          `${title} Bill has been passed to ${student.firstName} ${student.lastName} with a total of ${totalAmount} GHS, ${process.env.NEXT_PUBLIC_DOMAIN}/bill/${trans.id} `
        );
        await createNote(
          student.userId!,
          `${title} Bill has been passed to ${student.firstName} ${student.lastName} with a total of ${totalAmount} GHS, ${process.env.NEXT_PUBLIC_DOMAIN}/bill/${trans.id} `
        );
        await createNote(
          mom.userId!,
          `${title} Bill has been passed to ${student.firstName} ${student.lastName} with a total of ${totalAmount} GHS, ${process.env.NEXT_PUBLIC_DOMAIN}/bill/${trans.id} `
        );
        await createNote(
          dad.userId!,
          `${title} Bill has been passed to ${student.firstName} ${student.lastName} with a total of ${totalAmount} GHS, ${process.env.NEXT_PUBLIC_DOMAIN}/bill/${trans.id} `
        );
      }
    });
    return { error: false, errorMessage: "" };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
