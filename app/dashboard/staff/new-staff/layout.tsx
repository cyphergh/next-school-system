import { Metadata } from "next";
import React from "react";
export const dynamic = 'force-dynamic'

export const metadata:Metadata = {
    title:"New Staff"
}

export default async function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <>{children}</>
}