import { Card } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

function UI() {
  return (
    <>
    <div className="p-4 flex-1 overflow-y-scroll">
      <Card className='p-4 flex flex-col md:flex-row gap-2'>
        <div className='font-bold text-indigo-600'>Quick Links</div>
         <div className='ml-8'>
            <Link href={"dashboard/academics/class"}>My Subjects</Link>
         </div>
         <div className='ml-8'>
            <Link href={"dashboard/finance/my-transactions"}>My Transactions</Link>
         </div>
         <div className='ml-8'>
            <Link href={"dashboard/academics/exams"}>Exams</Link>
         </div>
         <div className='ml-8'>
            <Link href={"dashboard/student/enrollment"}>Students</Link>
         </div>
      </Card>
    </div>
    </>
  )
}

export default UI