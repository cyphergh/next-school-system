'use client'
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from 'next/router';
import Link from 'next/link';
function NoStaffError({error,setError}:{error:boolean,setError:React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    
    <AlertDialog open={error} defaultOpen={error}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Teaching staff must be added before creating a new class?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This error message appears when a user attempts to create a new
          class without having assigned any teaching staff. It serves as a
          prompt to ensure that the necessary staff members are added to the
          system before proceeding with the creation of a class. This
          ensures that every class has the appropriate teaching resources
          allocated, maintaining the integrity and functionality of the
          system.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={()=>setError(false)} className='text-red-400 bg-transparent sm:mr-4'>Close</AlertDialogAction>
       <Link href="../staff/new-staff">
       <AlertDialogAction>Create staff</AlertDialogAction>
       </Link> 
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default NoStaffError
