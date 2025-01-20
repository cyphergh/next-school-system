'use server'
import { IsAccountActive } from "@/actions/account-active";
import { setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { AssType, NewAssignmentResponse, Question } from "@/types";

export async function CreateAssignment({
  title,
  type,
  total,
  description,
  dueDate,
  subjectId,
  questions,
  topicId
}: {
  title: string;
  type: AssType;
  total: number;
  description: string;
  dueDate: string;
  subjectId: string;
  topicId: string;
  questions: Question[];
}): Promise<NewAssignmentResponse> {
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
    const term = await prisma.term.findFirst({
      where: {
        isActve: true,
      },
    }); 
    if(!term) throw "No Active Term"
    await prisma.$transaction(async(db)=>{
        const subject = await db.subject.findFirst({
            where:{
                id:subjectId
            }
        });
        if(!subject) throw "Subject Not Found";
        const stage = await db.class.findUnique({
            where:{
                id:subject.classId
            },
            include:{
                students:true
            }
          });
          if(!stage) throw "Class not found";

        const assignment =await db.assignment.create({
            data:{
                totalStudents:stage.students.length,                
                title:title,
                type:type,
                dueDate:dueDate? new Date(Date.parse(dueDate)):null,
                totalScore:total,
                description:description,
                staffId:user.id,
                subjectId:subject.id,
                termId:term.id,
                topicId,
            }
        });
        for(let i=0;i<questions.length;i++){
            const question = questions[i];
            await db.question.create({
                data:{
                    text: question.question,
                    type:question.type,
                    assignmentId:assignment.id,
                    options:{
                        createMany:{
                            data:[
                                ...question.options.map((e)=>{
                                    return  {
                                        isCorrect:e.isAnswer,
                                        text:e.option,
                                    }
                                })
                            ],
                            skipDuplicates:true,

                        }
                    },
                    

                }
            })
        }

    
      if(!stage.students.length) throw `No student in ${stage.className.toUpperCase()}`
      await db.studentOnAssignment.createMany({
        data:[
            
            ...stage.students.map((student)=>{
                return {
                    assignedBy:user.id,
                    assignmentId:assignment.id,
                    studentId:student.id,
                    submitted:false
                }
            })
        ]
      })
    })
    const assignments = await prisma.assignment.findMany({
      orderBy:{
        createdAt:'desc'
      },
        where:{
            termId:term.id,
            topicId:topicId,
        },
    })
    return { error: false, errorMessage: "",assignments };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}
