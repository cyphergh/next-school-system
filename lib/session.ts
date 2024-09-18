import { SessionData } from '@/types'
import {getIronSession,IronSession,SessionOptions} from 'iron-session'

export const sessionOptions:SessionOptions={
    cookieName:'sms',
    password:process.env.SESSSION!,
    cookieOptions:{
        httpOnly:true,
        secure: process.env.NODE_ENV==="production",
    }
}
export const defaultSession:SessionData={
    isLoggedIn:false,
  }