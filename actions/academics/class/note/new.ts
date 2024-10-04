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
    

    return { error: true, errorMessage: "Impl error", notes: [] };

 } catch (error:any) {
    return { error: true, errorMessage: error.string(), notes: [] };
    
 }
}