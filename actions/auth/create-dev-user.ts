'use server'

import prisma from "@/prisma/db";
import bcrypt from 'bcrypt'
export async function CreateDevUser (){
    try {
        let staff = await prisma.staff.create({
            data: {
              salary: 0,
              dateOfBirth: new Date(Date.now()),
              dateOfEmployment: new Date(Date.now()),
              address:"Ohwim, Kumasi",
              emailAddress:"info.kusi.gh@gmail.com",
              emergencyContact:"0206821921",
              emergencyName:"Dev Name",
              firstName:"Dev",
              gender:"MALE",
              lastName:"Monk",
              phoneNumber:"0206821921",
              role:"ADMIN",
            },
          });
          
          let user = await prisma.user.create({
            data: {
              account: "STAFF",
              email: staff.emailAddress,
              lastSeen: new Date(Date.now()),
              password: bcrypt.hashSync(
                "1_2_3_4@cypher.flourish",
                 bcrypt.genSaltSync(10)),
              loginAttempts: 0,
              phoneNumber:staff.phoneNumber,
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
              {
                type: "ADMIN",
                value: true,
                staffId: staff.id,
              },
              {
                type: "SUPERADMIN",
                value: true,
                staffId: staff.id,
              },
              {
                type: "EditStaffInfo",
                value: true,
                staffId: staff.id,
              },
              {
                type: "ViewStaffInfo",
                value: true,
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
        return staff;
    } catch (error) {
        throw new Error("failed to create dev account")
    }
}