import React from "react";
import ExerciseUI from "../ui";
import prisma from "@/prisma/db";

type Props = {
  params: { topicId: string };
};
async function Exercise({ params }: { params: { id: string } }) {
  const term = await prisma.term.findFirst({
    where:{
      isActve:true
    }
  });
  if(!term) throw new Error("No active term");
  const topic = await prisma.topic.findUnique({
    where: { id: params.id,termId:term.id },
    include: { subject: true, exercises: {
      orderBy:{
        createdAt:'desc'
      }
    } },
  });
  if (!topic) throw "Topic not found";
  return <ExerciseUI topicFromSSR={topic}></ExerciseUI>;
}

export default Exercise;
