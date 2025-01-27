"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { ToggleExam } from "@/actions/academics/exam/toggle_exam";
import { InfinitySpin } from "react-loader-spinner";
import { ReleaseExam } from "@/actions/academics/exam/releaseExam";
import { toast } from "@/components/ui/use-toast";
import { FaPrint } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { IoPrint } from "react-icons/io5";
import { FiPrinter } from "react-icons/fi";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { PrintReport } from "@/actions/academics/exam/print_exam";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";
import Image from "next/image";
import { rT } from "@/types";
import logo from "@/public/logo.png";
import gesLogo from "@/public/ges.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
function ExamUI({
  user,
  exams,
}: {
  user: Prisma.UserGetPayload<{
    include: {
      staff: {
        include: {
          permissions: true;
        };
      };
    };
  }>;
  exams: Prisma.ExaminationGetPayload<{
    include: {
      term: true;
      subjects: {
        include: {
          subject: {
            include: {
              class: true;
              staff: true;
            };
          };
        };
      };
    };
  }>[];
}) {
  const [examsList, setExamsList] = React.useState(exams);
  const [showLoading, setShowLoading] = React.useState(false);
  return (
    <>
      <div className="p-2 flex flex-col flex-1 gap-2 overflow-hidden">
        <div className="flex gap-2">
          <Input placeholder="Search..."></Input>
          {user.staff?.permissions.length ? (
            <Link href={"./exams/create"}>
              <Button>Create</Button>
            </Link>
          ) : (
            <></>
          )}
        </div>
        <div className="flex-1 flex flex-row flex-wrap content-start items-start justify-start gap-2 overflow-y-scroll">
          {examsList.map((exam) => {
            let classes: { name: string; id: string }[] = [];
            exam.subjects.forEach((e) => {});
            for (let x = 0; x < exam.subjects.length; x++) {
              let e = exam.subjects[x];
              if (!classes.find((f) => f.id == e.subject.class.id)?.id) {
                classes.push({
                  name: e.subject.class.className,
                  id: e.subject.class.id,
                });
              }
            }
            return (
              <div
                key={exam.id}
                className=" p-4 flex flex-col gap-2 w-full border rounded-sm  lg:w-[350px]"
              >
                <div className="capitalize font-bold">{exam.title}</div>
                <div className="capitalize ">
                  Subjects: {exam.subjects.length}
                </div>
                <div className="capitalize text-red-500">
                  Due Date: {exam.date.toLocaleDateString("en-GB")}
                </div>
                {user.staff?.permissions.length ? (
                  <div className="border p-2 rounded-sm flex justify-between">
                    {!exam.release ? (
                      <div className="flex items-center space-x-2">
                        <Switch
                          onCheckedChange={async (e) => {
                            setShowLoading(true);
                            const res = await ReleaseExam(exam.id);
                            setShowLoading(false);
                            if (res.error)
                              return toast({
                                title: "Error",
                                description: res.errorMessage,
                                variant: "destructive",
                              });
                            setExamsList([]);
                            setExamsList(res.exams!);
                          }}
                          checked={exam.release}
                          id="release"
                        />
                        <Label htmlFor="release">Release</Label>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="flex items-center space-x-2">
                      <Switch
                        onCheckedChange={async (e) => {
                          setShowLoading(true);
                          const m = await ToggleExam(exam.id.toString(), e);
                          setShowLoading(false);
                          if (m.error) {
                            return;
                          }
                          setExamsList([]);
                          setExamsList([...m.exams]);
                        }}
                        checked={exam.open}
                        id="active"
                      />
                      <Label htmlFor="active">Open</Label>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {exam.open ? (
                  <Link href={`/dashboard/academics/exams/create/${exam.id}`}>
                    <Button>Record Marks</Button>
                  </Link>
                ) : (
                  <></>
                )}
                {exam.release ? (
                  <PrintDialog
                    exam={exam}
                    classes={classes}
                    key={exam.id}
                  ></PrintDialog>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {showLoading ? (
        <div className="fixed flex flex-col justify-end items-start z-50 left-0 top-0 w-full h-full bg-slate-900 bg-opacity-20">
          <div className="items-center flex-col w-full bg-white dark:bg-black  flex justify-center p-4">
            <h1>Loading</h1>
            <InfinitySpin width="200" color="#4fa94d" />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default ExamUI;

function PrintDialog({
  classes,
  exam,
}: {
  classes: { name: string; id: string }[];
  exam: Prisma.ExaminationGetPayload<{
    include: {
      term: true;
      subjects: {
        include: {
          subject: {
            include: {
              class: true;
              staff: true;
            };
          };
        };
      };
    };
  }>;
}) {
  const [studentId, setStudentId] = React.useState("");
  const [selectedClasses, setSelectedClasses] = React.useState<string[]>([]);
  const [showLoading, setShowLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [reports, setReports] = React.useState<rT[]>([]);
  const printRef = React.useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  useEffect(() => {
    if (reports.length > 0) {
      handlePrint();
      setShowLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);
  const printCall = async () => {
    setShowLoading(true);
    const res = await PrintReport({
      classes: selectedClasses.map((e) => e),
      studentId,
      examId: exam.id,
    });
    if (res.error) {
      setShowLoading(false);

      return toast({
        title: "Error occurred",
        description: res.errorMessage,
        variant: "destructive",
      });
    }
    if (res.reports) {
      setReports(res.reports);
    }
  };
  return (
    <>
      {" "}
      <AlertDialog open={show} onOpenChange={setShow}>
        <AlertDialogTrigger className="w-full">
          <Button className="flex flex-row justify-between p-3 w-[100px]">
            <div> Print </div> <FiPrinter size={20}></FiPrinter>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="flex flex-col justify-start gap-2">
          {!showLoading ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Select Student(s)</AlertDialogTitle>
              </AlertDialogHeader>
              <hr></hr>
              <Input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                type="number"
                placeholder="Student ID"
              />
              <div className="flex flex-row flex-wrap content-start gap-x-6">
                {classes.map((e) => {
                  return (
                    <div key={e.id} className="flex gap-2 items-center">
                      <Checkbox
                        id={e.id}
                        checked={selectedClasses.includes(e.id)}
                        onCheckedChange={(c) => {
                          if (selectedClasses.includes(e.id)) {
                            let m = selectedClasses.filter((d) => d != e.id);
                            setSelectedClasses(m);
                          } else {
                            let m = selectedClasses;
                            setSelectedClasses([...m, e.id]);
                          }
                        }}
                      ></Checkbox>
                      <label htmlFor={e.id} className="capitalize font-bold">
                        {e.name}
                      </label>
                    </div>
                  );
                })}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button onClick={printCall}>Print</Button>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <div className="flex flex-1 justify-center items-center">
                <InfinitySpin></InfinitySpin>
              </div>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
      {/* /////////////////////////////// */}
      <div className="hidden">
        <div ref={printRef} className="w-[210mm] ">
          {reports.map((report) => {
            return (
              <div
                key={report.id}
                className="w-[210mm] h-[297mm] overflow-hidden  flex flex-col justify-start border-4 border-blue-600"
              >
                <div className="bg-gradient-to-r p-2  shadow-md from-white via-white to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image
                        className="h-[130px] w-[130px] mr-4"
                        src={logo}
                        alt="logo"
                      ></Image>
                      <div>
                        <h1
                          className=" text-2xl font-bold text-blue-950"
                          style={{ textShadow: "2px 2px 0 white" }}
                        >
                          {process.env.NEXT_PUBLIC_SCHOOL}
                        </h1>

                        <p className="">{process.env.NEXT_PUBLIC_DOMAIN}</p>
                        <p className="">
                          {process.env.NEXT_PUBLIC_SCHOOL_CONTACT}
                        </p>
                        <p className="">
                          {process.env.NEXT_PUBLIC_SCHOOL_SLOGAN}
                        </p>
                      </div>
                    </div>
                    <QRCode
                      className="w-[100px] h-[100px]"
                      value={
                        process.env.NEXT_PUBLIC_DOMAIN +
                        "/student/report" +
                        exam.id
                      }
                    ></QRCode>
                    <Avatar className="w-[120px] h-[120px] cursor-pointer dark:text-white text-black font-normal text-3xl">
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${report.student?.images[0]?.id}`}
                        alt="PIC"
                        
                      />
                    </Avatar>
                  </div>
                </div>
                {/*  */}
                <div className="p-6">
                  <div className="flex justify-center w-full">
                    <h1 className="text-xl capitalize font-bold w-full text-center underline underline-offset-4">
                      {report.exams.title} Report
                    </h1>
                  </div>
                </div>
                {/*  */}
                <table className="min-w-full bg-white border border-gray-200 p-4">
                  <thead></thead>
                  <tbody>
                    <tr className="border">
                      <td className="px-4 py-2 border">Name</td>
                      <td
                        colSpan={3}
                        className="px-4 py-2 border-b text-left text-blue-900 font-bold"
                      >
                        {report.student?.firstName} {report.student?.lastName}
                      </td>
                    </tr>
                    <tr className="border">
                      <td className="px-4 py-2 border">Class</td>
                      <td className="px-4 py-2 border-b text-left uppercase text-blue-900">
                        {report.class.className}
                      </td>
                      <td className="px-4 py-2 border">Student ID</td>
                      <td className="px-4 py-2 border-b text-left uppercase text-blue-900">
                        {report.student.userId}
                      </td>
                    </tr>
                    <tr className="border">
                      <td className="px-4 py-2 border">Subjects</td>
                      <td className="px-4 py-2 border-b text-left uppercase text-blue-900">
                        {report.exams.records.length}
                      </td>
                      <td className="px-4 py-2 border">Average Score</td>
                      <td className="px-4 py-2 border-b text-left uppercase text-blue-900">
                        {Math.round(
                          report.totalScore / report.exams.records.length
                        )}
                      </td>
                      <td className="px-4 py-2 border">Total Score</td>
                      <td className="px-4 font-bold py-2 border-b text-left uppercase text-pink-950">
                        {report.totalScore}
                      </td>
                    </tr>
                    <tr className="border">
                      <td className="px-4 py-2 border">Class Total</td>
                      <td className="px-4 py-2 border-b text-left uppercase text-blue-900">
                        {report.class.students.length}
                      </td>
                      <td className="px-4 py-2 border">Position</td>
                      <td className="px-4 py-2 border-b text-left uppercase text-red-700 font-bold">
                        {report.exams.showPosition
                          ? getS(report.position!.toString())
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 border">Grade</td>
                      <td className="px-4 font-bold py-2 border-b text-left uppercase text-pink-950">
                        {report.exams.showGrade ? report.grade : "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br></br>
                {/*  */}
                <table className="min-w-full bg-white border border-gray-200 p-4">
                  <thead className="bg-blue-700">
                    <tr>
                      <th className="px-4 py-2  text-sm font-bold text-white border-b">
                        Subject
                      </th>
                      <th className="px-4 py-2 text-sm font-bold text-white border-b text-center">
                        Class Score
                      </th>
                      <th className="px-4 py-2  text-sm font-bold text-white border-b text-center">
                        Exam Score
                      </th>
                      <th className="px-4 py-2 text-sm font-bold text-white border-b text-center">
                        Total
                      </th>
                      <th className="px-4 py-2  text-sm font-bold text-white border-b text-center">
                        Grade
                      </th>
                      <th className="px-4 py-2  text-sm font-bold text-white border-b text-start">
                        Remark
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.exams.records.map((record) => {
                      return (
                        <tr
                          key={record.id}
                          className="hover:bg-gray-50 text-center"
                        >
                          <td className="px-4 uppercase py-3 text-sm text-gray-800 border-b text-start">
                            {record.subject.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 border-b text-center">
                            {Math.round(
                              record.classScore! *
                                (report.exams.classScorePercent / 60)
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 border-b text-center">
                            {Math.round(
                              record.examScore! *
                                ((100 - report.exams.classScorePercent) / 100)
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 border-b text-center">
                            {Math.round(record.total)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 border-b text-center">
                            {Math.round(record.grade)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 border-b text-start">
                            {record.Remark}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <br></br>
                {/*  */}
                <table className="min-w-full bg-white border border-gray-200 p-4">
                  <tbody>
                    <tr className="flex">
                      <td className="px-4 py-2 border">Interest</td>
                      <td
                        colSpan={1}
                        className="px-4 py-2 border-b text-left w-full flex-1"
                      ></td>
                      <td className="px-4 py-2 border">Attendance</td>
                      <td className="px-4 py-2 border-b  w-full flex-1 text-center">
                        /
                      </td>
                    </tr>
                    <tr className="flex">
                      <td className="px-4 py-2 border">Conduct</td>
                      <td
                        colSpan={1}
                        className="px-4 py-2 border-b text-left w-full flex-1"
                      ></td>
                    </tr>
                    <tr className="flex">
                      <td className="px-4 py-2 border">Teachers Remark</td>
                      <td
                        colSpan={1}
                        className="px-4 py-2 border-b text-left w-full flex-1"
                      ></td>
                    </tr>
                    <tr className="flex">
                      <td className="px-4 py-2 border">
                        Head Teachers Remark
                      </td>
                      <td
                        colSpan={1}
                        className="px-4 py-2 border-b text-left w-full flex-1"
                      ></td>  
                    </tr>
                  </tbody>
                </table>

                <div className=" flex-1 flex flex-col justify-end p-6">
                  <div className="flex justify-between w-full flex-row">
                    <div>
                      <p className="text-xl text-gray-600  border-t">
                        
                        Head Teacher{"'"}s Signature
                      </p>
                    </div>
                    <div>
                      <p className="text-xl text-gray-600  border-t text-center">
                        ({report.class.formMaster?.firstName} {report.class.formMaster?.lastName})
                        <br></br>
                        Class Teacher{"'"}s Signature
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function getS(d: string): string {
  const lastTwo = d.slice(-2); // Get the last two characters
  const lastDigit = d.slice(-1); // Get the last character

  // Special cases for 11th, 12th, and 13th
  if (["11", "12", "13"].includes(lastTwo)) {
    return `${d}th`;
  }

  // Handle regular cases based on the last digit
  switch (lastDigit) {
    case "1":
      return `${d}st`;
    case "2":
      return `${d}nd`;
    case "3":
      return `${d}rd`;
    default:
      return `${d}th`;
  }
}
