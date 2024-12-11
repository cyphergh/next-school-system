"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Examination, Prisma } from "@prisma/client";
import React from "react";
import { IoSync } from "react-icons/io5";
import SubjectCard from "./card";
import { getSubject } from "@/actions/academics/exam/get_subject";

function UI({
  user,
  exam,
}: {
    exam: Examination,
  user: Prisma.UserGetPayload<{
    include: {
      staff: {
        include: {
          subjects: {
            include: {
              examRecords: true;
              exams: true;
              class: {
                include: {
                  students: true;
                };
              };
            };
          };
        };
      };
    };
  }>;
}) {
  const [subjects, setSubjects] = React.useState(user.staff?.subjects ?? []);
  const [search, setSearch] = React.useState("");
  return (
    <div className="flex-1 flex flex-col gap-2 p-4 overflow-hidden">
      <Card className="p-2">
        <div className="w-full flex gap-x-4 items-center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>
      </Card>
      <div className="flex-1 flex flex-row flex-wrap content-start items-start justify-start gap-2 overflow-y-scroll">
        {subjects
          .filter((s) => {
            let v: boolean;
            v = (s.name + " " + s.class.className)
              .toLocaleLowerCase()
              .includes(search.toLowerCase());
            return v;
          })
          .map((subject) => {
            if (subject.exams.length < 1) return <></>;
            return <SubjectCard key={subject.id} exam={exam} sub={subject}></SubjectCard>
          })}
      </div>
    </div>
  );
}

export default UI;
