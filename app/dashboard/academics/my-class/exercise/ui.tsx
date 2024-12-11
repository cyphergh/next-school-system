'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React from 'react'
import { FaPlus } from 'react-icons/fa6'
import NewExercisePopup from './new_popup'
import { Prisma } from '@prisma/client'

function ExerciseUI({topic}:{topic:Prisma.TopicGetPayload<{
    include:{
        subject:true,
        exercises:true,
    }
}>}) {
  return (
    <div>
        <div className='font-bold text-center text-lg capitalize p-4'>
            {topic.subject.name} - {topic.title} Exercises
        </div>
        <Card className='w-full p-4 flex flex-row '>
            <Input placeholder='Search...' className='mr-3'></Input>
          <NewExercisePopup/>
        </Card>
    </div>
  )
}





export default ExerciseUI