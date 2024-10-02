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
  const topics = await prisma.topic.findMany({
    where:{
        subjectId:params.id
    }
  })
  return  <UI></UI>;
}

export default Page;
