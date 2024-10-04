import prisma from "@/prisma/db";
import { ResolvingMetadata } from "next";
import React from "react";
import UI from "./ui";
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
async function Page(
    { params }: { params: { id: string } }
) {
  const subject = await prisma.subject.findFirst({
    where:{
      id:params.id
    },
    include:{
      class:true
    }
  });
  console.log(subject)
  if(!subject) throw Error("Subject Not Found")
  const topics = await prisma.topic.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where:{
        subjectId:params.id
    },
    include:{
      notes:true,
      exercises:true,
      assignment:true,
      projectworks:true,
      term:true,
    }
  })
  return  <UI subject={subject} t={topics}></UI>;
}

export default Page;
