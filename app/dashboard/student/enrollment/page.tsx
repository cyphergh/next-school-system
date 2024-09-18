'use server'
import React from 'react'
import EnrollmentUI from './ui'
import { GetStudentsInfo } from '@/actions/student/info_students'
import AdmissionFormPrinting from '../admission/form';

async function EnrollmentPage() {
       const res = await GetStudentsInfo();
       if(res.error) throw Error(res.errorMessage   );
       if(!res.students) throw Error("No students found");
  return (
    <EnrollmentUI st={res.students}></EnrollmentUI>
  )
}

export default EnrollmentPage
