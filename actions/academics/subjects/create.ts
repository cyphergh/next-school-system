"use server";

import { IsAccountActive } from "@/actions/account-active";
import { AddStaffActivity, setLastSeen } from "@/actions/auth/setLastSeen";
import { getSession } from "@/actions/session";
import prisma from "@/prisma/db";
import { TGetClassFullInfo } from "@/types";

export async function CreateSubject({
  subject,
  staff,
  stageId,
  isCore,
}: {
  subject: string;
  staff: string;
  stageId: string;
  isCore:Boolean;
}): Promise<TGetClassFullInfo> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Refresh page" };
    const user = await prisma.staff.findUnique({
      where: {
        userId: session.userId,
      },
    });
    if (!user) return { error: true, errorMessage: "Permission Denied" };
    setLastSeen(session.userId);
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId: user.id,
        type: "ADMIN",
        value: true,
      },
    });
    const toStaff = await prisma.staff.findUnique({
      where: {
        id: staff,
      },
    });
    if (!toStaff) return { error: true, errorMessage: "Staff doesn't exist" };

    if (!myPermissions)
      return { error: true, errorMessage: "Permission Denied" };

    const stage = await prisma.class.findFirst({
      where: {
        id: stageId,
      },
      include: {
        subjects: {
          where: {
            name: subject,
          },
        },
      },
    });
    if (!stage) return { error: true, errorMessage: "Invalid class " };
    if (stage.subjects.length)
      return { error: true, errorMessage: "Subject exist" };
    AddStaffActivity(
      user.id,
      "CREATE_RECORD",
      `Creating new subject "${subject}" for ${stage.className}`
    );
    const newSubject = await prisma.subject.create({
      data: {
        name: subject,
        teacherId: staff,
        code: stageId + subject,
        classId: stageId,
        staffId: staff,
        isCore:isCore?true:false,
      },
    });
    AddStaffActivity(
      user.id,
      "CREATE_RECORD",
      `New subject "${subject}" for ${stage.className} created successfully`
    );
    const classInfo = await prisma.class.findFirst({
      where: {
        id: stageId,
      },
      orderBy: [{ updatedAt: "desc" }],
      include: {
        formMaster: {
          include: {
            images: {
              take: 1,
            },
          },
        },
        subjects: {
          orderBy: [{ updatedAt: "desc" }],
          include: {
            staff: {
              include: {
                images: {
                  take: 1,
                },
              },
            },
          },
        },
        students: {
          orderBy: [{ updatedAt: "desc" }],
          include: {
            images: {
              take: 1,
            },
          },
        },
        classPrefect: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    });
    const teachers = await prisma.staff.findMany({
      include: {
        images: {
          take: 1,
        },
      },
      where: {
        OR: [
          {
            role: "TEACHING",
          },
          {
            role: "ADMIN",
          },
        ],
      },
    });
    if (!teachers)
      return { error: true, errorMessage: "No Staff Available For Subject" };
    if (!classInfo) return { error: true, errorMessage: "Class Not Found " };
    return {
      error: false,
      class: classInfo,
      teachers: teachers,
      errorMessage: "",
    };
  } catch (error) {
    return { error: true, errorMessage: "Error retrieving data" };
  }
}

export async function changeSubjectTeacher({
  subjectId,
  staff,
  classId,
}: {
  subjectId: string;
  staff: string;
  classId: string;
}): Promise<TGetClassFullInfo> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId)
      return { error: true, errorMessage: "Refresh page" };
    const user = await prisma.staff.findUnique({
      where: {
        userId: session.userId,
      },
    });
    if (!user) return { error: true, errorMessage: "Permission Denied" };
    if(await IsAccountActive(session.userId))
      return { error: true, errorMessage: "Account suspended" };
    setLastSeen(session.userId);
    const myPermissions = await prisma.permission.findFirst({
      where: {
        staffId: user.id,
        type: "ADMIN",
        value: true,
      },
    });
    const toStaff = await prisma.staff.findUnique({
      where: {
        id: staff,
      },
    });
    if (!toStaff) return { error: true, errorMessage: "Staff doesn't exist" };

    if (!myPermissions)
      return { error: true, errorMessage: "Permission Denied" };

    const subjectToChange = await prisma.subject.findFirst({
      where: {
        id: subjectId,
      },
    });
    if (!subjectToChange)
      return { error: true, errorMessage: "Invalid class " };
    AddStaffActivity(user.id, "OTHER", `Changing subject teacher`);
    const newSubject = await prisma.subject.update({
      data: {
        staffId: staff,
      },
      where: {
        id: subjectId,
      },
    });
    AddStaffActivity(user.id, "OTHER", `Subject teacher changed successfully`);
    const classInfo = await prisma.class.findFirst({
      where: {
        id: classId,
      },
      orderBy: [{ updatedAt: "desc" }],
      include: {
        formMaster: {
          include: {
            images: {
              take: 1,
            },
          },
        },
        subjects: {
          orderBy: [{ updatedAt: "desc" }],
          include: {
            staff: {
              include: {
                images: {
                  take: 1,
                },
              },
            },
          },
        },
        students: {
          orderBy: [{ updatedAt: "desc" }],
          include: {
            images: {
              take: 1,
            },
          },
        },
        classPrefect: {
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    });
    const teachers = await prisma.staff.findMany({
      include: {
        images: {
          take: 1,
        },
      },
      where: {
        OR: [
          {
            role: "TEACHING",
          },
          {
            role: "ADMIN",
          },
        ],
      },
    });
    if (!teachers)
      return { error: true, errorMessage: "No Staff Available For Subject" };
    if (!classInfo) return { error: true, errorMessage: "Class Not Found " };
    return {
      error: false,
      class: classInfo,
      teachers: teachers,
      errorMessage: "",
    };
  } catch (error) {
    return { error: true, errorMessage: "Error retrieving data" };
  }
}
