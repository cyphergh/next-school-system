import { getSession } from '@/actions/session';
import React from 'react'
import prisma from "@/prisma/db";
import Link from "next/link";
import { Metadata } from "next";
import Logo from "@/public/logo.png";
import Image from "next/image";

async function ClassPage( { params }: { params: { classId: string } }) {
const session = await getSession();
const subjects = await prisma.subject.findMany({
 
    where:{
        classId:params.classId
    },
    include:{
        staff:true,
        class:true,
    }
})
  return (
    <div className="sm:flex sm:flex-wrap sm:content-start  p-4  gap-4">
    <div className="w-full flex flex-col items-center justify-center">
      <Image src={Logo} alt="logo" className="w-[50%] sm:w-[300px] mt-[160px]"></Image>
    </div>
    <div className="w-full">
      {" "}
      <center>
        <h3 className="text-3xl">Select Subject</h3>
      </center>
    </div>
    <br></br>
    <br></br>
    {subjects.map((c) => {
      return (
        <Link href={"topics/"+c.id} key={c.id} className="border p-4 block rounded-lg w-full h-[120px] sm:w-auto m-1">
          <div className="font-bold text-xl uppercase">{c.name}</div>
          <div className="font-bold text-lg  uppercase">{c.class.className}</div>
          <div className='capitalize'>{c.staff.gender==="MALE"?"Mr.":"Mad."} {c.staff.firstName} {c.staff.lastName}</div>
        </Link>
      );
    })}
    {!subjects.length && <div className='w-full text-center text-red-600'>No Subject Available Now</div>}
    <div className="w-full">
      <br></br>
      <br></br>
      <br></br>
    </div>
  </div>
  )
}

export default ClassPage