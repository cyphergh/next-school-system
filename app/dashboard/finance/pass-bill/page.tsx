import React from 'react'
import PassBillUI from './ui'
import { GetStudentsInfo } from '@/actions/student/info_students'

async function Page() {
const res = await GetStudentsInfo();
if(res.error) throw Error(res.errorMessage);
if(!res.students) throw Error("No students found");
  return (
    <PassBillUI st={res.students}></PassBillUI>
  )
}

export default Page
