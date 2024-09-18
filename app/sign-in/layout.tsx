import { CheckIfThereIsRegisteredStaff } from "@/actions/auth/dashboard/check-staff";
import { getSession } from "@/actions/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title:"SignIn "+ process.env.SCHOOL,
  description: "",
};

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
