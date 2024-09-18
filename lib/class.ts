import { StudentType } from "@prisma/client";
import * as z from "zod";

export function dataURLtoBlob(dataUrl: string) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  export const loginFormSchema = z.object({
    userId: z.string().min(1),
    password: z.string().min(4),
  })



  export const newStaffSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.string(),
    gender: z.enum(["MALE", "FEMALE"]),
    address: z.string().min(4),
    phoneNumber: z.string().min(9,"Invalid phone number"),
    emailAddress: z.string().email(),
    dateOfEmployment: z.string(),
    salary: z.string().min(1),
    ssnit: z.string(),
    emergencyContact: z.string().min(9),
    emergencyName: z.string(),
    role: z.enum(["TEACHING", "NON_TEACHING", "ADMIN"]),
  });

  export const newStudentSchema = z.object({
    firstName:z.string().min(1),
    lastName:z.string().min(1),
    dateOfBirth:z.string(),
    gender:z.enum(["MALE","FEMALE"]),
    address:z.string().min(1),
    phoneNumber:z.string().optional(),
    type:z.enum(["DAY","BOARDING"]),
    emailAddress:z.string().email(),
    enrollmentDate:z.string(),
    guardianName:z.string().min(1),
    guardianPhone:z.string(),
    guardianEmail:z.string(),
    classId:z.string(),
    mothersFirstName:z.string().min(1),
    mothersLastName:z.string().min(1),
    mothersPhone:z.string(),
    mothersDateOfBirth:z.string(),
    mothersEmail:z.string(),
    mothersAddress:z.string(),
    mothersOccupation:z.string(),
    fathersFirstName:z.string().min(1),
    fathersOccupation:z.string(),
    fathersLastName:z.string().min(1),
    fathersDateOfBirth:z.string(),
    fathersPhone:z.string(),
    fathersEmail:z.string(),
    fathersAddress:z.string(),
  })