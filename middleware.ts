import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CheckIfThereIsRegisteredStaff } from "./actions/auth/dashboard/check-staff";
import { getSession } from "./actions/session";
import { redirect } from "next/navigation";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
}
if (session.isLoggedIn && session.accountType == "STUDENT") {
    return NextResponse.redirect(new URL("/student", request.url));
}
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*",],
};
