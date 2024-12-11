'use server'
import { getSession } from '@/actions/session'
import React from 'react'
import CreateExamPage from './ui';
import prisma from '@/prisma/db';

async function Page() {
  const session = await getSession();
  const stages = await prisma.class.findMany({
    include:{
        subjects:{
            include:{
                staff:true
            }
        }
    }
  })
  return (
    <CreateExamPage stages={stages}></CreateExamPage>
  )
}

export default Page