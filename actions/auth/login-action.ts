"use server";
import { loginFormSchema } from "@/lib/class";
import prisma from "@/prisma/db";
import {
  FatherWithPermission,
  LoginServerResponse,
  MotherWithPermission,
  StaffWithPermission,
  StudentWithPermission,
  TConfirmAccount,
  TGetStaffBasicInfoWithUser,
} from "@/types";
import * as z from "zod";
import bcrypt from "bcrypt";
import { getSession } from "../session";
import { Father, Mother, Staff, Student } from "@prisma/client";
import { redirect } from "next/navigation";
import { AddStaffActivity, setLastSeen } from "./setLastSeen";
import { CreateDevUser } from "./create-dev-user";
export async function LoginServerAction(
  form_data: z.infer<typeof loginFormSchema>
): Promise<TGetStaffBasicInfoWithUser> {
  try {
    const session = await getSession();
    if (!form_data.password || !form_data.userId)
      return { error: true, errorMessage: "bad request" };
    const userExist = await prisma.user.findFirst({
      where:{}
    });
    if(!userExist) await CreateDevUser();
    console.log("pass-31")
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            id: isNaN(parseInt(form_data.userId))
              ? 0
              : parseInt(form_data.userId),
          },
          {
            email: form_data.userId,
          },
          {
            phoneNumber: form_data.userId,
          },
        ],
      },
    });
    if (!user) return { error: true, errorMessage: "Wrong user or password" };
    if(!user.active) return { error: true, errorMessage: "Account suspended" };
    if (user.password == "")
      return { error: true, errorMessage: "Finish account setup" };
    if (!(await bcrypt.compare(form_data.password, user.password)))
      return { error: true, errorMessage: "Wrong user or password" };
    
    if (user.account == "STAFF") {
      const userDetails = await prisma.staff.findUnique({
        where: {
          userId: user.id,
        },
        include: {
          user: {},
          permissions: {},
          images: {
            take: 1,
            where: {
              isCoverPic: true,
            },
          },
        },
      });
      if (!userDetails)
        return { error: true, errorMessage: "Wrong user or password" };
      const blocked = userDetails.permissions.find((e)=>e.type=="Blocked")?.value;
      const stopped = userDetails.permissions.find((e)=>e.type=="Stopped")?.value;
      if(blocked||stopped) return { error: true, errorMessage: "Account blocked contact administrator" };
      await AddStaffActivity(userDetails.id,"LOGIN");
    }
    
    session.isLoggedIn=true;
    session.accountType=user.account;
    session.userId=user.id;
    await session.save();
    await setLastSeen(user.id);
    redirect("/dashboard");
    return {error:false,errorMessage:""}
  } catch (error) {
    return { error: false, errorMessage: "Error occurred" };
  }
}


export async function Logout(){
  let session = await getSession();
  if(!session.userId || !session.isLoggedIn) return redirect("/sign-in")
    await setLastSeen(session.userId);
  session.destroy();
  if(session.accountType=="STAFF"){
    const userDetails = await prisma.staff.findUnique({
      where: {
        userId: session.userId,
      },
      include: {
        user: {},
        permissions: {},
        images: {
          take: 1,
          where: {
            isCoverPic: true,
          },
        },
      },
    });
    if(!userDetails){
      await session.save();
      redirect("/sign-in");
    }
    await AddStaffActivity(userDetails.id,"LOGOUT");
  }
  await session.save();
  redirect("/sign-in");
}