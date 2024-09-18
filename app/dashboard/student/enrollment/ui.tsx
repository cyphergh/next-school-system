"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StInfo } from "@/types";
import React, { forwardRef, Ref, useRef, useState } from "react";
import { IoPrintOutline, IoRefresh } from "react-icons/io5";
import Logo from "@/public/logo.png";
import Image from "next/image";
import QRCode from "react-qr-code";
import StudentMiniInfo from "./components/mini-info";
import { GetStudentsInfo } from "@/actions/student/info_students";
import { FaSync } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
function EnrollmentUI({ st }: { st: StInfo[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [stage, setStage] = useState("");
  const [students, setStudents] = useState<StInfo[]>(st);
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const res = await GetStudentsInfo();
      setLoading(false);
      if (res.error) return;
      if (res.students) setStudents([...res.students]);
    } catch (error) {
      setLoading(false);
    }
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="flex-1 p-0 flex flex-col overflow-x-hidden overflow-y-scroll">
      <div className="pt-2">
        <Card className="w-full p-4 flex flex-col sm:flex-row gap-2 ">
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 rounded-full w-10 h-10 shrink-0 transition-colors duration-300
      bg-gray-200 text-gray-700 hover:bg-gray-300
      dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
      focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center"
          >
            <FaSync className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="p-3"
          ></Input>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3"
          ></Input>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="p-3"
          ></Input>
          <Input
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            placeholder="Class"
            className="p-3"
          ></Input>
          <button
            onClick={handlePrint}
            disabled={loading}
            className="p-2 rounded-full w-10 h-10 shrink-0 transition-colors duration-300
      bg-gray-200 text-gray-700 hover:bg-gray-300
      dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
      focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center"
          >
            <IoPrintOutline
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </Card>
      </div>
      <div className="flex-1 p-4 flex flex-col  gap-4 sm:flex-row sm:flex-wrap content-start">
        {students.map((student) => {
          let validated: boolean;
          let validateName =
            student.firstName.toLowerCase().includes(name.toLowerCase()) ||
            student.lastName.toLowerCase().includes(name.toLowerCase()) ||
            (student.firstName + " " + student.lastName)
              .toLowerCase()
              .includes(name.toLowerCase()) ||
            (student.lastName + " " + student.firstName)
              .toLowerCase()
              .includes(name.toLowerCase()) ||
            student.mother.firstName
              .toLowerCase()
              .includes(name.toLowerCase()) ||
            student.mother.lastName
              .toLowerCase()
              .includes(name.toLowerCase()) ||
            (student.mother.firstName + " " + student.mother.lastName)
              .toLowerCase()
              .includes(name.toLowerCase()) ||
            (student.mother.lastName + " " + student.father.firstName)
              .toLowerCase()
              .includes(name.toLowerCase()) ||
            student.father.firstName
              .toLowerCase()
              .includes(name.toLowerCase()) ||
            student.father.lastName
              .toLowerCase()
              .includes(name.toLowerCase()) ||
            (student.father.firstName + " " + student.father.lastName)
              .toLowerCase()
              .includes(name.toLowerCase()) ||
            (student.father.lastName + " " + student.father.firstName)
              .toLowerCase()
              .includes(name.toLowerCase());
          let validateEmail =
            student.emailAddress.toLowerCase().includes(email.toLowerCase()) ||
            student.mother.emailAddress
              ?.toLowerCase()
              .includes(email.toLowerCase()) ||
            student.father.emailAddress
              ?.toLowerCase()
              .includes(email.toLowerCase());
          let validatePhone =
            student.phoneNumber?.includes(phoneNumber) ||
            student.mother.phoneNumber?.includes(phoneNumber) ||
            student.father.phoneNumber?.includes(phoneNumber);
          let validateStage = student.class.className
            .toLowerCase()
            .includes(stage.toLowerCase());
          validated =
            (validateName && validateEmail && validatePhone && validateStage) ??
            false;
          if (!validated) return <></>;
          return (
            <div
              key={student.id}
              className="flex gap-x-3 w-full sm:w-[48%] lg:w-[350px]"
            >
              <StudentMiniInfo student={student}></StudentMiniInfo>
            </div>
          );
        })}
      </div>
      <div className="hidden">
        <PrintStudentCard
          ref={printRef}
          students={students.filter((student) => {
            let validated: boolean;
            let validateName =
              student.firstName.toLowerCase().includes(name.toLowerCase()) ||
              student.lastName.toLowerCase().includes(name.toLowerCase()) ||
              (student.firstName + " " + student.lastName)
                .toLowerCase()
                .includes(name.toLowerCase()) ||
              (student.lastName + " " + student.firstName)
                .toLowerCase()
                .includes(name.toLowerCase()) ||
              student.mother.firstName
                .toLowerCase()
                .includes(name.toLowerCase()) ||
              student.mother.lastName
                .toLowerCase()
                .includes(name.toLowerCase()) ||
              (student.mother.firstName + " " + student.mother.lastName)
                .toLowerCase()
                .includes(name.toLowerCase()) ||
              (student.mother.lastName + " " + student.father.firstName)
                .toLowerCase()
                .includes(name.toLowerCase()) ||
              student.father.firstName
                .toLowerCase()
                .includes(name.toLowerCase()) ||
              student.father.lastName
                .toLowerCase()
                .includes(name.toLowerCase()) ||
              (student.father.firstName + " " + student.father.lastName)
                .toLowerCase()
                .includes(name.toLowerCase()) ||
              (student.father.lastName + " " + student.father.firstName)
                .toLowerCase()
                .includes(name.toLowerCase());
            let validateEmail =
              student.emailAddress
                .toLowerCase()
                .includes(email.toLowerCase()) ||
              student.mother.emailAddress
                ?.toLowerCase()
                .includes(email.toLowerCase()) ||
              student.father.emailAddress
                ?.toLowerCase()
                .includes(email.toLowerCase());
            let validatePhone =
              student.phoneNumber?.includes(phoneNumber) ||
              student.mother.phoneNumber?.includes(phoneNumber) ||
              student.father.phoneNumber?.includes(phoneNumber);
            let validateStage = student.class.className
              .toLowerCase()
              .includes(stage.toLowerCase());
            validated =
              (validateName &&
                validateEmail &&
                validatePhone &&
                validateStage) ??
              false;
            return validated;
          })}
        ></PrintStudentCard>
      </div>
    </div>
  );
}

const PrintStudentCard = forwardRef(
  (props: { students: StInfo[] }, ref: Ref<HTMLDivElement>) => {
    return (
      <div ref={ref}>
        {props.students.map((student) => (
          <div
            className="w-full flex justify-center items-center h-[99mm]"
            key={student.id + "print-p"}
          >
            <Card className="h-[53.98mm] w-[85.98mm] shrink-0  bg-gradient-to-tr from-blue-500 to-blue-700 p-2 text-white capitalize">
              <div
                className="font-mono p-2 pb-0"
                key={student.id + "print-card"}
              >
                <div className="font-bold text-[16px]">
                  {student.firstName} {student.lastName}
                </div>
                <div className="lowercase">{student.emailAddress}</div>
              </div>
              <div className="w-full border-b border-blue-500"></div>
              <div className="font-mono flex  items-center justify-between flex-row-reverse p-2 gap-x-2 pt-0">
                <Avatar className="w-[120px] h-[120px] cursor-pointer dark:text-white text-black font-normal text-3xl">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${student?.images[0]?.id}`}
                    alt="profile"
                  />
                  <AvatarFallback>
                    {student.firstName[0]}
                    {student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              <QRCode value={process.env.NEXT_PUBLIC_DOMAIN+"/student/"+student.id} bgColor="blue" fgColor="white" size={80}></QRCode>
              <div className="flex flex-col justify-start h-full p-2 flex-1 gap-y-1">
                <div className="uppercase font-bold text-lg">{student.userId}</div>
                <div className="uppercase">{student.class.className}</div>
                <div className="uppercase">{student.type}</div>
                <div className="uppercase">{student.gender}</div>
                <div className="border-b border-blue-500 w-full"></div>
              </div>
              </div>
              {/* <div className="p-2 w-full text-center">
        {process.env.NEXT_PUBLIC_SCHOOL}
        </div> */}
            </Card>
            <div className="w-8"></div>
            <Card className="h-[53.98mm] w-[85.98mm] shrink-0  bg-gradient-to-tr from-blue-800 to-blue-900 p-2 text-white capitalize">
              <div
                className="font-mono p-2 pb-0"
                key={student.id + "print-card"}
              >
                <div className="font-bold">
                  {process.env.NEXT_PUBLIC_SCHOOL}
                </div>
                <div className="capitalize">
                  {process.env.NEXT_PUBLIC_SCHOOL_LOCATION}
                </div>
                <div className="lowercase">
                  {process.env.NEXT_PUBLIC_SCHOOL_EMAIL}
                </div>
                <div className="lowercase w-full border-b border-blue-800">
                  {process.env.NEXT_PUBLIC_SCHOOL_CONTACT}
                </div>
              </div>
              <div className="font-mono flex  items-center justify-between flex-row-reverse pt-2">
                <div className="flex flex-col">
                  Guardian Information
                  <div className="capitalize">{student.guardianPhone}</div>
                  <div className="capitalize">{student.address}</div>
                </div>
                <Image
                  alt="logo"
                  src={Logo}
                  className="w-[80px] h-[80px]"
                ></Image>
              </div>
              {/* <div className="p-2 w-full text-center">
        {process.env.NEXT_PUBLIC_SCHOOL}
        </div> */}
            </Card>
          </div>
        ))}
      </div>
    );
  }
);
PrintStudentCard.displayName = "student-id-card";
export default EnrollmentUI;
