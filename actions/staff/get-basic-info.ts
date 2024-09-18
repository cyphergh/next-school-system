"use server";
import fs from "fs";
import prisma from "@/prisma/db";
import { v4 as genUid } from "uuid";
import bcrypt from 'bcrypt';
import {
  IGetBankBranches,
  TConfirmAccount,
  TGetStaffBasicInfoWithUser,
  TSignInResponse,
} from "@/types";
import { getSession } from "../session";

export async function GetStaffBasicInfoWithUser(
  id: string
): Promise<TGetStaffBasicInfoWithUser> {
  try {
    // const url = "https://api.flutterwave.com/v3/banks/GH";
    // const options = {
    //   method: "GET",
    //   headers: {
    //     Authorization: "Bearer " + process.env.FLWSECK,
    //   },
    // };
    // const response = await fetch(url, options);
    // if (!response.ok) {
    //   return { error: true, errorMessage: "Server server to load resource" };
    // }
    // const data = await response.json();
    // const banks = data.data;
    // if (!banks) {
    //   return { error: true, errorMessage: "failed to load bank resource" };
    // }
    let staff = await prisma.staff.findUnique({
      where: {
        id,
        user: {
          password: "",
        },
      },
    });
    if (!staff) return { error: true, errorMessage: "Staff not found" };
    return { error: false, staff, errorMessage: "", banks:[] };
  } catch (error) {
    return { error: true, errorMessage: "!Oops error occurred" };
  }
}

export async function FinishConfirmStaffAccount(
  form: FormData,
  staffId: string
): Promise<TSignInResponse> {
  try {
    let session = await getSession();
    let staff = await prisma.staff.findUnique({
      where: {
        id: staffId,
      },
      include: {
        user: {},
      },
    });
    if (!staff) return { error: true, errorMessage: "Reload the page" };
    if (!staff.user) return { error: true, errorMessage: "Reload the page" };
    if (staff.user.password)
      return { error: true, errorMessage: "Reload the page" };
    let password:string = form.get("password") as string;
    let bank = form.get("bank") as string;
    let bankNumber = form.get("bankNumber") as string;
    let network = form.get("network") as string;
    let momoNumber = form.get("momoNumber") as string;
    let file: File = form.get("profile") as File;
    if (!file) return { error: true, errorMessage: "FIle not uploaded" };
    if (!file.type.includes("image")) 
      return { error: true, errorMessage: "Invalid image file" };
    let data = await file.arrayBuffer();
    let imageBuffer = new Buffer(data);
    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }
    const fileName:string = `./uploads/${genUid()}-${file.name}`;
    let f = fs.writeFileSync(fileName, imageBuffer);
     let image = await prisma.images.create({
      data:{
        fileName:fileName,
        fileType:file.type,
        isCoverPic:true,
        isProfile:true,
        fileSize:file.size,
        staffId:staffId,
      }
     });
    const pd = await bcrypt.hash(password.toString(),await bcrypt.genSalt(10))
    await prisma.user.update({
      where:{
        id:staff.user.id
      },
      data:{
        password:pd,
        lastSeen:new Date(Date.now()),
        active:true,
      }
    });
    await prisma.staff.update({
      where:{
        id:staffId
      },
      data:{
        bankName:bank,
        bankAccountNumber:bankNumber,
        momoNumber:momoNumber,
        bankCode:network,
      }
    });
    await prisma.activityLog.create({
       data:{
        type:"UPDATE_PROFILE",
        description:"Account activated",
        staffId
       }
    });
    return { error: false,errorMessage:""};
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
