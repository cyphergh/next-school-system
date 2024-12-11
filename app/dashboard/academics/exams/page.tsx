'use server'
import { getSession } from '@/actions/session'
import prisma from '@/prisma/db';
import React from 'react'
import ExamUI from './ui';

async function ExamPage() {
  const session = await getSession();
  const user = await prisma.user.findFirst({
    where:{
      id:session.userId,
    },
    include:{
      staff:{
        include:{
          permissions:{
            where:{
              type:"ADMIN",
              value:true,
            }
          }
        }
      }
    }
  });
  const exams = await prisma.examination.findMany({
    where:user?.staff?.permissions.length ? {}: {
      open:true,
      release:false,
    },
    include:{
      term:true,
      subjects:{
        include:{
          subject:{
            include:{
              staff:true
            }
          }
        }
      }
    }
  })
  if(!user) throw "User not found";
  return (
    <ExamUI exams={exams} user={user}></ExamUI>
  )
}

export default ExamPage