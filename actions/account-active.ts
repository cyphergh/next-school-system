import prisma from "@/prisma/db";
import { getSession } from "./session";

export async function IsAccountActive(userId: number): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return true;
    if (!user.active) return true;
    return false;
  } catch (error) {
    return true;
  }
}
