"use server";
import { PaymentResponse } from "@/types";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { IsAccountActive } from "../account-active";
import { AddStaffActivity, setLastSeen } from "../auth/setLastSeen";
import bcrypt from "bcrypt";
import { createNote } from "../message/create-note";
import { sendMessage } from "../message/send_message";
import { Bill } from "@prisma/client";
export async function Payment({
  password,
  payer,
  amount,
  description,
  studentId,
  payerName,
  payerPhone,
  payerEmail,
  billReference,
}: {
  password: string;
  payer: "MOTHER" | "FATHER" | "GUARDIAN" | null;
  amount: string;
  description: string;
  studentId: string;
  payerName: string | null;
  payerPhone: string | null;
  payerEmail: string | null;
  billReference: string | null | undefined;
}): Promise<PaymentResponse> {
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
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
      },
      include: {
        mother: true,
        father: true,
      },
    });
    if (!student) return { error: true, errorMessage: "Student not found" };
    let bill: Bill | null = null;
    let bRid = parseInt(billReference ?? "");
    if (billReference) {
      if (isNaN(bRid))
        return { error: true, errorMessage: "Invalid bill reference" };
      bill = await prisma.bill.findFirst({
        where: {
          ref: bRid,
        },
      });
      if (!bill) return { error: true, errorMessage: "Invalid bill reference" };
      if(bill.amount<=bill.payedAmount) return { error: true, errorMessage: "The provided bill reference is settled" };
      if(bill.amount<(bill.payedAmount+parseInt(amount))) return { error: true, errorMessage: `You are overpaying, the required amount is ${bill.amount-bill.payedAmount}` };
      
    }
    const paymentAmount: number = parseFloat(amount);
    if (isNaN(paymentAmount))
      return { error: true, errorMessage: "Invalid amount" };
    const transactionId: string = await prisma.$transaction(
      async (prisma): Promise<string> => {
        let pName: string;
        let pPhone: string;
        let pEmail: string;

        if (!payer) {
          pName = payerName!;
          pPhone = payerPhone!;
          pEmail = payerEmail!;
          const transaction = await prisma.transaction.create({
            data: {
              amount: paymentAmount,
              payerName: pName,
              payerPhoneNumber: pPhone,
              payerEmail: pEmail,
              studentId: student.id,
              termId: term.id,
              currency: "GHS",
              payment_info: description,
              transactionType: "PAYMENT",
              transactionMode: "CASH",
              transactionFee: 0,
              paymentMethod: "CASH",
              previousBalance: student.balance,
              referenceNumber: "",
              status: "PENDING",
              staffId: user.id,
              confirmationStatus: false,
              billRef: bill?.ref,
            },
          });
          const newAmount: number = student!.balance + paymentAmount;
          await prisma.student.update({
            where: {
              id: studentId,
            },
            data: {
              balance: newAmount,
            },
          });
          return transaction.id;
        } else if (payer == "MOTHER") {
          pName = student.mother.firstName + " " + student.mother.lastName;
          pPhone = student.mother.phoneNumber;
          pEmail = student.mother.emailAddress ?? "";
          const transaction = await prisma.transaction.create({
            data: {
              amount: paymentAmount,
              payerName: pName,
              payerPhoneNumber: pPhone,
              payerEmail: pEmail,
              studentId: student.id,
              termId: term.id,
              currency: "GHS",
              payment_info: description,
              transactionType: "PAYMENT",
              transactionMode: "CASH",
              transactionFee: 0,
              paymentMethod: "CASH",
              referenceNumber: "",
              status: "PENDING",
              billRef: bill?.ref,
              previousBalance: student.balance,
              staffId: user.id,
              confirmationStatus: false,
              motherId: student.mother.id,
            },
          });
          const newAmount: number = student!.balance + paymentAmount;
          await prisma.student.update({
            where: {
              id: studentId,
            },
            data: {
              balance: newAmount,
            },
          });
          return transaction.id;
        } else if (payer == "FATHER") {
          pName = student.father.firstName + " " + student.mother.lastName;
          pPhone = student.father.phoneNumber;
          pEmail = student.father.emailAddress ?? "";
          const transaction = await prisma.transaction.create({
            data: {
              amount: paymentAmount,
              payerName: pName,
              payerPhoneNumber: pPhone,
              payerEmail: pEmail,
              studentId: student.id,
              termId: term.id,
              currency: "GHS",
              payment_info: description,
              transactionType: "PAYMENT",
              transactionMode: "CASH",
              transactionFee: 0,
              paymentMethod: "CASH",
              referenceNumber: "",
              status: "PENDING",
              staffId: user.id,
              billRef: bill?.ref,
              previousBalance: student.balance,
              confirmationStatus: false,
              fatherId: student.fathersId,
            },
          });
          const newAmount: number = student!.balance + paymentAmount;
          await prisma.student.update({
            where: {
              id: studentId,
            },
            data: {
              balance: newAmount,
            },
          });
          return transaction.id;
        } else if (payer == "GUARDIAN") {
          pName = student.guardianName;
          pPhone = student.guardianPhone;
          pEmail = student.guardianEmail ?? "";
          const transaction = await prisma.transaction.create({
            data: {
              amount: paymentAmount,
              payerName: pName,
              payerPhoneNumber: pPhone,
              payerEmail: pEmail,
              studentId: student.id,
              termId: term.id,
              currency: "GHS",
              payment_info: description,
              transactionType: "PAYMENT",
              transactionMode: "CASH",
              transactionFee: 0,
              paymentMethod: "CASH",
              referenceNumber: "",
              status: "PENDING",
              staffId: user.id,
              confirmationStatus: false,
              previousBalance: student.balance,
              billRef: bill?.ref,
            },
          });
          const newAmount: number = student!.balance + paymentAmount;
          await prisma.student.update({
            where: {
              id: studentId,
            },
            data: {
              balance: newAmount,
            },
          });
          return transaction.id;
        } else {
          throw new Error("Invalid payer details");
        }
      }
    );
    if (bill) {
      const ub = bill.payedAmount + paymentAmount;
      await prisma.bill.update({
        where: {
          id: bill.id,
        },
        data: {
          payedAmount: ub,
        },
      });
    }
    await createNote(
      student.mother.userId!,
      `Paid ${paymentAmount} for ${student.firstName} ${student.lastName} with transaction id ${transactionId}`
    );
    await createNote(
      student.father.userId!,
      `Paid ${paymentAmount} for ${student.firstName} ${student.lastName} with transaction id ${transactionId}`
    );
    await createNote(
      student.userId!,
      `Paid ${paymentAmount} for you with transaction id ${transactionId}`
    );
    await sendMessage(
      student.guardianPhone,
      `Paid ${paymentAmount} for ${student.firstName} ${student.lastName} with transaction id ${transactionId}`
    );
    const students = await prisma.student.findMany({
      where: {},
      orderBy: {
        class: {
          className: "asc",
        },
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
            id: true,
            lastSeen: true,
          },
        },
      },
    });
    AddStaffActivity(user.id,"MAKE_PAYMENT","make payment");

    return {
      error: false,
      errorMessage: "",
      transactionId: transactionId,
      students,
    };
  } catch (error: any) {
    return {
      error: true,
      errorMessage: error.toString(),
    };
  }
}
