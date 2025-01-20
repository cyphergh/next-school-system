"use client";
import { EditStudentInfo } from "@/actions/student/edit_info";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { StudentInfoData } from "@/types";
import { Class, Prisma } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import { IoArrowDownCircle } from "react-icons/io5";
import { PiPencil } from "react-icons/pi";
import { InfinitySpin } from "react-loader-spinner";

function UI({
  student,
  stages,
}: {
  student: StudentInfoData;
  stages: Class[];
}) {
  const [data, setData] = useState<StudentInfoData>(student);
  const [show, setShow] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [change, setChange] = useState("");
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<{ option: string; value: string }[]>(
    []
  );
  const [optionSelected, setOptionSelected] = useState<string>("");
  const [loading,setLoading] = useState(false);
  const showTextChange = (change: string, value: string) => {
    setChange(change);
    setValue(value);
    setShow(true);
  };
  const showOptionsSwitch = ({
    options,
    value,
    change,
  }: {
    options: { option: string; value: string }[];
    value: string;
    change: string;
  }) => {
    setValue(value);
    setOptions(options);
    setChange(change);
    setShowOption(true);
  };

  const handleChange = async() =>{
    setLoading(true);
    try {
      const res = await EditStudentInfo({
        studentId:data.id,
        change,
        value
      })
      setLoading(false)
      if(res.error) return toast({
        title:"Error",
        description:res.errorMessage,
        variant:'destructive',
      })
      toast({
        title:"Done",
        description:'Changes made',
        variant:'default',
      });
      setChange("");
      setValue("");
      if(res.data) setData(res.data);
      setShow(false);
      setShowOption(false);
    } catch (error:any) {
      toast({
        title:"Error",
        description:error.message,
        variant:'destructive',
      })
      setLoading(false);
    }
  }
  return (
    <>
     <AlertDialog open={loading} onOpenChange={setLoading}>
      <AlertDialogContent className="flex flex-col justify-center items-center w-full">
        <InfinitySpin></InfinitySpin>
        <p>Please wait...</p>
      </AlertDialogContent>
     </AlertDialog>
      <div className="flex flex-1 flex-col overflow-y-scroll items-center ">
        <Card className="w-full p-3 shadow-md border-none">
          <div className="flex flex-col md:flex-row w-full gap-x-3 items-center">
            <Avatar className="w-[120px] h-[120px] cursor-pointer dark:text-white text-black font-normal text-3xl">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${data?.images[0]?.id}`}
                alt="profile"
              />
              <AvatarFallback>
                {data.firstName[0]} {data.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center md:items-start flex-1 ">
              <div className="flex flex-row p-3 pb-0 pl-0 text-lg capitalize font-bold text-blue-800">
                {process.env.NEXT_PUBLIC_SCHOOL_SHORT}
                {data.userId}
              </div>
              <div className=" flex flex-row capitalize text-lg font-bold items-center gap-x-2">
                {data.firstName} {data.lastName}
                <PiPencil
                  onClick={() =>
                    showTextChange("name", data.firstName + " " + data.lastName)
                  }
                  size={21}
                  className="cursor-pointer"
                ></PiPencil>
              </div>
            </div>
            <div className="text-red-700 font-bold text-xl flex flex-col items-center">
              <div className="text-blue-600 font-normal">Student Balance</div>
              &#8373;{data.balance.toFixed(2)}
            </div>
          </div>
        </Card>

        <div className="p-3 w-full flex flex-row flex-wrap content-start gap-3">
          {/* /////////////////////////////// */}
          <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
            <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
              <div className="flex flex-row justify-between w-full">
                <div>Status</div>
                <div className="font-bold flex gap-x-3 items-center">
                  {data.type}{" "}
                  <FaPen
                    onClick={() =>
                      showOptionsSwitch({
                        options: [
                          {
                            option: "DAY",
                            value: "DAY",
                          },
                          {
                            option: "BOARDER",
                            value: "BOARDER",
                          },
                        ],
                        change: "status",
                        value: data.type,
                      })
                    }
                  >
                    Change
                  </FaPen>
                </div>
              </div>
            </div>
          </div>
          {/* ///////////////////////////////////// */}
          <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
            <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
              <div className="flex flex-row justify-between w-full">
                <div>Gender</div>
                <div className="font-bold flex gap-x-3 items-center">
                  {data.gender}{" "}
                  <FaPen
                    onClick={() =>
                      showOptionsSwitch({
                        options: [
                          {
                            option: "MALE",
                            value: "MALE",
                          },
                          {
                            option: "FEMALE",
                            value: "FEMALE",
                          },
                        ],
                        change: "gender",
                        value: data.gender,
                      })
                    }
                  >
                    Change
                  </FaPen>
                </div>
              </div>
            </div>
          </div>
          {/* ///////////////////////////////////// */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Class</div>
                  <div className="font-bold flex gap-x-3 items-center">
                    {data.class.className}{" "}
                    <FaPen
                      onClick={() =>
                        showOptionsSwitch({
                          options: [
                            ...stages.map((e) => {
                              return {
                                option: e.className,
                                value: e.id,
                              };
                            }),
                          ],
                          change: "classId",
                          value: data.class.id,
                        })
                      }
                    >
                      Change
                    </FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/* ///////////////////////////////////// */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Location</div>
                  <div className="font-bold flex gap-x-3 items-center">
                    {data.address}{" "}
                    <FaPen
                      onClick={() => showTextChange("address", data.address)}
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/* ///////////////////////////////////// */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Email</div>
                  <div className="font-bold flex gap-x-3 items-center lowercase">
                    {data.emailAddress}{" "}
                    <FaPen
                      onClick={() =>
                        showTextChange("emailAddress", data.emailAddress)
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Phone</div>
                  <div className="font-bold flex gap-x-3 items-center lowercase">
                    {data.phoneNumber}{" "}
                    <FaPen
                      onClick={() =>
                        showTextChange("phoneNumber", data.phoneNumber ?? "")
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Birthday dd/mm/yyyy</div>
                  <div className="font-bold flex gap-x-3 items-center lowercase">
                    {data.dateOfBirth.toLocaleDateString("en-GB")}{" "}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "dateOfBirth",
                          data.dateOfBirth.toLocaleDateString("en-GB") ?? ""
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          <hr className="w-full"></hr>
          <div className="w-full text-center">Guardian Information</div>
          <hr className="w-full"></hr>
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Name</div>
                  <div className="font-bold flex gap-x-3 items-center capitalize">
                    {data.guardianName}{" "}
                    <FaPen
                      onClick={() =>
                        showTextChange("guardianName", data.guardianName)
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Phone</div>
                  <div className="font-bold flex gap-x-3 items-center capitalize">
                    {data.guardianPhone}{" "}
                    <FaPen
                      onClick={() =>
                        showTextChange("guardianPhone", data.guardianPhone)
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Email</div>
                  <div className="font-bold flex gap-x-3 items-center lowercase">
                    {data.guardianEmail}{" "}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "guardianEmail",
                          data.guardianEmail ?? ""
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          <hr className="w-full"></hr>
          <div className="w-full text-center">Mother&apos;s Information</div>
          <hr className="w-full"></hr>
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Name</div>
                  <div className="font-bold flex gap-x-3 items-center capitalize">
                    {data.mother.firstName + " " + data.mother.lastName}{" "}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "mothersName",
                          data.mother.firstName + " " + data.mother.lastName
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Phone</div>
                  <div className="font-bold flex gap-x-3 items-center capitalize">
                    {data.mother.phoneNumber}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "mothersPhoneNumber",
                          data.mother.phoneNumber
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Email</div>
                  <div className="font-bold flex gap-x-3 items-center lowercase">
                    {data.mother.emailAddress}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "mothersEmail",
                          data.mother.emailAddress ?? ""
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }

          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Location</div>
                  <div className="font-bold flex gap-x-3 items-center lowercase">
                    {data.mother.address}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "mothersAddress",
                          data.mother.address ?? ""
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Birthday</div>
                  <div className="font-bold flex gap-x-3 items-center lowercase">
                    {data.mother.dateOfBirth.toLocaleDateString("en-GB")}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "mothersDateOfBirth",
                          data.mother.dateOfBirth.toLocaleDateString("en-GB")
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          <hr className="w-full"></hr>
          <div className="w-full text-center">Father&apos;s Information</div>
          <hr className="w-full"></hr>
          {/*  */}
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Name</div>
                  <div className="font-bold flex gap-x-3 items-center capitalize">
                    {data.father.firstName + " " + data.father.lastName}{" "}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "fathersName",
                          data.father.firstName + " " + data.father.lastName
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Phone</div>
                  <div className="font-bold flex gap-x-3 items-center capitalize">
                    {data.father.phoneNumber}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "fathersPhoneNumber",
                          data.father.phoneNumber
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Email</div>
                  <div className="font-bold flex gap-x-3 items-center lowercase">
                    {data.father.emailAddress}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "fathersEmail",
                          data.father.emailAddress ?? ""
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Location</div>
                  <div className="font-bold flex gap-x-3 items-center lowercase">
                    {data.father.address}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "fathersAddress",
                          data.father.address ?? ""
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          {/*  */}
          {
            <div className=" p-2 border w-full md:w-[400px] rounded-md  flex flex-col items-end">
              <div className="w-full flex flex-col items-end  p-2 pl-0 capitalize  gap-1">
                <div className="flex flex-row justify-between w-full">
                  <div>Birthday</div>
                  <div className="font-bold flex gap-x-3 items-center lowercase">
                    {data.father.dateOfBirth.toLocaleDateString("en-GB")}
                    <FaPen
                      onClick={() =>
                        showTextChange(
                          "fathersDateOfBirth",
                          data.father.dateOfBirth.toLocaleDateString("en-GB")
                        )
                      }
                    ></FaPen>
                  </div>
                </div>
              </div>
            </div>
          }
          {/*  */}
          <hr className="w-full"></hr>
          <div className="w-full text-center">Recent Transactions</div>
          <hr className="w-full"></hr>
          {data.transactions.map((transaction) => {
            return (
              <div
               key={transaction.id}
                className="border p-3 w-full md:w-[400px] rounded-md flex flex-col "
              >
                <div className="flex flex-col gap-2 w-full">
                  <div className="font-bold">
                    {" "}
                    {transaction.transactionType}
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>Date</div>
                    <div>{transaction.createdAt.toLocaleDateString("en-GB")}</div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>Time </div>
                    <div>{transaction.createdAt.toLocaleTimeString("en-US")}</div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>Status</div>
                    <div>{transaction.status}</div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>Amount</div>
                    <div>&#8373;{transaction.amount.toFixed(2)}</div>
                  </div>
                  <div className="w-full flex justify-end">
                  <Link href={"./../../finance/my-transactions/"+transaction.id}>
                    <Button>View Details</Button>
                  </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">Change {change}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder={`Change ${change}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></Input>
          <DialogFooter>
            <Button onClick={handleChange}>Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showOption} onOpenChange={setShowOption}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">Change {change}</DialogTitle>
          </DialogHeader>
          <Select onValueChange={setValue} value={value}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((e) => {
                  return (
                    <SelectItem
                      key={e.value}
                      value={e.value}
                      className="capitalize"
                    >
                      {e.option}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleChange}>Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UI;
