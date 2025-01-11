'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import NewExercisePopup from './new_popup'
import { Exercise, Prisma, StudentsOnExercise, Submission } from '@prisma/client'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { InfinitySpin } from 'react-loader-spinner'
import { GetStudentsOnExercise } from '@/actions/academics/exercise/get_students'
import { toast } from '@/components/ui/use-toast'

function ExerciseUI({topic}:{topic:Prisma.TopicGetPayload<{
    include:{
        subject:true,
        exercises:true,
    }
}>}) {
  const [exercises,setExercises] = useState<Exercise[]>(topic.exercises);
   const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  return (
    <div className='flex-1 flex flex-col overflow-hidden p-3`'>
        <div className='font-bold text-center text-lg capitalize p-4'>
            {topic.subject.name} - {topic.title} Exercises
        </div>
        <Card className='w-full p-4 flex flex-row '>
            <Input placeholder='Search...' className='mr-3'></Input>
          <NewExercisePopup setExercises={setExercises} subjectId={topic.subject.id} topicId={topic.id} />
        </Card>
    <div className=' p-4 flex content-start flex-1 flex-row flex-wrap overflow-y-scroll gap-2'> 
      {exercises.map((exercise)=>{
        return <div key={exercise.id} className='hover:border-4 hover:border-blue-100 cursor-pointer flex flex-col w-full lg:w-[300px] border rounded-sm  p-2 '>
          <div className="p-2 font-mono flex flex-row justify-between">
            <div>{exercise.type}</div>
            <div>[{exercise.totalScore} Mark{exercise.totalScore>1&&"s"}]</div>
            </div>
          <hr></hr>
          <div className="capitalize font-bold">{exercise.title}</div>
          <div className='text-foreground pl-2 text-sm h-12 overflow-y-hidden'>{exercise.description}</div>
          <div className='font-bold font-mono'>{days[exercise.createdAt.getDay()-1]}</div>
          <div className='font-bold font-mono'>{exercise.createdAt.toLocaleDateString("en-GB")}</div>
          <div className='font-bold font-mono'>{exercise.createdAt.toLocaleTimeString("en-US")}</div>
          {exercise.type=="OFFLINE"&& <div className='flex flex-row justify-end'>
            <RecordExerciseCard exercise={exercise}></RecordExerciseCard>
          </div>}
        </div>;
      })}
    </div>
    </div>
  )
}


function RecordExerciseCard({
  exercise
}:{exercise:Exercise}){
  const [records,setRecords] = useState<Prisma.StudentsOnExerciseGetPayload<{
    include:{
      student:{
        include:{
          submissions:{
            include:{
              assessmentScore:true,
            }
          }
        }
      },
      exercise:true,
    }
  }>[]>([]);
   const [error,setError] = useState(false);
   const [errorMessage,setErrorMessage] = useState("");
  const getData = async() =>{
      setLoading(true);
      setError(false);
      const res = await GetStudentsOnExercise(exercise.id);
      setLoading(false)
      if(res.error){
         toast({
        description:res.errorMessage,
        title:"Error",
        variant:"destructive"
      })
      setErrorMessage(res.errorMessage)
      setError(true)
      return;
    }
    setErrorMessage("")
    setError(false);
    if(res.records) setRecords(res.records);
  }
  const [loading,setLoading] = useState(true);
  return <AlertDialog>
    <AlertDialogTrigger>
    <Button onClick={()=>{
      getData();
    }}>Record Marks</Button>

    </AlertDialogTrigger>
    <AlertDialogContent className='flex flex-col overflow-hidden justify-start items-start h-dvh'>
      <AlertDialogHeader>
        <AlertDialogTitle>Record Exercise</AlertDialogTitle>
        <div className='capitalize'>{exercise.title}</div>
        <div className='capitalize'>{exercise.createdAt.toLocaleString("en-GB")}</div>
      </AlertDialogHeader>
      <hr className='w-full'></hr>
      {!loading && !error && <Input placeholder='Search...'></Input>}
     {loading && <div className='w-full flex-1 justify-center items-center flex flex-col'>
        <InfinitySpin></InfinitySpin>
      </div>}
     {!loading && !error && <div className='flex-1 w-full'>
        Loaded {records.length}
      </div>}
     {!loading && error && <div className='flex flex-col gap-y-4 flex-1 w-full text-red-700 font-bold capitalize text-center justify-center items-center'>
        {errorMessage}
        <br></br>
        <Button onClick={()=>getData()}>Try Again</Button>
      </div>}
      <AlertDialogFooter>
        <AlertDialogCancel>Close</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
}


export default ExerciseUI