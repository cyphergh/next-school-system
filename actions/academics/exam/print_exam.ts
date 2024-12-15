"use server";

import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { rT } from "@/types";
import { Prisma } from "@prisma/client";
 
export async function PrintReport(
 {classes,examId,studentId}:{
    classes: string[],
    examId:string,
    studentId?: string,
 }
): Promise<{
  error: boolean;
  errorMessage?: string;
  reports?: rT[];
}> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Refresh page" };
    const user = await prisma.staff.findFirst({
      where: {
        userId: session.userId,
      },
    });
    if (!user) return { error: true, errorMessage: "Permission Denied" };
    if (await IsAccountActive(session.userId))
      return { error: true, errorMessage: "Account suspended" };
    setLastSeen(session.userId);
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId: user.id,
        type: "ADMIN",
        value: true,
      },
    });
    const term = await prisma.term.findFirst({
      where: {
          isActve: true,
        },
    });
    if (!term) throw new Error("Create a new term first");
    if (!myPermissions && user.phoneNumber !== "0206821921")
        return { error: true, errorMessage: "Permission Denied" };
    if(studentId){
        console.log("by student Id")
        let id:number = parseInt(studentId);
        if(isNaN(id)) throw "Invalid Student ID";
        const student = await prisma.student.findFirst({
            where:{
                userId:id
            }
        });
        if(!student) throw "Student not found"
        const report  = await prisma.releaseExams.findFirst({
            where:{
                studentId: student.id,
                examId:examId,
            },
            include: {
                
                exams: {
                  include: {
                    records: {
                      where:{
                        studentId:student.id,
                        examId:examId,
                      },
                      include: {
                        subject: true,
                      },
                    },
                  },
                },
                student: {
                    include:{
                        images:{
                            take:1
                        }
                    }
                },
                class: {
                  include: {
                    students: true,
                    formMaster:true,
                  },
                },
              }
        });
        if(!report) throw "No report found"
        let reports:rT[] = [report];
        return { error: false, reports };
    }
    if(classes.length>0){
        console.log("by class")
        let reports:rT[]=[];
        for(let i=0;i<classes.length;i++){
            let students = await prisma.student.findMany({
                where:{
                    classId:classes[i]
                }
            });
            for(let p=0;p<students.length;p++){
                const student = students[p];
                const report  = await prisma.releaseExams.findFirst({
                    where:{
                        studentId: student.id,
                        examId:examId,
                    },
                    include: {
                        
                        exams: {
                          include: {
                            records: {
                              where:{
                                studentId:student.id,
                                examId:examId,
                              },
                              include: {
                                subject: true,
                              },
                            },
                          },
                        },
                        student: {
                            include:{
                                images:{
                                    take:1
                                }
                            }
                        },
                        class: {
                          include: {
                            students: true,
                            formMaster:true,
                          },
                        },
                      }
                });
                if(report){
                    reports.push(report);
                }
            }
        }
        return { error: false, reports };
    }
    return { error: true, errorMessage: "Unknown Student ID/ Invalid Class" };
  } catch (error: any) {
    console.log(error);
    return { error: true, errorMessage: error.toString() };
  }
}
