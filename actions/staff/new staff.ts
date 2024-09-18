"use server";
import prisma from "@/prisma/db";
import { NewStaffResponse } from "@/types";
import { Prisma } from "@prisma/client";
import * as z from "zod";
import bcrypt from "bcrypt";
import { sendMessage } from "../message/send_message";
import { AddNumberToContact, CreateContact } from "../message/create-contact";
import { staffNewMessage } from "../message/messages";
import { AddStaffActivity, setLastSeen } from "../auth/setLastSeen";
import { getSession } from "../session";
import { newStaffSchema } from "@/lib/class";
import { IsAccountActive } from "../account-active";
const axios = require("axios");

export default async function AddNewStaff(
  form_data: z.infer<typeof newStaffSchema>
): Promise<NewStaffResponse> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, message: "Refresh page" };
    const me = await prisma.staff.findUnique({
      where: {
        userId: session.userId,
      },
    });
    if (!me) return { error: true, message: "Permission Denied" };
    if (await IsAccountActive(me.userId!))
      return { error: true, message: "Account suspended" };
    setLastSeen(session.userId);
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId: me.id,
        type: "AddStaffInfo",
        value: true,
      },
    });
    if (!myPermissions && me.phoneNumber !== "0206821921")
      return { error: true, message: "Permission Denied" };
    let s = parseFloat(form_data.salary);
    if(isNaN(s)) return { error: true, message: "Invalid Salary" };
    await prisma.$transaction(async(prisma)=>{
    let staff = await prisma.staff.create({
      data: {
        ...form_data,
        salary: s,
        dateOfBirth: new Date(Date.parse(form_data.dateOfBirth)),
        dateOfEmployment: new Date(Date.parse(form_data.dateOfEmployment)),
      },
    });
    let user = await prisma.user.create({
      data: {
        account: "STAFF",
        email: staff.emailAddress,
        lastSeen: new Date(Date.now()),
        password: "",
        loginAttempts: 0,
        phoneNumber:staff.phoneNumber,
        passwordVerificationKey: await bcrypt.hash(
          staff.id,
          await bcrypt.genSalt(10)
        ),
      },
    });
    await prisma.permission.createMany({
      data: [
        {
          type: "Blocked",
          value: false,
          staffId: staff.id,
        },
        {
          type: "Stopped",
          value: false,
          staffId: staff.id,
        },
      ],
    });
    await prisma.staff.update({
        where:{id:staff.id},
        data:{
            userId:user.id
        }
    });
     await CreateContact("Staff" + process.env.SCHOOL_ID!);
    await AddNumberToContact(staff);
    await AddStaffActivity(me.id,"CREATED_CLASS",`Adding ${staff.firstName} to ${staff.role} Role`);
    sendMessage(staff.phoneNumber,staffNewMessage(staff));
    })
    return { error: false, message: "" };
  } catch (error: any) {
    console.log(error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known request errors
      if (error.code === "P2002") {
        return { error: true, message: "Staff already exist" };
      }
    }
    return { error: true, message: "Unknown error occurred" };
  }
}
