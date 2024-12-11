"use client";
import { getSubject } from "@/actions/academics/exam/get_subject";
import { Record } from "@/actions/academics/exam/record";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Examination, Prisma, Student } from "@prisma/client";
import React, { useEffect } from "react";
import { FaSync } from "react-icons/fa";
import { InfinitySpin } from "react-loader-spinner";

function SubjectCard({
  sub,
  exam,
}: {
  exam: Examination;
  sub: Prisma.SubjectGetPayload<{
    include: {
      examRecords: true;
      exams: true;
      class: {
        include: {
          students: true;
        };
      };
    };
  }>;
}) {
  const [subject, setSubject] = React.useState(sub);
  const [show, setShow] = React.useState(false);
  const [loading, setShowLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  useEffect(() => {
    getSub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getSub = async () => {
    setShowLoading(true);
    const subj = await getSubject(subject.id, exam.id);
    setShowLoading(false);
    if (subj.error)
      return toast({
        title: "Error",
        description: subj.errorMessage,
        variant: "destructive",
      });
    setSubject(subj.subject!);
  };
  return (
    <>
      <AlertDialog open={show}>
        <AlertDialogContent className="min-h-[100%] max-h-[100%] flex flex-col overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle className="capitalize flex flex-row justify-between">
              <div className="flex-1 text-center">
                Record {subject.name} {subject.class.className}
              </div>{" "}
              <div>
                <FaSync className="cursor-pointer" onClick={getSub}></FaSync>
              </div>{" "}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex-1 flex-col overflow-y-scroll gap-y-2 ">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            ></Input>
            <hr className="w-full p-2"></hr>
            {!loading ? (
              subject.class.students
                .filter((e) =>
                  (e.firstName + " " + e.lastName)
                    .toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase())
                )
                .map((student) => {
                  return (
                    <StudentRecord
                      key={student.id}
                      student={student}
                      subject={subject}
                      exam={exam}
                    ></StudentRecord>
                  );
                })
            ) : (
              <center>
                {" "}
                <InfinitySpin></InfinitySpin>
              </center>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShow(false)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div
        onClick={() => setShow(true)}
        className=" p-4 flex flex-col gap-2 w-full border rounded-sm  lg:w-[350px] cursor-pointer hover:bg-orange-100"
      >
        <div className="flex flex-row items-center">
          <div className="flex flex-col flex-1 gap-2">
            <div className="font-bold uppercase">{subject.class.className}</div>
            <div className="capitalize">{subject.name}</div>
          </div>
          <div className="font-bold text-2xl">
            {Math.floor((subject.examRecords.filter((e) => e.done == true).length /
              subject.class.students.length) *
              100)}
            %
          </div>
        </div>
        <Progress
          value={
            Math.floor((subject.examRecords.filter((e) => e.done == true).length /
              subject.class.students.length) *
            100)
          }
        />
      </div>
    </>
  );
}

export default SubjectCard;

function StudentRecord({
  subject,
  student,
  exam,
}: {
  exam: Examination;
  subject: Prisma.SubjectGetPayload<{
    include: {
      examRecords: true;
      exams: true;
      class: {
        include: {
          students: true;
        };
      };
    };
  }>;
  student: Student;
}) {
  const [examScore, setExamScore] = React.useState(
    (
      subject.examRecords.find((e) => e.studentId == student.id)?.examScore ??
      ""
    ).toString()
  );
  const [classScore, setClassScore] = React.useState(
    (
      subject.examRecords.find((e) => e.studentId == student.id)?.classScore ??
      ""
    ).toString()
  );
  const [loading, setLoading] = React.useState(false);
  const save = async () => {
    if (parseInt(classScore) > 60) {
      return toast({
        title: "Error",
        description: "Class score cannot be greater than 60",
        variant: "destructive",
      });
    }
    if (parseInt(classScore) < 0) {
      return toast({
        title: "Error",
        description: "Class score cannot be less than 0",
        variant: "destructive",
      });
    }
    if (parseInt(examScore) > 100) {
      return toast({
        title: "Error",
        description: "Exam score cannot be greater than 100",
        variant: "destructive",
      });
    }
    if (parseInt(examScore) < 0) {
      return toast({
        title: "Error",
        description: "Exam score cannot be less than 0",
        variant: "destructive",
      });
    }
    setLoading(true);
    const res = await Record(
        exam.id,
        subject.id,
        parseFloat(classScore),
        parseFloat(examScore),
        student.id,
    );
    setLoading(false);
    if(res.error) return toast({
        title: "Error",
        description: res.errorMessage,
        variant: "destructive",
    });
  };
  return (
    <div className="border p-3 rounded-sm mb-2">
      <div className="font-bold p-2">
        {student.firstName} {student.lastName}
      </div>
      <div className="flex flex-row gap-2">
        <Input
          onChange={(e) => setExamScore(e.target.value)}
          value={examScore}
          type="number"
          placeholder="Exam Score"
        ></Input>
        {exam.classScoreSource == "Manual" ? (
          <Input
            onChange={(e) => setClassScore(e.target.value)}
            value={classScore}
            type="number"
            placeholder="Class Score"
          ></Input>
        ) : (
          <></>
        )}
        {!loading ? (
          <Button onClick={save}>Save</Button>
        ) : (
          <FaSync size={30} className="animate-spin"></FaSync>
        )}
      </div>
    </div>
  );
}
