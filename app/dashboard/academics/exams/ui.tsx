"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { Label } from "@/components/ui/label";
import { ToggleExam } from "@/actions/academics/exam/toggle_exam";
import { InfinitySpin } from "react-loader-spinner";
import { ReleaseExam } from "@/actions/academics/exam/releaseExam";
import { toast } from "@/components/ui/use-toast";

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
                    <div className="flex items-center space-x-2">
                      <Switch
                        onCheckedChange={async (e) => {
                          setShowLoading(true);
                           const res = await ReleaseExam(exam.id);
                           setShowLoading(false);
                           if(res.error) return toast({
                             title:"Error",
                             description:res.errorMessage,
                             variant:"destructive"
                           });

                        }}
                        checked={exam.release}
                        id="active"
                      />
                      <Label htmlFor="active">Release</Label>
                    </div>
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
