import React from "react";
import WebFooter from "../(main)/footer";
import prisma from "@/prisma/db";
import Link from "next/link";
import { Metadata } from "next";
import Logo from "@/public/logo.png";
import Image from "next/image";
import NavBar from "../(main)/navbar";
import { getSession } from "@/actions/session";

export const metadata: Metadata = {
  title: "GHA E-learn",
  description: "",
};
async function Page() {
  const session = await getSession();
  const classes = await prisma.class.findMany({});
  return (
    <div className="sm:flex sm:flex-wrap sm:content-start  p-4  gap-4">
      <div className="w-full flex flex-col items-center justify-center">
        <NavBar loggedIn={session.isLoggedIn}></NavBar>
        <Image src={Logo} alt="logo" className="w-[50%] sm:w-[300px] mt-[160px]"></Image>
      </div>
      <div className="w-full">
        {" "}
        <center>
          <h3 className="text-3xl">Select Your Class</h3>
        </center>
      </div>
      <br></br>
      <br></br>
      {classes.map((c) => {
        return (
          <Link href={"learn/"+c.id} key={c.id} className="border p-4 block rounded-lg w-full h-16 sm:w-auto m-1">
            <div className="font-bold text-2xl uppercase">{c.className}</div>
          </Link>
        );
      })}
      <div className="w-full">
        <br></br>
        <br></br>
        <br></br>
      </div>
    </div>
  );
}

export default Page;
