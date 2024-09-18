import { CheckIfThereIsRegisteredStaff } from "@/actions/auth/dashboard/check-staff";
import { getUser } from "@/actions/auth/getUser";
import { getSession } from "@/actions/session";
import NavbarDeskTop from "@/components/navbar/Navbar";
import TopNav from "@/components/topnav/TopNav";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:"Class Management",
    description: "",
};

export const dynamic = 'force-dynamic'
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
      {children}
        </>
  );
}
