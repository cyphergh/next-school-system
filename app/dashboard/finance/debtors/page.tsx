import { GetDebtors } from '@/actions/finance/debtors'
import React from 'react'
import UI from './ui';

async function Page() {
    let students = await GetDebtors();
    if(students.error) throw new Error(students.errorMessage);
    if(!students.students) throw new Error("No students found");
  return (
   <UI st={students.students}></UI>
  )
}

export default Page
