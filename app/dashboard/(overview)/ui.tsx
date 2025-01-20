"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Prisma, Subject, Transaction } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { FaBook } from "react-icons/fa";

function UI({
  subjects,
  transactions,
}: {
  transactions:Transaction[],
  subjects: Prisma.SubjectGetPayload<{
    include: {
      class: true;
      notes: true;
      exercises: true;
      assignment: true;
      topics: true;
    };
  }>[];
}) {
  const [searchForSubject, setSearchForSubject] = useState("");
  return (
    <>
      <div className="p-4 flex-1 overflow-y-scroll">
        <Card className="p-4 flex flex-col md:flex-row gap-2">
          <div className="font-bold text-indigo-600">Quick Links</div>
          <div className="ml-8">
            <Link href={"dashboard/academics/class"}>My Subjects</Link>
          </div>
          <div className="ml-8">
            <Link href={"dashboard/finance/my-transactions"}>
              My Transactions
            </Link>
          </div>
          <div className="ml-8">
            <Link href={"dashboard/academics/exams"}>Exams</Link>
          </div>
          <div className="ml-8">
            <Link href={"dashboard/student/enrollment"}>Students</Link>
          </div>
        </Card>
        {subjects.length > 0 && (
          <div className="w-full flex flex-row flex-wrap p-3 gap-3">
            <div className="p-5  w-full flex gap-x-3 items-center">
              <div className="font-bold text-xl">My Subjects Statistics</div>
              <Input
                value={searchForSubject}
                onChange={(e) => setSearchForSubject(e.target.value)}
                className="w-auto"
                placeholder="Search for subject"
              ></Input>
            </div>
            {subjects
              .filter((e) =>
                (e.name + " "+e.class.className).toLowerCase().includes(searchForSubject.toLowerCase())
              )
              .map((subject) => {
                return (
                  <div
                    key={subject.id}
                    className="flex flex-col w-full md:w-[250px] rounded-sm border hover:border-blue-500 p-4 gap-2"
                  >
                    <div className="  flex items-center gap-x-3 w-full">
                      <div>
                        <FaBook size={40} color="yellow"></FaBook>
                      </div>
                      <div className="capitalize">{subject.name}</div>
                    </div>
                    <hr></hr>
                    <div className="font-bold w-full p-2 border">
                      {subject.class.className}
                    </div>
                    <div className="w-full p-2 border flex flex-row justify-between">
                      <div>Topics</div>
                      <div>{subject.topics.length}</div>
                    </div>
                    <div className="w-full p-2 border flex flex-row justify-between">
                      <div>E-Notes</div>
                      <div>{subject.notes.length}</div>
                    </div>
                    <div className="w-full p-2 border flex flex-row justify-between">
                      <div>Exercise</div>
                      <div>{subject.exercises.length}</div>
                    </div>
                    <div className="w-full p-2 border flex flex-row justify-between">
                      <div>Assignment</div>
                      <div>{subject.assignment.length}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        <div className="w-full flex flex-row flex-wrap p-3 gap-3">
          <div className="p-5 font-bold text-xl w-full">
            Recent Transactions
          </div>
          {
            transactions.map((ts)=>{
                return <div key={ts.id} className="border p-3 w-full flex flex-col md:flex-row rounded-md">
                    <div className="font-bold md:border-r-2 w-[100px]">{ts.transactionType}</div>
                    <div className="md:border-r-2 pr-2  ml-2">{ts.createdAt.toLocaleDateString("en-GB")}</div>
                    <div className="md:border-r-2 pr-2  ml-2">{ts.status}</div>
                    <div className="md:border-r-2 md:pr-2  ml-2 md:w-[100px] md:text-end md:flex md:justify-end font-bold">&#8373; {ts.amount}</div>
                    <div className="md:border-r-2 pr-2  ml-2">{ts.id}</div>
                    <div className="md:flex md:justify-end md:flex-1">
                    <Link href={"#"} className=""><Button>View Details</Button></Link>
                    </div>
                </div>
            })
          }
        </div>
      </div>
    </>
  );
}

export default UI;
