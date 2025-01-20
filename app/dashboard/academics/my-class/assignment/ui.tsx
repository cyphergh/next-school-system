"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import NewAssignmentPopup from "./new_popup";
import {
  Assignment,
  Prisma,
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
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaSync, FaSyncAlt } from "react-icons/fa";
import { IoCloudDone, IoReload } from "react-icons/io5";
import { GetTopic, RecordAssignment } from "@/actions/academics/assignment/record_exercise";
import { GetStudentsOnAssignment } from "@/actions/academics/assignment/get_students";

function AssignmentUI({
  topicFromSSR,
}: {
  topicFromSSR: Prisma.TopicGetPayload<{
    include: {
      subject: true;
      assignment: true;
    };
  }>;
}) {
  const [topic, setTopic] = useState<
    Prisma.TopicGetPayload<{
      include: {
        subject: true;
        assignment: true;
      };
    }>
  >(topicFromSSR);
  const [assignments, setAssignments] = useState<Assignment[]>(topic.assignment);
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(false)
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const refresh = async() =>{
   setLoading(true);
    const res = await GetTopic(topic.id);
    if(res.error){
      toast({
        title:"Error",
        description:res.errorMessage,
        variant:"destructive",
      });
      return;
    }
    if(res.topic){
      setTopic(res.topic);
      setAssignments(res.topic.assignment);
    }
   setLoading(false);
  }
  return (
    
    <div className="flex-1 flex flex-col overflow-hidden p-3`">
      <div className="font-bold text-center text-lg capitalize p-4">
        {topic.subject.name} - {topic.title} Assignments
      </div>
      <Card className="items-center gap-x-3 w-full p-4 flex flex-row ">
        <FaSyncAlt size={25} className={`${loading&&"animate-spin"} cursor-pointer`} onClick={refresh}></FaSyncAlt>
        <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search..." className="mr-3"></Input>
        <NewAssignmentPopup
          setAssignments={setAssignments}
          subjectId={topic.subject.id}
          topicId={topic.id}
        />
      </Card>
      <div className=" p-4 flex content-start flex-1 flex-row flex-wrap overflow-y-scroll gap-2">
        {assignments.filter((e)=>(e.title + ""+ e.description).toLowerCase().includes(search.toLocaleLowerCase())).map((assignment) => {
          return (
            <div
              key={assignment.id}
              className="hover:border-4 hover:border-blue-100 cursor-pointer flex flex-col w-full lg:w-[300px] border rounded-sm  p-2 "
            >
              <div className="p-2 font-mono flex flex-row justify-between">
                <div>{assignment.type}</div>
                <div className="flex flex-col">
                  [{assignment.totalScore} Mark{assignment.totalScore > 1 && "s"}]
                  <div className="ml-2 text-red-600 font-bold">
                    {Math.round(
                      (assignment.totalMarked / assignment.totalStudents) * 100
                    )}
                    % {assignment.type == "OFFLINE" ? "Recorded" : "Submitted"}
                  </div>
                </div>
              </div>
              <hr></hr>
              <div className="capitalize font-bold p-3">{assignment.title}</div>
              <div className="font-bold font-mono">
                {days[assignment.createdAt.getDay() - 1]}
              </div>
              <div className="font-bold font-mono">
                {assignment.createdAt.toLocaleDateString("en-GB")}
              </div>
              <div className="font-bold font-mono">
                {assignment.createdAt.toLocaleTimeString("en-US")}
              </div>
              {assignment.type == "ONLINE" && (
                <OnlineAssignmentCard
                  assignment={assignment}
                ></OnlineAssignmentCard>
              )}
              {assignment.type == "OFFLINE" && (
                <div className="flex flex-row justify-end">
                  <RecordAssignmentCard
                    assignment={assignment}
                  ></RecordAssignmentCard>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OnlineAssignmentCard({
  assignment,
}: {
  assignment: Assignment;
}) {
  const [records, setRecords] = useState<
    Prisma.StudentOnAssignmentGetPayload<{
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
        assignment: true;
      };
    }>[]
  >([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const getData = async () => {
    setLoading(true);
    setError(false);
    const res = await GetStudentsOnAssignment(assignment.id);
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
          View Submissions
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col overflow-hidden justify-start items-start h-dvh">
        <AlertDialogHeader className="w-full">
          <AlertDialogTitle className="capitalize">
            {assignment.title}
          </AlertDialogTitle>
          <div className="capitalize">
            {assignment.createdAt.toLocaleString("en-GB")}
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
                  <div
                    key={e.studentId + e.assignmentId}
                    className="border p-4 rounded-sm"
                  >
                    <div className="flex flex-row justify-between items-center">
                      <div>
                        {e.student.firstName} {e.student.lastName}
                      </div>
                      <div>
                        {!e.student.submissions[0]?.assessmentScore?.score && (
                          <div className="cursor-pointer p-2 rounded-full border text-lg font-bold w-10 h-10 text-center hover:text-2xl" title="Pending submission ">P</div>
                        )}
                        {e.student.submissions[0]?.assessmentScore?.score && (
                          <div className="cursor-pointer p-2 rounded-sm border" title="Pending submission ">{e.student.submissions[0]?.assessmentScore?.score} / {e.assignment.totalScore}</div>
                        )}
                      </div>
                    </div>
                  </div>
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
function RecordAssignmentCard({
  assignment,
}: {
  assignment: Assignment;
}) {
  const [records, setRecords] = useState<
    Prisma.StudentOnAssignmentGetPayload<{
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
        assignment: true;
      };
    }>[]
  >([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const getData = async () => {
    setLoading(true);
    setError(false);
    const res = await GetStudentsOnAssignment(assignment.id);
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
            {assignment.title}
          </AlertDialogTitle>
          <div className="capitalize">
            {assignment.createdAt.toLocaleString("en-GB")}
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
                    key={e.studentId + e.assignmentId}
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
  record: Prisma.StudentOnAssignmentGetPayload<{
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
      assignment: true;
    };
  }>;
}) {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(
    record.student.submissions[0]?.assessmentScore?.score.toString() ?? ""
  );
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
    if (sc > record.assignment.totalScore) {
      toast({
        title: "Range Error",
        description: `Score can't be greater than ${record.assignment.totalScore}`,
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
    const res = await RecordAssignment({
      assignmentId: record.assignmentId,
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
              placeholder={`Score / ${record.assignment.totalScore}`}
              type="number"
            ></Input>
            {loading ? (
              <IoReload size={25} className="animate-spin"></IoReload>
            ) : (
              <Button
                className="flex flex-row items-center gap-x-1"
                onClick={handleSave}
              >
                {!sent && !record.student.submissions[0]?.assessmentScore?.score
                  ? "Save"
                  : "Update"}{" "}
                {sent && <IoCloudDone></IoCloudDone>}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentUI;
