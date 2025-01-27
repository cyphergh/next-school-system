
import { Metadata } from "next";
import Link from "next/link";
import TopNav from "./topnav";
export const dynamic = 'force-dynamic'

// export const metadata: Metadata = {
//   title:"Dashboard",
//   description: "",
// };

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div > 
        <TopNav></TopNav>
        <div>
        {children}
        </div>
          
      </div>
  );
}