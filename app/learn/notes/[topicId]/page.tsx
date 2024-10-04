import { getSession } from '@/actions/session';
import React from 'react'
import prisma from "@/prisma/db";
import Link from "next/link";
import { Metadata } from "next";
import Logo from "@/public/logo.png";
import Image from "next/image";
import NavBar from '@/app/(main)/navbar';
import UI from '../../[classId]/ui';
type Props = {
    params: { topicId: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };
async function TopicsPage( { params }: { params: { topicId: string } }) {
const session = await getSession();
const topics = await prisma.note.findMany({
  orderBy:{
   
   updatedAt:'desc'
  },
    where:{
        topicId:params.topicId,
    },
    include:{
        term:true,
    }
})
  return (
    <div className="sm:flex sm:flex-wrap sm:content-start  p-4  gap-4">
    <div className="w-full flex flex-col items-center justify-center">
      <NavBar loggedIn={session.isLoggedIn}></NavBar>
      <Image src={Logo} alt="logo" className="w-[50%] sm:w-[300px] mt-[160px]"></Image>
    </div>
    <br></br>
    <br></br>
    {/* <UI topics={topics}></UI> */}
    <div className="w-full">
      <br></br>
      <br></br>
      <br></br>
    </div>
  </div>
  )
}

export default TopicsPage