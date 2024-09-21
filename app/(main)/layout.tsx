import { CheckIfThereIsRegisteredStaff } from "@/actions/auth/dashboard/check-staff";
import { getUser } from "@/actions/auth/getUser";
import { getSession } from "@/actions/session";
import NavbarDeskTop from "@/components/navbar/Navbar";
import { Metadata } from "next";
import Link from "next/link";
import NavBar from "./navbar";
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title:process.env.NEXT_PUBLIC_SCHOOL,
  description: "",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session;
  let user;
  try {
    [session,user] = await Promise.all([getSession(),getUser()])
    if(!user) return Error("Reload the page")
  } catch (error) {
    return new Error("Connection Error")
  }
  return (
      <div className="fixed top-0 left-0 w-full h-full overflow-y-scroll p-0 m-0"> 
        <div className="flex-1 flex-col flex  h-full overflow-hidden">
        {children}
        </div>
          
      </div>
  );
}
