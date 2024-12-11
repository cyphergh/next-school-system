'use server'
import { getSession } from '@/actions/session'
import prisma from '@/prisma/db';
import React from 'react'
import UI from './ui';

async function Page({ params }: { params: { id: string } }) {
 const session = await getSession();
 const exam = await prisma.examination.findFirst({
    where:{
        id:params.id
    }
 });
 const user = await prisma.user.findFirst({
    where:{
        id:session.userId
    },
    include:{
        staff:{
            include:{
                subjects:{
                    include:{
                        examRecords:{
                            where:{
                                examId:params.id
                            }
                        },
                        exams:{
                            where:{
                                examId:params.id
                            }
                        },
                        class:{
                            include:{
                                students:{
                                    where:{
                                        stopped:false
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
    }
 });
 if(!user) throw "User not found";
 if(!exam) throw "Exam not found";
  return (
    <UI exam={exam} user={user}></UI>
  )
}


export default Page