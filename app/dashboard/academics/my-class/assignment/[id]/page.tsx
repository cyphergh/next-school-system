import React from "react";
import ExerciseUI from "../ui";
import prisma from "@/prisma/db";
import AssignmentUI from "../ui";

type Props = {
  params: { topicId: string };
};
async function Assignment({ params }: { params: { id: string } }) {
  const term = await prisma.term.findFirst({
    where:{
      isActve:true
    }
  });
  if(!term) throw new Error("No active term");
  const topic = await prisma.topic.findUnique({
    where: { id: params.id,termId:term.id },
    include: { subject: true, assignment: {
      orderBy:{
        createdAt:'desc'
      }
    } },
  });
  if (!topic) throw "Topic not found";
  return <AssignmentUI topicFromSSR={topic}></AssignmentUI>;
}

export default Assignment;
