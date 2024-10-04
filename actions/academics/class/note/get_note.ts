'use server'
import prisma from "@/prisma/db";
import { TNewNote } from "@/types";
export async function GetNotes({topicId}:{topicId:string}):Promise<TNewNote>{
  try {
    const notes = await prisma.note.findMany({
      where:{
          topicId:topicId
      },
      include:{
          subject:true,
          staff:true,
          term:true,
          topic:true,
        }
    });
    return { error: false, errorMessage: "", notes };
  } catch (error:any) {
    return { error: true, errorMessage: error.string(), notes: [] };

  }
}