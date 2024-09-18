'use server'

import prisma from "@/prisma/db";
import { StaffCheckResponse } from "@/types";

export async function CheckIfThereIsRegisteredStaff():Promise<StaffCheckResponse>{
    try{
        let total = await prisma.staff.count();
        if(total >0)
            return {error:false,exist:true}
        return {error:false,exist:false}
    }catch(error){
        return {error:true,exist:false}
    }
}
