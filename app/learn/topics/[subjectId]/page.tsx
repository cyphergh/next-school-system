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
    params: { subjectId: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };
async function TopicsPage( { params }: { params: { subjectId: string } }) {
const session = await getSession();
const topics = await prisma.topic.findMany({
  orderBy:{
   
   updatedAt:'desc'
  },
    where:{
        subjectId:params.subjectId,
    },
})
  return (
    <div className="sm:flex sm:flex-wrap sm:content-start  p-4  gap-4">
    <div className="w-full flex flex-col items-center justify-center">
      <Image src={Logo} alt="logo" className="w-[50%] sm:w-[200px] "></Image>
    </div>
    <div className="w-full">
      <center>
        <h3 className="text-3xl">Select Topic</h3>
      </center>
    </div>
    <br></br>
    <br></br>
    <UI topics={topics}></UI>
    <div className="w-full">
      <br></br>
      <br></br>
      <br></br>
    </div>
  </div>
  )
}

export default TopicsPage