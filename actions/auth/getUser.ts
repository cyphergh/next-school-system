"use server";

import {
  FatherWithPermission,
  MotherWithPermission,
  StaffWithPermission,
  StudentWithPermission,
  TGetUser,
} from "@/types";
import { getSession } from "../session";
import prisma from "@/prisma/db";
import { setLastSeen } from "./setLastSeen";

export async function getUser(): Promise<TGetUser> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId)
    return { error: true, errorMessage: "Refresh the page" };
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: session.userId,
      },
    });
    if (!user) return { error: true, errorMessage: "Refresh the page" };
    if (!user.active)
      return { error: true, errorMessage: "Account suspended" };
    setLastSeen(session.userId);
    if (user.account == "STAFF") {
      const details = await prisma.staff.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          user: {},
          images: {},
          permissions: {},
        },
      });
      if (!details) return { error: true, errorMessage: "Reload page" };
      return { error: false, errorMessage: "", user: details };
    }
    if (user.account == "MOTHER") {
      const details = await prisma.mother.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          user: {},
          images: {},
          wards: {},
        },
      });
      if (!details) return { error: true, errorMessage: "Reload page" };
      return { error: false, errorMessage: "", user: details };
    }
    if (user.account == "FATHER") {
      const details = await prisma.father.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          user: {},
          images: {},
          wards: {},
        },
      });
      if (!details) return { error: true, errorMessage: "Reload page" };
      return { error: false, errorMessage: "", user: details };
    }
    if (user.account == "STUDENT") {
      const details = await prisma.student.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          user: {},
          images: {},
        },
      });
      if (!details) return { error: true, errorMessage: "Reload page" };
      return { error: false, errorMessage: "", user: details };
    }
    return { error: true, errorMessage: "Unknown error" };
  } catch (error) {
    await setLastSeen(session.userId);
    return { error: true, errorMessage: "Error occurred" };
  }
}
