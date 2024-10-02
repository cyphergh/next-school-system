"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StInfo } from "@/types";
import React, { useRef, useState } from "react";
import { FaSync } from "react-icons/fa";
import { PiPrinterLight } from "react-icons/pi";
import { TbMessageCircle } from "react-icons/tb";
import { useReactToPrint } from "react-to-print";
import Logo from "@/public/logo.png";
import Image from "next/image";
import QRCode from "react-qr-code";
import { GetDebtors } from "@/actions/finance/debtors";
function UI({ st }: { st: StInfo[] }) {
  const [students, setStudents] = useState<StInfo[]>(st);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const refresh = async () => {
    try {
      setRefreshing(true);
      const res = await GetDebtors();
      setRefreshing(false);
      if (res.error) throw Error(res.errorMessage);
      if (!res.students) throw Error("No students found");
      if (res.students) setStudents(res.students);
    } catch (error) {
      setRefreshing(false);
      throw Error("No students found");
    }
  };
  return (
    <div className="flex-1 p-4 overflow-hidden flex flex-col">
      <Card className="w-full flex   p-4 gap-x-3">
        <Button className="rounded-full p-3 w-[40px] h-[40px]">
          <FaSync
          onClick={refresh}
            className={`cursor-pointer ${refreshing && "animate-spin"}`}
            size={30}
          ></FaSync>
        </Button>
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search..."
        ></Input>
      </Card>
      <div className="w-full flex flex-col p-4 sm:flex-row sm:flex-wrap overflow-y-scroll flex-1 gap-2 content-start">
        {students
          .filter((e) => {
            return (
              e.firstName +
              " " +
              e.lastName +
              " " +
              e.class.className +
              " " +
              e.emailAddress +
              " " +
              e.type
            )
              .toLowerCase()
              .includes(search.toLowerCase());
          })
          .map((e) => {
            return (
              <Card
                className=" -full p-4 flex flex-col  sm:w-[48%] lg:w-[300px] rounded-lg"
                key={e.id}
                title={e.firstName + " " + e.lastName}
              >
                <div className="flex gap-x-2 items-center">
                  <Avatar className="w-[80px] h-[80px] cursor-pointer dark:text-white text-black font-normal text-3xl">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${e?.images[0]?.id}`}
                      alt="profile"
                    />
                    <AvatarFallback>
                      {e.firstName[0]}
                      {e.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full flex flex-col gap-0">
                    <h1 className="text-lg font-bold">
                      {e.firstName} {e.lastName}
                    </h1>
                    <p className="text-lg capitalize">{e.class.className}</p>
                    <p className="text-lg capitalize">{e.type}</p>
                  </div>
                </div>
                <div className="flex flex-row gap-x-4">
                  <div className="w-full flex flex-col gap-1 ">
                    <h1 className="text-lg font-bold">Balance</h1>
                    <p className="text-sm">&#8373; {e.balance}</p>
                    <div className="flex flex-row gap-x-2">
                      <PrintDebtors students={e}></PrintDebtors>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1 ">
                    <h1 className="text-lg font-bold">Guardian</h1>
                    <p className="text-sm capitalize">{e.guardianName}</p>
                    <p className="text-sm capitalize">{e.guardianPhone}</p>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

export default UI;

function PrintDebtors({ students }: { students: StInfo }) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  return (
    <>
      <PiPrinterLight
        className="cursor-pointer"
        onClick={handlePrint}
        size={30}
      ></PiPrinterLight>
      <div className="hidden">
        <div ref={printRef} className="w-[210mm]">
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-400 to-blue-900 p-4 mb-8">
            <div className="flex items-center">
              <Card className="p-0 rounded-full bg-transparent border-0 mr-4">
                <Image src={Logo} alt="logo" className="w-[100px]"></Image>
              </Card>
              <div>
                <h1 className="text-white text-2xl font-bold">
                  {process.env.NEXT_PUBLIC_SCHOOL}
                </h1>
                <h1 className="text-white text-lg font-bold">
                  Ghana Education Service
                </h1>
                <p className="text-blue-100">
                  {process.env.NEXT_PUBLIC_DOMAIN}
                </p>
                <p className="text-blue-100">
                  {process.env.NEXT_PUBLIC_SCHOOL_SLOGAN}
                </p>
              </div>
            </div>
            <div className="text-right text-white">
              <p>{process.env.NEXT_PUBLIC_SCHOOL_LOCATION}</p>
              <p>{process.env.NEXT_PUBLIC_SCHOOL_CONTACT}</p>
              <p>{process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</p>
            </div>
          </div>
          <div className="p-2 w-full text-center pt-1 ">
            <h1 className="text-xl font-bold">Student Financial Records</h1>
          </div>
          <div className="w-full p-4 flex flex-row gap-4 justify-around">
            <div className="w-full p-4">
              <h1 className="text-xl  border-b w-full">Student</h1>
              <p className="text-lg font-bold capitalize">
                {students.firstName + " " + students.lastName}
              </p>
              <p className="text-lg uppercase">{students.class.className}</p>
              <p className="text-lg capitalize ">{students.type}</p>
            </div>
            <div className="w-full p-4">
              {" "}
              <h1 className="text-xl  border-b w-full">Guardian</h1>
              <p className="text-lg font-bold capitalize">
                {students.guardianName}
              </p>
              <p className="text-lg uppercase">{students.guardianPhone}</p>
              <p className="text-lg lowercase">{students.guardianEmail}</p>
            </div>
            <div className="w-full p-4">
              {" "}
              <h1 className="text-xl border-b w-full">Finance</h1>
              <p className="text-lg font-bold capitalize">
                &#8373; {students.balance}
              </p>
              <p className="text-lg uppercase">
                {students.updatedAt.toLocaleDateString("en-GB")}
              </p>
              <p className="text-lg lowercase">
                {students.updatedAt.toLocaleTimeString("en-GB")}
              </p>
            </div>
          </div>
          <div className="p-8">
            Dear <b className="capitalize">{students.guardianName}</b>, We hope
            this message finds you well. This is to kindly inform you that your
            ward,{" "}
            <b className="capitalize">
              {students.firstName} {students.lastName}
            </b>
            , has an outstanding balance in their school account. To view the
            complete breakdown of the transactions and fees owed, please scan
            the QR code below:
            <div className="p-8">
              <QRCode
                size={160}
                value={`${process.env.NEXT_PUBLIC_DOMAIN}/view/student/account/${students.id}`}
              ></QRCode>
            </div>
            We kindly ask that you settle this balance as soon as possible to
            avoid any disruption to your ward{"'"}s academic activities. If you
            have any questions or require further assistance, please do not
            hesitate to contact the school administration. Thank you for your
            prompt attention to this matter.
          </div>
        </div>
      </div>
    </>
  );
}
