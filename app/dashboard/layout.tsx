import { CheckIfThereIsRegisteredStaff } from "@/actions/auth/dashboard/check-staff";
import { getUser } from "@/actions/auth/getUser";
import { getSession } from "@/actions/session";
import NavbarDeskTop from "@/components/navbar/Navbar";
import TopNav from "@/components/topnav/TopNav";
import { Metadata } from "next";
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title:"Dashboard",
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
      <div className="flex flex-row fixed top-0 left-0 w-full h-full overflow-hidden p-2"> 
        <NavbarDeskTop></NavbarDeskTop>
        <div className="flex-1 flex-col flex p-2 h-full overflow-hidden">
        <TopNav user={user.user!}></TopNav>
        {children}
        </div>
          
      </div>
  );
}
