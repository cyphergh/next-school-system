'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import NewExercisePopup from './new_popup'
import { Exercise, Prisma } from '@prisma/client'

function ExerciseUI({topic}:{topic:Prisma.TopicGetPayload<{
    include:{
        subject:true,
        exercises:true,
    }
}>}) {
  const [exercises,setExercises] = useState<Exercise[]>([]);
  return (
    <div className='flex-1 flex flex-col overflow-hidden p-3`'>
        <div className='font-bold text-center text-lg capitalize p-4'>
            {topic.subject.name} - {topic.title} Exercises
        </div>
        <Card className='w-full p-4 flex flex-row '>
            <Input placeholder='Search...' className='mr-3'></Input>
          <NewExercisePopup setExercises={setExercises} subjectId={topic.subject.id} topicId={topic.id} />
        </Card>
    <div className='p-4 text-xl'> 
      {exercises.length}
    </div>
    </div>
  )
}





export default ExerciseUI