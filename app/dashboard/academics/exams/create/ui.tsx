"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InfinitySpin } from "react-loader-spinner";
import { useToast } from "@/components/ui/use-toast";
import { CreateExam } from "@/actions/academics/exam/new_exam";
import { Prisma } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
function CreateExamPage({
  stages,
}: {
  stages: Prisma.ClassGetPayload<{
    include: {
      subjects: {
        include: {
          staff: true;
        };
      };
    };
  }>[];
}) {
  const [title, setTitle] = React.useState("");
  const [showPosition, setShowPosition] = React.useState<boolean>(true);
  const [showGrade, setShowGrade] = React.useState<boolean>(true);
  const [classScoreSource, setClassScoreSource] = React.useState<
    "System" | "Manual" | "Full"
  >("System");
  const [classScorePercentage, setScorePercentage] = React.useState(50);
  const [minimumScore, setMinimumScore] = React.useState(0);
  const [dueDate, setDueDate] = React.useState("");
  const [classScore, setClassScore] = React.useState(50);
  const [showLoading, setShowLoading] = React.useState(false);
  const [subjects, setSubjects] = React.useState<string[]>([]);
  const { toast } = useToast();
  const nav = useRouter();
  const createExam = async () => {
    if (!title)
      return toast({
        title: "Error",
        description: "Please enter examination title",
        variant: "destructive",
      });
    if (!dueDate)
      return toast({
        title: "Error",
        description: "Please select due date",
        variant: "destructive",
      });
    if (!subjects.length)
      return toast({
        title: "Error",
        description: "Please select a subject",
        variant: "destructive",
      });
    setShowLoading(true);
    const res = await CreateExam({
      body:{
        title,
        classScorePercent:classScorePercentage,
        classScoreSource:classScoreSource,
        dueDate: new Date(Date.parse(dueDate)),
        minimumScore:minimumScore,
        showGrade:showGrade,
        showPosition:showPosition,
        subjects:subjects
      }
    });
    if(res.error){
      setShowLoading(false);
      return toast({
        title: "Error",
        description: res.errorMessage,
        variant: "destructive",
      });
    }
      nav.push("./");
  };
  return (
    <>
      <div className="flex-1 flex flex-row flex-wrap content-start items-start justify-start gap-2 overflow-y-scroll">
        <div className="p-4 text-center w-full font-bold ">
          Create New Examination
        </div>
        <hr className="w-full"></hr>
        <div className="p-4 flex flex-col gap-2 w-full border rounded-sm  lg:w-[350px]">
          <label htmlFor="title">Title</label>
          <Input
            onChange={(e) => setTitle(e.target.value)}
            name="title"
            id="title"
            className="border-t-0 border-b"
            placeholder="e.g End Semester Examination"
          />
        </div>
        <div className="p-4 flex flex-col gap-2 w-full border rounded-sm  lg:w-[350px]">
          <label htmlFor="">Show Position</label>
          <div className="items-top flex space-x-2">
            <Checkbox
              checked={showPosition}
              id="position"
              onCheckedChange={(e) => setShowPosition(e as unknown as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="position"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Position
              </label>
              <p className="text-sm text-muted-foreground">
                Show student&apos;s rank within the class.
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2 w-full border rounded-sm  lg:w-[350px]">
          <label htmlFor="">Show Grade</label>
          <div className="items-top flex space-x-2">
            <Checkbox
              checked={showGrade}
              onCheckedChange={(e) => setShowGrade(e as unknown as boolean)}
              id="grade"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="grade"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Grade
              </label>
              <p className="text-sm text-muted-foreground">
                Enabling this will display the student&apos;s Grade
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2 w-full border rounded-sm  lg:w-[350px]">
          <label htmlFor="title">Class Score Source</label>
          <Select
            value={classScoreSource}
            onValueChange={(v) =>
              setClassScoreSource(v as "System" | "Manual" | "Full")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Class score" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="Manual">Manual Input</SelectItem>
                <SelectItem value="Full">Full Marks</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="p-4 flex flex-col gap-2 w-full border rounded-sm  lg:w-[350px]">
          <label htmlFor="ces">Class/Exam Percentage</label>
          <Slider
            defaultValue={[classScore]}
            onValueChange={(v) => setClassScore(v[0])}
            max={100}
            step={1}
          />
          <div className="flex flex-row justify-around">
            <div>Class Score {classScore}%</div>
            <div>Exam Score {100 - classScore}%</div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2 w-full border rounded-sm  lg:w-[350px]">
          <label htmlFor="minimumScore">Minimum Exam Score</label>
          <Input
            min={0}
            max={100}
            onChange={(e) => {
              if (Number(e.target.value) > 100) {
                setMinimumScore(100);
              } else {
                if (Number(e.target.value) < 0) {
                  setMinimumScore(0);
                } else {
                  setMinimumScore(parseFloat(e.target.value));
                }
              }
            }}
            value={minimumScore}
            name="minimumScore"
            id="minimumScore"
            type="number"
            className="border-t-0 border-b"
            placeholder="Minimum score"
          />
        </div>
        <div className="p-4 flex flex-col gap-2 w-full border rounded-sm  lg:w-[350px]">
          <label htmlFor="dueDate">Score submission due date</label>
          <Input
           onChange={(e)=>setDueDate(e.target.value)}
            name="dueDate"
            id="dueDate"
            type="date"
            className="border-t-0 border-b"
            placeholder="Submission Due Date"
          />
        </div>
        <hr className="w-full"></hr>
        <p className="text-center w-full  text-xl font-bold ">
          Classes & Subjects
        </p>
        <hr className="w-full"></hr>
        {stages.map((e) => {
          return (
            <div
              key={e.id}
              className="p-4 flex flex-col gap-2 w-full border rounded-sm  lg:w-[350px]"
            >
              <div className="capitalize font-bold flex flex-row justify-between">
                <div>{e.className}</div>
                <Button
                  onClick={() => {
                    let p: string[] = [...subjects];
                    e.subjects.map((subject) => {
                      if (subjects.includes(subject.id)) {
                        p = p.filter((r) => r != subject.id);
                        return;
                      }
                      p.push(subject.id);
                    });
                    setSubjects(p);
                  }}
                >
                  Toggle
                </Button>
              </div>
              {e.subjects.map((subject) => {
                return (
                  <div key={subject.id} className="items-top flex space-x-2">
                    <Checkbox
                      checked={subjects.includes(subject.id)}
                      onCheckedChange={(e) => {
                        if (subjects.includes(subject.id)) {
                          setSubjects(subjects.filter((e) => e != subject.id));
                          return;
                        }
                        setSubjects([...subjects, subject.id]);
                      }}
                      id={subject.id}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={subject.id}
                        className="capitalize text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {subject.name}
                      </label>
                      <p className="text-sm text-muted-foreground capitalize">
                        {subject.staff.firstName} {subject.staff.lastName}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* !: #Loader ///// */}
        <div className="flex items-center justify-start p-2 w-full">
          <Button onClick={createExam}>Create</Button>
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

export default CreateExamPage;
