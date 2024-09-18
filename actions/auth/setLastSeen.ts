'use server'
import prisma from "@/prisma/db";
import { ActivityType } from "@prisma/client";

export async function setLastSeen(userId:number){
    await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            lastSeen:new Date(Date.now())
        }
    })
    return;
}

export async function AddStaffActivity(userId:string,activity:ActivityType,description?:string){
    await prisma.activityLog.create({
        data:{
            type:activity,
            staffId:userId,
            description:description
        }
    });
    return;
}