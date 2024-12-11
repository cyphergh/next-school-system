import React from 'react'
import ExerciseUI from '../ui'
import prisma from '@/prisma/db';

type Props = {
    params: { topicId: string };
};
async function Exercise(    { params }: { params: { id: string } }
) {
    const topic= await prisma.topic.findUnique({where:{id:params.id},include:{subject:true,exercises:true}})
    if(!topic) throw "Topic not found"
  return (
    <ExerciseUI topic={topic}></ExerciseUI>
)
}

export default Exercise