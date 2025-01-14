"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import NewExercisePopup from "./new_popup";
import {
  Exercise,
  Prisma,
  StudentsOnExercise,
  Submission,
} from "@prisma/client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { InfinitySpin } from "react-loader-spinner";
import { GetStudentsOnExercise } from "@/actions/academics/exercise/get_students";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaSync } from "react-icons/fa";
import { IoCloudDone, IoReload } from "react-icons/io5";
import { RecordExercise } from "@/actions/academics/exercise/record_exercise";

function ExerciseUI({
  topicFromSSR,
}: {
  topicFromSSR: Prisma.TopicGetPayload<{
    include: {
      subject: true;
      exercises: true;
    };
  }>;
}) {
  const [topic,setTopic] = useState<Prisma.TopicGetPayload<{
    include: {
      subject: true;
      exercises: true;
    };
  }>>(topicFromSSR);
  const [exercises, setExercises] = useState<Exercise[]>(topic.exercises);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-3`">
      <div className="font-bold text-center text-lg capitalize p-4">
        {topic.subject.name} - {topic.title} Exercises
      </div>
      <Card className="w-full p-4 flex flex-row ">
        <Input placeholder="Search..." className="mr-3"></Input>
        <NewExercisePopup
          setExercises={setExercises}
          subjectId={topic.subject.id}
          topicId={topic.id}
        />
      </Card>
      <div className=" p-4 flex content-start flex-1 flex-row flex-wrap overflow-y-scroll gap-2">
        {exercises.map((exercise) => {
          return (
            <div
              key={exercise.id}
              className="hover:border-4 hover:border-blue-100 cursor-pointer flex flex-col w-full lg:w-[300px] border rounded-sm  p-2 "
            >
              <div className="p-2 font-mono flex flex-row justify-between">
                <div>{exercise.type}</div>
                <div>
                  [{exercise.totalScore} Mark{exercise.totalScore > 1 && "s"}]
                  <div className="ml-2">
                    {exercise.totalMarked}
                  </div>
                </div>
              </div>
              <hr></hr>
              <div className="capitalize font-bold">{exercise.title}</div>
              <div className="font-bold font-mono">
                {days[exercise.createdAt.getDay() - 1]}
              </div>
              <div className="font-bold font-mono">
                {exercise.createdAt.toLocaleDateString("en-GB")}
              </div>
              <div className="font-bold font-mono">
                {exercise.createdAt.toLocaleTimeString("en-US")}
              </div>
              {exercise.type == "OFFLINE" && (
                <div className="flex flex-row justify-end">
                  <RecordExerciseCard setTopic={setTopic} exercise={exercise}></RecordExerciseCard>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecordExerciseCard({ exercise,setTopic }: { exercise: Exercise,setTopic:React.Dispatch<React.SetStateAction<Prisma.TopicGetPayload<{
  include: {
    subject: true;
    exercises: true;
  };
}>>> }) {
  const [records, setRecords] = useState<
    Prisma.StudentsOnExerciseGetPayload<{
      include: {
        student: {
          include: {
            images: {
              take: 1;
            };
            submissions: {
              include: {
                assessmentScore: true;
              };
            };
          };
        };
        exercise: true;
      };
    }>[]
  >([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const getData = async () => {
    setLoading(true);
    setError(false);
    const res = await GetStudentsOnExercise(exercise.id);
    setLoading(false);
    if (res.error) {
      toast({
        description: res.errorMessage,
        title: "Error",
        variant: "destructive",
      });
      setErrorMessage(res.errorMessage);
      setError(true);
      return;
    }
    setErrorMessage("");
    setError(false);
    if (res.records) setRecords(res.records);
  };
  const [loading, setLoading] = useState(true);
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          onClick={() => {
            getData();
          }}
        >
          Record Marks
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col overflow-hidden justify-start items-start h-dvh">
        <AlertDialogHeader className="w-full">
          <AlertDialogTitle className="capitalize">
            {exercise.title}
          </AlertDialogTitle>
          <div className="capitalize">
            {exercise.createdAt.toLocaleString("en-GB")}
          </div>
        </AlertDialogHeader>
        <hr className="w-full"></hr>

        {!loading && !error && (
          <div className="w-full flex flex-row items-center justify-between gap-x-3">
            {" "}
            <Input
              className="flex-1 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            ></Input>
            <FaSync
              onClick={getData}
              size={25}
              className="cursor-pointer"
            ></FaSync>
          </div>
        )}
        {loading && (
          <div className="w-full flex-1 justify-center items-center flex flex-col">
            <InfinitySpin></InfinitySpin>
          </div>
        )}
        {!loading && !error && (
          <div className="gap-4 flex flex-col flex-1 w-full overflow-y-scroll">
            {records
              .filter((e) =>
                (e.student.firstName + " " + e.student.lastName)
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((e) => {
                return (
                  <RecordCard
                    key={e.studentId + e.exerciseId}
                    record={e}
                  ></RecordCard>
                );
              })}
          </div>
        )}
        {!loading && error && (
          <div className="flex flex-col gap-y-4 flex-1 w-full text-red-700 font-bold capitalize text-center justify-center items-center">
            {errorMessage}
            <br></br>
            <Button onClick={() => getData()}>Try Again</Button>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-red-800 text-white">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RecordCard({
  record,
}: {
  record: Prisma.StudentsOnExerciseGetPayload<{
    include: {
      student: {
        include: {
          images: {
            take: 1;
          };
          submissions: {
            include: {
              assessmentScore: true;
            };
          };
        };
      };
      exercise: true;
    };
  }>;
}) {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(record.student.submissions[0]?.assessmentScore?.score.toString()??"");
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);
  const handleSave = async () => {
    const sc = parseFloat(score);
    if (isNaN(sc)) {
      toast({
        title: "Error",
        description: "Invalid number",
        variant: "destructive",
      });
      return;
    }
    if (sc > record.exercise.totalScore) {
      toast({
        title: "Range Error",
        description: `Score can't be greater than ${record.exercise.totalScore}`,
        variant: "destructive",
      });
      return;
    }
    if (sc < 0) {
      toast({
        title: "Range Error",
        description: `Score can't be less than 0`,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const res = await RecordExercise({
      exerciseId: record.exerciseId,
      score: sc,
      soeId: "",
      studentId: record.studentId,
    });
    setLoading(false);
    if (res.error) {
      toast({
        title: "Error",
        description: res.errorMessage,
        variant: "destructive",
      });
      setFailed(true);
      setSent(false);
      return;
    }
    toast({
      title: "Done",
      description: "Recorded",
      variant: "default",
    });
    setFailed(false);
    setSent(true);
  };
  return (
    <div className=" p-4 rounded-sm border w-full flex flex-col hover:border-2 hover:border-blue-100 cursor-pointer">
      <div className="flex flex-row items-center gap-x-3">
        <Avatar className="w-[70px] h-[70px] cursor-pointer dark:text-white text-black font-normal text-3xl">
          <AvatarImage
            src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${record.student.images[0]?.id}`}
            alt="profile"
          />
          <AvatarFallback>{record.student.userId}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col capitalize flex-1 gap-1">
          <div>
            {record.student.firstName} {record.student.lastName}
          </div>
          <div>{record.student.emailAddress}</div>
          <div className="flex items-center flex-row p-2 gap-2 pl-0">
            <Input
              disabled={loading}
              className=" h-[40px]"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder={`Score / ${record.exercise.totalScore}`}
              type="number"
            ></Input>
            {loading ? (
              <IoReload size={25} className="animate-spin"></IoReload>
            ) : (
              <Button className="flex flex-row items-center gap-x-1" onClick={handleSave}>{!sent?"Save":"Update"} {sent&& <IoCloudDone></IoCloudDone> }</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExerciseUI;
