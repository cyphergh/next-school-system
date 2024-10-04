import prisma from "@/prisma/db";
import React from "react";
import UI from "./ui";
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
async function Page({ params }: { params: { id: string } }) {
  const topic = await prisma.topic.findUnique({
    where: {
      id: params.id,
    },
    include: {
      notes: true,
      exercises: {
        include: {
          _count: true,
        },
      },
      assignment: {
        include: {
          _count: true,
        },
      },
      projectworks: {
        include: {
          _count: true,
        },
      },
      term: true,
    },
  });
  if (!topic) throw Error("Topic not found");
  const notes = await prisma.note.findMany({
    where: {
      topicId: params.id,
    },
    include: {
      subject: true,
      staff: true,
      term: true,
      topic: true,
    },
  });
  return <UI n={notes} t={topic} />;
}

export default Page;
