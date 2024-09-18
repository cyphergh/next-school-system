import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StInfo } from "@/types";
import React from "react";
import { IoPrintOutline } from "react-icons/io5";
import { TbMessageCircle } from "react-icons/tb";

function InfoTab({ student }: { student: StInfo }) {
  return (
    <>
      <div className="gap-x-4 w-full sm:w-full  flex flex-col sm:flex-row p-2 sm:p-2 lg:flex-row gap-4 items-center sm:items-start sm:justify-start sm:flex-wrap lg:flex-wrap content-start">
        <div>
          <Avatar className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] cursor-pointer dark:text-white text-black font-normal text-3xl">
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${student?.images[0]?.id}`}
              alt="profile"
            />
            <AvatarFallback>
              {student.firstName[0]}
              {student.lastName[0]}
            </AvatarFallback>
          </Avatar>
          {/* <div className=" flex gap-x-2 justify-center p-3">
            <IoPrintOutline title="Print ID" className="cursor-pointer" size={40}></IoPrintOutline>
            <TbMessageCircle size={40} className="cursor-pointer"></TbMessageCircle>
          </div> */}
        </div>
        <div className="flex flex-col gap-1 w-full max-w-[350px]">
          <div className="capitalize text-center sm:text-start pt-4 pb-4 text-lg font-bold">
            {student.firstName} {student.lastName}
          </div>
          <div className="flex justify-between w-full sm:max-w-[350px] capitalize">
            <div>Class</div>{" "}
            <div className="font-bold">{student.class.className}</div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Gender</div> <div className="font-bold">{student.gender}</div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Student Type</div>{" "}
            <div className="font-bold">{student.type}</div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Email</div>{" "}
            <div className="lowercase select-text">
              <a href={`mailto:${student.emailAddress.toLowerCase()}`}>
                {student.emailAddress}
              </a>
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Phone Number</div>{" "}
            <div className="text-blue-500 font-bold lowercase select-text">
              <a href={`tel:${student.phoneNumber}`}>{student.phoneNumber}</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full max-w-[350px]">
          <div className="capitalize text-center sm:text-start pt-4 pb-4 text-lg font-bold">
            {" "}
          </div>
          <div className="flex justify-between w-full sm:max-w-[350px] capitalize">
            <div>Date of Birth</div>{" "}
            <div className="font-bold">
              {student.dateOfBirth.toLocaleDateString("en-US")}
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>ID</div> <div>{student.id}</div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Enrollment Date</div>{" "}
            <div>{student.enrollmentDate.toLocaleDateString("en-US")}</div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Address</div>{" "}
            <div className="capitalize">{student.address}</div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Completed</div>
            <div>{student.completed.toString()}</div>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full max-w-[350px]">
          <div className="capitalize text-center sm:text-start pt-4 pb-4 text-lg font-bold">
            Guardian
          </div>
          <div className="flex justify-between w-full sm:max-w-[350px] capitalize">
            <div>Name</div>{" "}
            <div className="font-bold capitalize">{student.guardianName}</div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Phone Number</div>{" "}
            <div className="text-blue-300">
              <a href={`tel:${student.guardianPhone}`}>
                {student.guardianPhone}
              </a>
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Email</div>{" "}
            <div className="lowercase">{student.guardianEmail}</div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Address</div>{" "}
            <div className="lowercase select-text">{student.address}</div>
          </div>
        </div>
        {/*  */}
        <div className="flex flex-col gap-1 w-full max-w-[350px]">
          <div className="capitalize text-center sm:text-start pt-4 pb-4 text-lg font-bold">
            Mother
          </div>
          <div className="flex justify-between w-full sm:max-w-[350px] capitalize">
            <div>Name</div>{" "}
            <div className="font-bold capitalize">
              {student.mother.firstName} {student.mother.lastName}
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Phone Number</div>{" "}
            <div className="text-blue-300">
              <a href={`tel:${student.mother.phoneNumber}`}>
                {student.mother.phoneNumber}
              </a>
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Email</div>{" "}
            <div className="lowercase select-text">
              {student.mother.emailAddress}
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Address</div>{" "}
            <div className="lowercase select-text">
              {student.mother.address}
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Date Of Birth</div>{" "}
            <div className="lowercase select-text">
              {student.mother.dateOfBirth.toLocaleDateString("en-US")}
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Occupation</div>{" "}
            <div className="lowercase select-text">
              {student.mother.occupation}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full max-w-[350px]">
          <div className="capitalize text-center sm:text-start pt-4 pb-4 text-lg font-bold">
            Father
          </div>
          <div className="flex justify-between w-full sm:max-w-[350px] capitalize">
            <div>Name</div>{" "}
            <div className="font-bold capitalize">
              {student.father.firstName} {student.father.lastName}
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Phone Number</div>{" "}
            <div className="text-blue-300">
              <a href={`tel:${student.father.phoneNumber}`}>
                {student.father.phoneNumber}
              </a>
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Email</div>{" "}
            <div className="lowercase select-text">
              {student.father.emailAddress}
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Address</div>{" "}
            <div className="lowercase select-text">
              {student.father.address}
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Date Of Birth</div>{" "}
            <div className="lowercase select-text">
              {student.father.dateOfBirth.toLocaleDateString("en-US")}
            </div>
          </div>
          <div className="flex justify-between sm:max-w-[350px] capitalize">
            <div>Occupation</div>{" "}
            <div className="lowercase select-text">
              {student.mother.occupation}
            </div>
          </div>
        </div>
        {/*  */}
      </div>
    </>
  );
}

export default InfoTab;
