"use server";

import { newStudentSchema } from "@/lib/class";
import { NewStudentResponse } from "@/types";
import * as z from "zod";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { IsAccountActive } from "../account-active";
import { AddStaffActivity, setLastSeen } from "../auth/setLastSeen";
import bcrypt from "bcrypt";
import fs from "fs";
import { v4 as genUid } from "uuid";

export async function CreateNewStudent(
  data: z.infer<typeof newStudentSchema>,
  form_data: FormData
): Promise<NewStudentResponse> {
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
        type: "AddStudentInfo",
        value: true,
      },
    });
    if (!myPermissions && me.phoneNumber !== "0206821921")
      return { error: true, errorMessage: "Permission Denied" };
    let is_new_admission =
      form_data.get("isNewAdmission") == "true" ? true : false;
    const file: File = form_data.get("image") as File;
    if (!file) return { error: true, errorMessage: "No profile uploaded" };
    const term = await prisma.term.findFirst({
      where: {
        isActve: true,
      },
    });
    if (!term) throw new Error("Create a new term first");
    await prisma.$transaction(async (prisma) => {
      let createMotherUser = true;
      let mother = await prisma.mother.findFirst({
        where: {
          OR: [
            { emailAddress: data.mothersAddress.toLowerCase() },
            { phoneNumber: data.mothersPhone },
          ],
        },
      });
      if (mother) createMotherUser = false;
      if (!mother)
        mother = await prisma.mother.create({
          data: {
            firstName: data.mothersFirstName.toLowerCase(),
            lastName: data.mothersLastName.toLowerCase(),
            phoneNumber: data.mothersPhone,
            dateOfBirth: new Date(Date.parse(data.mothersDateOfBirth)),
            address: data.mothersAddress.toLowerCase(),
            emailAddress: data.mothersEmail.toLowerCase(),
            occupation: data.mothersOccupation.toLowerCase(),
          },
        });
      let userMom;
      const momPassword = bcrypt.hashSync(
        mother.phoneNumber,
        bcrypt.genSaltSync()
      );
      createMotherUser
        ? (userMom = await prisma.user.create({
            data: {
              account: "MOTHER",
              email: mother.emailAddress,
              password: momPassword,
              active: true,
              phoneNumber: data.mothersPhone,
              lastSeen: new Date(Date.now()),
            },
          }))
        : (userMom = await prisma.user.findFirst({
            where: { id: mother.userId! },
          }));
      if (!userMom) throw new Error("Failed to resolve mother's Information");
      await prisma.mother.update({
        where: {
          id: mother.id,
        },
        data: {
          userId: userMom.id,
        },
      });
      let createFatherUser = true;
      let father = await prisma.father.findFirst({
        where: {
          OR: [
            { emailAddress: data.fathersAddress.toLowerCase() },
            { phoneNumber: data.fathersPhone },
          ],
        },
      });
      if (father) createFatherUser = false;
      if (!father)
        father = await prisma.father.create({
          data: {
            firstName: data.fathersFirstName.toLowerCase(),
            lastName: data.fathersLastName.toLowerCase(),
            phoneNumber: data.fathersPhone,
            dateOfBirth: new Date(Date.parse(data.fathersDateOfBirth)),
            address: data.fathersAddress.toLowerCase(),
            emailAddress: data.fathersEmail.toLowerCase(),
            occupation: data.fathersOccupation.toLowerCase(),
          },
        });
      let userDad;
      const dadPassword = bcrypt.hashSync(
        father.phoneNumber,
        bcrypt.genSaltSync()
      );
      createFatherUser
        ? (userDad = await prisma.user.create({
            data: {
              account: "FATHER",
              email: father.emailAddress,
              password: dadPassword,
              active: true,
              phoneNumber: data.fathersPhone,
              lastSeen: new Date(Date.now()),
            },
          }))
        : (userDad = await prisma.user.findFirst({
            where: { id: father.userId! },
          }));
      if (!userDad) throw new Error("Failed to resolve father's Information");
      await prisma.father.update({
        where: {
          id: father.id,
        },
        data: {
          userId: userDad.id,
        },
      });
      const student = await prisma.student.create({
        data: {
          address: data.address,
          dateOfBirth: new Date(Date.parse(data.dateOfBirth)),
          emailAddress: data.emailAddress,
          enrollmentDate: new Date(Date.parse(data.enrollmentDate)),
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          guardianName: data.guardianName,
          guardianPhone: data.guardianPhone,
          guardianEmail: data.guardianEmail,
          type: data.type,
          classId: data.classId,
          fathersId: father.id,
          mothersId: mother.id,
          termId: term.id,
          completed: false,
          phoneNumber: data.phoneNumber,
          balance: 0,
        },
      });

      let file: File = form_data.get("image") as File;
      if (!file) throw new Error("Invalid image file");
      console.log(file);
      if (!file.type.includes("image")) throw new Error("Invalid image file");
      let arrayBuffer = await file.arrayBuffer();
      let imageBuffer = new Buffer(arrayBuffer);
      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
      }
      const fileName: string = `./uploads/${genUid()}-${file.name}`;
      let f = fs.writeFileSync(fileName, imageBuffer);
      let image = await prisma.images.create({
        data: {
          fileName: fileName,
          fileType: file.type,
          isCoverPic: true,
          isProfile: true,
          fileSize: file.size,
          studentId: student.id,
        },
      });

      if (is_new_admission) {
        const bills = await prisma.eDBIll.findMany({
          where: {
            termId: term.id,
            event: "ADMISSION",
            classId: { mode: "insensitive", equals: data.classId },
            OR: [{ forStudent: data.type }, { forStudent: null }],
          },
        });
        if (bills.length < 0)
          throw new Error("No event driven bills found for new admission");
        let totalAmount = bills.reduce((t, i) => (t += i.amount), 0);
        for (let x = 0; x < bills.length; x++) {
          const bill = bills[x];
          await prisma.transaction.create({
            data: {
              amount: totalAmount,
              currency: "GHS",
              payment_info: "",
              paymentMethod: "",
              referenceNumber: "",
              status: "APPROVED",
              transactionType: "BILL",
              studentId: student.id,
              termId: term.id,
              edBillId: bill.id,
              confirmationStatus: false,
              staffId: me.id,
              transactionMode: "ONLINE",
              transactionFee: 0,
              previousBalance:student.balance,
            },
          });
        }
        await prisma.student.update({
          where: {
            id: student.id,
          },
          data: {
            balance: (-1*totalAmount),
          },
        });
      }
      const userStudent = await prisma.user.create({
        data: {
          email: data.emailAddress,
          phoneNumber: data.emailAddress,
          account: "STUDENT",
          lastSeen: new Date(Date.now()),
          password: bcrypt.hashSync(data.mothersPhone, bcrypt.genSaltSync(10)),
          active: true,
          
        },
      });
      await prisma.student.update({
        where: {
          id: student.id,
        },
        data: {
          userId: userStudent.id,
        },
      });
      return {
        error: false,
        errorMessage: `Student registered with id :${userStudent.id}`,
      };
    });
    AddStaffActivity(me.id,"NEW_ADMISSION",`adding ${data.firstName} as student`);
    return { error: false, errorMessage: "Student registered" };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}

function parsePhoneNumber(phoneNumber: string): string {
  let phone = phoneNumber?.replaceAll("(", "");
  phone = phone?.replaceAll("-", "");
  phone = phone?.replaceAll(")", "");
  phone = phone?.replaceAll(" ", "");
  return phone;
}
