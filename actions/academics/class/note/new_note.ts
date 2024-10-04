'use server'

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session"
import prisma from "@/prisma/db";
import { TNewNote } from "@/types";

export async function NewNote({
    title,
    content,
    subjectId,
    topicId,
}:{
    title:string,
    content:string,
    subjectId:string,
    topicId:string,
}):Promise<TNewNote>{
 try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Error occurred", notes: [] };
    const user = await prisma.staff.findFirst({
      where: { userId: session.userId },
    });
    if (!user)
      return { error: true, errorMessage: "Client request error", notes: [] };
    if (await IsAccountActive(session.userId))
      return { error: true, errorMessage: "Account suspended", notes: [] };
    setLastSeen(session.userId);
    const term = await prisma.term.findFirst({
      where: {
        isActve: true,
      },
    });
    if (!term) throw new Error("Create a new term first");
  
    const subject = await prisma.subject.findUniqueOrThrow({
      where: {
        id: subjectId,
      },
    })
    if(subject.staffId != user.id) return { error: true, errorMessage: "Permission Denied", notes: [] };
    const topic = await prisma.topic.findUniqueOrThrow({
      where: {
        id: topicId,
      },
    })
    await prisma.note.create({
      data:{
        title:title.toLowerCase(),
        content:content,
        subjectId:subjectId,
        termId:term.id,
        topicId:topicId,
        staffId:user.id
      }
    });
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