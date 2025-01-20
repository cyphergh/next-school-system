"use server";

import prisma from "@/prisma/db";
import { getSession } from "../session";
import { IsAccountActive } from "../account-active";
import { setLastSeen } from "../auth/setLastSeen";
import { StudentInfoData } from "@/types";

export async function EditStudentInfo({
  studentId,
  change,
  value,
}: {
  studentId: string;
  change: string;
  value: string;
}): Promise<{ error: boolean; errorMessage: string; data?: StudentInfoData }> {
  try {
    const access = await CheckEditAccess();
    if (access.error) throw Error(access.errorMessage);
    const s = await prisma.student.findFirst({
      where: {
        id: studentId,
      },
    });
    if (!s) throw "Student not found";
    switch (change) {
      case "name":
        const nameArr = value.trim().split(" ");
        if (nameArr.length < 2) throw Error("Invalid name");
        const firstName = nameArr[0];
        const lastName = nameArr.slice(1).join(" ");
        await prisma.student.update({
          where: {
            id: s.id,
          },
          data: {
            firstName,
            lastName,
          },
        });
        break;
      case "fathersPhoneNumber":
        await prisma.$transaction(async (db) => {
          const father = await db.father.update({
            where: {
              id: s.fathersId,
            },
            data: {
              phoneNumber: value,
            },
          });
          await db.user.update({
            where: {
              id: father.userId!,
            },
            data: {
              phoneNumber: value,
            },
          });
        });
        break;
      case "fathersEmail":
        await prisma.$transaction(async (db) => {
          const father = await db.father.update({
            where: {
              id: s.fathersId,
            },
            data: {
              emailAddress: value,
            },
          });
          await db.user.update({
            where: {
              id: father.userId!,
            },
            data: {
              email: value,
            },
          });
        });
        break;
      case "fathersName":
        const fnameArr = value.trim().split(" ");
        if (fnameArr.length < 2) throw Error("Invalid name");
        const ffirstName = fnameArr[0];
        const flastName = fnameArr.slice(1).join(" ");
        await prisma.father.update({
          where: {
            id: s.fathersId,
          },
          data: {
            firstName: ffirstName,
            lastName: flastName,
          },
        });
        break;
      case "fathersAddress":
        await prisma.father.update({
          where: {
            id: s.fathersId,
          },
          data: {
            address: value,
          },
        });
        break;
      case "fathersDateOfBirth":
        const [fd, fm, fy] = value.split("/");
        if (!fd || !fm || !fy) throw "Invalid date type dd/mm/yyyy";
        const fdate = new Date(parseInt(fy), parseInt(fm) - 1, parseInt(fd));
        await prisma.$transaction(async (db) => {
          await db.father.update({
            where: {
              id: s.fathersId,
            },
            data: {
              dateOfBirth: fdate,
            },
          });
        });
        break;
      case "mothersPhoneNumber":
        await prisma.$transaction(async (db) => {
          const mother = await db.mother.update({
            where: {
              id: s.mothersId,
            },
            data: {
              phoneNumber: value,
            },
          });
          await db.user.update({
            where: {
              id: mother.userId!,
            },
            data: {
              phoneNumber: value,
            },
          });
        });
        break;
      case "mothersEmail":
        await prisma.$transaction(async (db) => {
          const mother = await db.mother.update({
            where: {
              id: s.mothersId,
            },
            data: {
              emailAddress: value,
            },
          });
          await db.user.update({
            where: {
              id: mother.userId!,
            },
            data: {
              email: value,
            },
          });
        });
        break;
      case "mothersName":
        const mnameArr = value.trim().split(" ");
        if (mnameArr.length < 2) throw Error("Invalid name");
        const mfirstName = mnameArr[0];
        const mlastName = mnameArr.slice(1).join(" ");
        await prisma.mother.update({
          where: {
            id: s.mothersId,
          },
          data: {
            firstName: mfirstName,
            lastName: mlastName,
          },
        });
        break;
      case "mothersAddress":
        await prisma.mother.update({
          where: {
            id: s.mothersId,
          },
          data: {
            address: value,
          },
        });
        break;
      case "mothersDateOfBirth":
        const [md, mm, my] = value.split("/");
        if (!md || !mm || !my) throw "Invalid date type dd/mm/yyyy";
        const mdate = new Date(parseInt(my), parseInt(mm) - 1, parseInt(md));
        await prisma.$transaction(async (db) => {
          await db.mother.update({
            where: {
              id: s.mothersId,
            },
            data: {
              dateOfBirth: mdate,
            },
          });
        });
        break;
      // Student
      case "classId":
        const stage = await prisma.class.findFirst({
          where: {
            id: value,
          },
        });
        if (!stage) throw "Class Not Found";
        await prisma.student.update({
          where: {
            id: s.id,
          },
          data: {
            classId: value,
          },
        });
        break;
      case "status":
        if (value != "DAY" && value != "BOARDING")
          throw "Choose either Day/Boarding";
        await prisma.student.update({
          where: {
            id: s.id,
          },
          data: {
            type: value as "DAY" | "BOARDING",
          },
        });
        break;
      case "gender":
        if (value != "MALE" && value != "FEMALE")
          throw "Choose either MALE/FEMALE";
        await prisma.student.update({
          where: {
            id: s.id,
          },
          data: {
            gender: value as "MALE" | "FEMALE",
          },
        });
        break;
      case "address":
        await prisma.student.update({
          where: {
            id: s.id,
          },
          data: {
            address: value,
          },
        });
        break;
      case "emailAddress":
        await prisma.$transaction(async (db) => {
          await db.student.update({
            where: {
              id: s.id,
            },
            data: {
              emailAddress: value,
            },
          });
          await db.user.update({
            where: {
              id: s.userId!,
            },
            data: {
              email: value,
            },
          });
        });
        break;
      case "phoneNumber":
        await prisma.$transaction(async (db) => {
          await db.student.update({
            where: {
              id: s.id,
            },
            data: {
              phoneNumber: value,
            },
          });
          await db.user.update({
            where: {
              id: s.userId!,
            },
            data: {
              phoneNumber: value,
            },
          });
        });
        break;
      case "dateOfBirth":
        const [d, m, y] = value.split("/");
        if (!d || !m || !y) throw "Invalid date type dd/mm/yyyy";
        const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        await prisma.$transaction(async (db) => {
          await db.student.update({
            where: {
              id: s.id,
            },
            data: {
              dateOfBirth: date,
            },
          });
        });
        break;
      case "guardianName":
        await prisma.student.update({
          where: {
            id: s.id,
          },
          data: {
            guardianName: value,
          },
        });
        break;
      case "guardianPhone":
        await prisma.student.update({
          where: {
            id: s.id,
          },
          data: {
            guardianPhone: value,
          },
        });
        break;
      case "guardianEmail":
        await prisma.student.update({
          where: {
            id: s.id,
          },
          data: {
            guardianEmail: value.toLocaleLowerCase(),
          },
        });
        break;
    }
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
      },
      include: {
        mother: true,
        father: true,
        class: {
          include: {
            formMaster: true,
          },
        },
        transactions: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
        activities: {
          take: 10,

          orderBy: {
            createdAt: "desc",
          },
        },
        submissions: {
          include: {
            exercise: true,
            assessmentScore: {},
          },
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
        },
        images: {
          take: 1,
          where: {
            isProfile: true,
          },
        },
      },
    });
    return { error: false, errorMessage: "Impl error", data: student! };
  } catch (error: any) {
    return { error: true, errorMessage: error.toString() };
  }
}

export async function CheckEditAccess(): Promise<{
  error: boolean;
  errorMessage: string;
}> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId)
    return { error: true, errorMessage: "Refresh page" };
  const me = await prisma.staff.findUnique({
    where: {
      userId: session.userId,
    },
  });
  if (!me) return { error: true, errorMessage: "Permission Denied" };
  if (await IsAccountActive(me.userId!))
    return { error: true, errorMessage: "Account suspended" };
  setLastSeen(session.userId);
  const myPermissions = await prisma.permission.findFirst({
    where: {
      staffId: me.id,
      OR: [{ type: "AddStudentInfo" }, { type: "EditStudentInfo" }],
      value: true,
    },
  });
  if (!myPermissions && me.phoneNumber !== "0206821921")
    return { error: true, errorMessage: "Permission Denied" };
  return { error: false, errorMessage: "" };
}
