"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { ClassWithInfo, FullClassInfo, StaffWithImageOnly } from "@/types";
import { IoCloseCircle } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InfinitySpin } from "react-loader-spinner";
import { FaSync } from "react-icons/fa";
import { GetClassFullInfo } from "@/actions/academics/class/get-class-full-info";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  changeSubjectTeacher,
  CreateSubject,
} from "@/actions/academics/subjects/create";
import { Prisma } from "@prisma/client";
import { ChangeFormMaster, SwapFormMaster } from "@/actions/academics/class/edit-form-master";
import { Checkbox } from "@/components/ui/checkbox";
function EditClass({
  isShow,
  setIsShow,
  stage,
}: {
  isShow: boolean;
  setIsShow: React.Dispatch<SetStateAction<boolean>>;
  stage: ClassWithInfo;
}) {
  const [showNewSubject, setShowNewSubject] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isCore,setIsCore] = useState<boolean>(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectMaster, setSubjectMaster] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, changeData] = useState<FullClassInfo>();
  const [teachers, setTeachers] = useState<StaffWithImageOnly[]>([]);
  const { toast } = useToast();
  const createSubject = async () => {
    if (!subjectName || !subjectMaster || !data) {
      return toast({
        title: "Error",
        variant: "destructive",
        description: "Subject and teacher required",
        action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
      });
    }
    setCreating(true);
    try {
      const res = await CreateSubject({
        staff: subjectMaster,
        stageId: data.id,
        subject: subjectName,
        isCore
      });
      setCreating(false);
      if (res.error) {
        return toast({
          title: "Error",
          variant: "destructive",
          description: res.errorMessage,
          action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
        });
      }
      changeData(res.class);
      setTeachers(res.teachers!);
      setShowNewSubject(false);
    } catch (error) {
      setCreating(false);
      toast({
        title: "!Oops",
        variant: "destructive",
        description: "Connection failed",
        action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
      });
    }
  };
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await getData();
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };
  const getData = async () => {
    try {
      setLoadingData(true);
      const data = await GetClassFullInfo(stage.id);
      setLoadingData(false);
      setError(data.error);
      setErrorMessage(data.errorMessage);
      if (error) return;
      changeData(data.class);
      setTeachers(data.teachers!);
    } catch (error) {
      setLoadingData(false);
      throw new Error("Connection Failed");
    }
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow]);
  return (
    <>
      <AlertDialog defaultOpen={isShow} open={isShow}>
        <AlertDialogContent className="w-full h-full sm:w-[80%] sm:min-w-[80%] sm:h-[90%] flex flex-col  overflow-hidden ">
          <div className="w-full h-12 ">
            <Card className="flex flex-row p-2 w-full items-center pl-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-full w-10 h-10 transition-colors duration-300
                 bg-gray-200 text-gray-700 hover:bg-gray-300
                 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
                 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center mr-5"
              >
                <FaSync
                  className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
              <div className="capitalize flex-1 font-bold">
                Edit {data?.className}
              </div>

              <IoCloseCircle
                className="cursor-pointer hover:text-red-500"
                onClick={() => setIsShow(false)}
                size={35}
              ></IoCloseCircle>
            </Card>
          </div>
          {loadingData ? (
            <div className="flex flex-1 h-full justify-center items-center">
              <InfinitySpin></InfinitySpin>
            </div>
          ) : error ? (
            <div className="flex flex-1 h-full justify-center items-center flex-col gap-5">
              <h1 className="text-lg">{errorMessage}</h1>
              <Button onClick={getData}>Try Again</Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-scroll flex p-2 h-auto sm:flex-row flex-col">
              <div className="w-full sm:flex-1 sm:border-r-2">
                <FormMasterCard 
                  refresh={handleRefresh}
                  data={data!}
                  teachers={teachers}
                ></FormMasterCard>
                <hr className="w-full"></hr>
                {!data?.students.length ? (
                  <div className="w-full p-6 text-center text-xl">
                    There is no student in this class
                  </div>
                ) : !data?.classPrefect ? (
                  <div className="w-full"></div>
                ) : (
                  <div className="flex flex-col w-full items-center sm:items-start sm:flex-row ">
                    <Avatar className="w-[180px] h-[180px] sm:w-[140px] sm:h-[140px]">
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${data?.classPrefect?.images[0]?.id}`}
                        alt="profile"
                      />
                      <AvatarFallback>
                        {data?.classPrefect?.firstName[0]}
                        {data?.classPrefect?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="p-4 flex flex-col gap-2">
                      <div className="font-bold">Class Prefect</div>
                      <div className="capitalize">
                        {data?.classPrefect?.firstName}{" "}
                        {data?.classPrefect?.lastName}
                      </div>
                      <div className="lowercase">
                        {data?.classPrefect?.emailAddress}
                      </div>

                      <Button size={"sm"} className="m-0">
                        {data?.classPrefect ? "Change" : "Select"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="sm:flex-1 flex flex-col p-2 shrink-0">
                <div className="w-full font-bold font-mono text-center p-2 border-b-2 flex justify-around">
                  Subjects And Teachers{" "}
                  <Button onClick={() => setShowNewSubject(true)}>
                    Create
                  </Button>
                </div>
                <div className="w-full p-4 gap-y-2 flex flex-col sm:flex-1 sm:overflow-y-scroll">
                  {data?.subjects.length ? (
                    <>
                      {data?.subjects.map((e) => {
                        return (
                          <SubjectCard
                            refresh={handleRefresh}
                            e={e}
                            cls={{ classId: data.id, name: data.className }}
                            teachers={teachers}
                            key={e.id + "class-card-edit-class"}
                          ></SubjectCard>
                        );
                      })}
                    </>
                  ) : (
                    <div className="w-full text-xl text-center p-4">
                      No Registered Subject
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>

      {/* 

      New subject
      
    */}
      <AlertDialog open={showNewSubject} defaultOpen={showNewSubject}>
        <AlertDialogContent className="flex flex-col gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Subject</AlertDialogTitle>
            <AlertDialogDescription>
              <input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-400"
                placeholder="Name of subject"
              />
               <div className="flex gap-x-3 p-3">
                    <b>Core Subject</b>
                    <Checkbox checked={isCore} onCheckedChange={(e)=>setIsCore(e as boolean)} className="w-[20px] h-[20px] rounded-full">
                    </Checkbox>
                  </div>
              <label className="m-3 block w-full">Select form master</label>
              <div className="w-full flex flex-row">
                <Select
                  disabled={creating}
                  onValueChange={(e: string) => setSubjectMaster(e)}
                >
                  <SelectTrigger className="w-full h-[50px]">
                    <SelectValue placeholder="Select form master" />
                  </SelectTrigger>
                 
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Subject Teacher</SelectLabel>
                      {teachers.map((e) => {
                        return (
                          <SelectItem value={e.id} key={e.id}>
                            <div className="flex p-2 gap-x-4 text-lg items-center">
                              <Avatar className="w-[40px] h-[40px] cursor-pointer">
                                <AvatarImage
                                  src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${e.images[0]?.id}`}
                                  alt="profile"
                                />
                                <AvatarFallback>
                                  {e.firstName[0]}
                                  {e.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="capitalize">
                                {e.firstName} {e.lastName}
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              disabled={creating}
              onClick={() => setShowNewSubject(false)}
              className="text-red-400 bg-transparent sm:mr-4"
            >
              Close
            </AlertDialogAction>
            <AlertDialogAction disabled={creating} onClick={createSubject}>
              Create Subject{" "}
              {creating && <FaSync className="animate-spin ml-2"></FaSync>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default EditClass;

function FormMasterCard({
  data,
  teachers,
  refresh,
}: {
  data: ClassWithInfo;
  teachers: StaffWithImageOnly[];
  refresh: () => void;
}) {
  const [changing, setChanging] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [show, setShow] = useState(false);
  const [showSwap, setShowSwap] = useState(false);
  const { toast } = useToast();
  const handleChange = async (id: string) => {
    setChanging(true);
    try {
      const res = await ChangeFormMaster({
        classId: data.id,
        newFormMaster: id,
        formMaster: data.formMaster!.id,
      });
      setChanging(false);
      if (res.error)
        return toast({
          title: res.errorMessage,
          variant: "destructive",
          description: res.errorMessage,
          action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
        });
       refresh();
    } catch (error) {
      setChanging(false);
      toast({
        title: "Error",
        description: "Connection Failed",
        variant: "destructive",
        action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
      })
    }

  };
  const handleSwap = async (id: string) => {
    setSwapping(true);
    try {
      const res = await SwapFormMaster({
        classId: data.id,
        newFormMaster: id,
        formMaster: data.formMaster!.id,
      });
      setSwapping(false);
      if (res.error)
        return toast({
          title: res.errorMessage,
          variant: "destructive",
          description: res.errorMessage,
          action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
        });
       refresh();
    } catch (error) {
      setSwapping(false);
      toast({
        title: "Error",
        description: "Connection Failed",
        variant: "destructive",
        action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
      })
    }

  };
  return (
    <>
      {" "}
      <div className="flex flex-col w-full  sm:items-start sm:flex-row ">
        <Avatar className="w-[180px] h-[180px] sm:w-[140px] sm:h-[140px]">
          <AvatarImage
            src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${data?.formMaster?.images[0]?.id}`}
            alt="profile"
          />
          <AvatarFallback>
            {data?.formMaster?.firstName[0]}
            {data?.formMaster?.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="p-4 flex flex-col gap-2">
          <div className="font-bold">Form master</div>
          <div className="capitalize">
            {data?.formMaster?.firstName} {data?.formMaster?.lastName}
          </div>
          <div className="lowercase">{data?.formMaster?.emailAddress}</div>
          <div>
            <a
              href={`tel:${data?.formMaster?.phoneNumber}`}
              className="text-blue-700"
            >
              {data?.formMaster?.phoneNumber}
            </a>
          </div>
          <div className="flex flex-row w-full justify-around gap-x-2">
            <AlertDialog open={showSwap} onOpenChange={setShowSwap}>
              <AlertDialogTrigger>
                <Button size={"sm"}>Swap master</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="flex flex-col h-[80%]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="capitalize">
                    Swap form masters
                  </AlertDialogTitle>
                </AlertDialogHeader>
                {!swapping ? (
                  <div className="flex flex-col flex-1 overflow-y-scroll gap-4">
                    {teachers
                      .filter(
                        (e) => e.formMasterId && e.formMasterId !== data.id
                      )
                      .map((e) => {
                        return (
                          <div
                            onClick={() => handleSwap(e.id)}
                            key={"staff-to-choose" + e.id}
                            className="p-2 border rounded-lg cursor-pointer"
                          >
                            <div className="flex p-2 gap-x-4 text-lg items-center">
                              <Avatar className="w-[40px] h-[40px] cursor-pointer">
                                <AvatarImage
                                  src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${e.images[0]?.id}`}
                                  alt="profile"
                                />
                                <AvatarFallback>
                                  {e.firstName[0]}
                                  {e.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="capitalize">
                                {e.firstName} {e.lastName}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {!teachers.filter( 
                      (e) => e.formMasterId && e.formMasterId !== data.id
                    ).length ? (
                      <div className="p-4 w-full text-xl text-center">
                        No master available to swap
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex-1 justify-center items-center flex flex-col">
                    <InfinitySpin color="blue"></InfinitySpin>
                  </div>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={swapping}>
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/* 
            
            */}
            <AlertDialog open={show} onOpenChange={setShow}>
              <AlertDialogTrigger>
                <Button size={"sm"}>Change</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="flex flex-col h-[80%]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="capitalize">
                    Select new form master
                  </AlertDialogTitle>
                </AlertDialogHeader>
                {!changing ? (
                  <div className="flex flex-col flex-1 overflow-y-scroll gap-4">
                    {teachers
                      .filter((e) => !e.formMasterId)
                      .map((e) => {
                        return (
                          <div
                            onClick={() => handleChange(e.id)}
                            key={"staff-to-choose" + e.id}
                            className="p-2 border rounded-lg cursor-pointer"
                          >
                            <div className="flex p-2 gap-x-4 text-lg items-center">
                              <Avatar className="w-[40px] h-[40px] cursor-pointer">
                                <AvatarImage
                                  src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${e.images[0]?.id}`}
                                  alt="profile"
                                />
                                <AvatarFallback>
                                  {e.firstName[0]}
                                  {e.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="capitalize">
                                {e.firstName} {e.lastName}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="w-full flex-1 justify-center items-center flex flex-col">
                    <InfinitySpin color="blue"></InfinitySpin>
                  </div>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={changing}>
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </>
  );
}

function SubjectCard({
  e,
  cls,
  teachers,
  refresh,
}: {
  e: Prisma.SubjectGetPayload<{
    include: {
      staff: {
        include: {
          images: {
            take: 1;
          };
        };
      };
    };
  }>;
  cls: {
    classId: string;
    name: string;
  };
  teachers: StaffWithImageOnly[];
  refresh: () => void;
}) {
  const [changing, setChanging] = useState(false);
  const [show, setShow] = useState(false);
  const { toast } = useToast();
  const handleChange = async (staffId: string) => {
    setChanging(true);
    const res = await changeSubjectTeacher({
      classId: cls.classId,
      subjectId: e.id,
      staff: staffId,
    });
    setChanging(false);
    if (res.error)
      return toast({
        title: "!Oops",
        variant: "destructive",
        description: res.errorMessage,
        action: <ToastAction altText={"!Oops"}>Ok</ToastAction>,
      });
    refresh();
  };
  return (
    <div className="w-full" key={e.id}>
      <Card className="p-4 w-full">
        <div className="capitalize text-xl font-bold font-mono">{e.name}</div>
        <div className="flex flex-col text-muted-foreground">
          <div>Teacher</div>
          <div className="flex flex-row p-2 gap-x-3 items-center">
            <Avatar className="w-[50px] h-[50px] sm:w-[50px] sm:h-[50px]">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${e.staff.images[0]?.id}`}
                alt="profile"
              />
              <AvatarFallback>
                {e.staff.firstName[0]}
                {e.staff.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div>
                {e.staff.firstName} {e.staff.lastName}
              </div>
              <div>{e.staff.emailAddress}</div>
              <div className="m-2">
                <AlertDialog open={show} onOpenChange={setShow}>
                  <AlertDialogTrigger>
                    <Button size={"sm"}>Change Teacher</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="flex flex-col h-[80%]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="capitalize">
                        Select New Teacher For {cls.name} {e.name}{" "}
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    {!changing ? (
                      <div className="flex flex-col flex-1 overflow-y-scroll gap-4">
                        {teachers.map((e) => {
                          return (
                            <div
                              onClick={() => handleChange(e.id)}
                              key={"staff-to-choose" + e.id}
                              className="p-2 border rounded-lg cursor-pointer"
                            >
                              <div className="flex p-2 gap-x-4 text-lg items-center">
                                <Avatar className="w-[40px] h-[40px] cursor-pointer">
                                  <AvatarImage
                                    src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${e.images[0]?.id}`}
                                    alt="profile"
                                  />
                                  <AvatarFallback>
                                    {e.firstName[0]}
                                    {e.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="capitalize">
                                  {e.firstName} {e.lastName}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="w-full flex-1 justify-center items-center flex flex-col">
                        <InfinitySpin color="blue"></InfinitySpin>
                      </div>
                    )}
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={changing}>
                        Cancel
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
