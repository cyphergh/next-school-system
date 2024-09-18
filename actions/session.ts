
'use server'
import { defaultSession, sessionOptions } from "@/lib/session"
import { getIronSession } from "iron-session"
import {  SessionData } from "@/types"
import { cookies } from "next/headers"

export const getSession = async()=>{
    const session = await getIronSession<SessionData>(cookies(),sessionOptions);
    if(!session.isLoggedIn){
        session.isLoggedIn=defaultSession.isLoggedIn;
    }
    return session;
}