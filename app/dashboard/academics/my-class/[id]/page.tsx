import prisma from "@/prisma/db";
import { ResolvingMetadata } from "next";
import React from "react";
import UI from "./ui";
type Props = {
  params: { id: string };
};
async function Page(
    { params }: { params: { id: string } }
) {
  const term = await prisma.term.findFirst({
    where:{
      isActve:true
    }
  });
  if(!term) throw new Error("No active term")
  const subject = await prisma.subject.findFirst({
    where:{
      id:params.id
    },
    include:{
      class:true
    }
  });
  if(!subject) throw Error("Subject Not Found")
  const topics = await prisma.topic.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where:{
        subjectId:params.id,
        termId:term.id,
    },
    include:{
      notes:true,
      term:true,
      exercises:{
        where:{
          termId:term.id,
        }
      },
      assignment:{
        where:{
          termId:term.id,
        }
      },
      projectworks:{
        where:{
          termId:term.id,
        }
      },
      subject:true,
    }
  })
  return  <UI subject={subject} t={topics}></UI>;
}

export default Page;
