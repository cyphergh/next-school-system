"use client";
import React, { useState } from "react";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IoMenu } from "react-icons/io5";
import { redirect, usePathname } from "next/navigation";
import navItems from "../navbar/items";
import NavItem from "../navbar/NavItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession } from "@/actions/session";
import {
  FatherWithPermission,
  MotherWithPermission,
  StaffWithPermission,
  StudentWithPermission,
} from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTheme } from "next-themes";
import { revalidatePath } from "next/cache";
import { Logout } from "@/actions/auth/login-action";
import FullScreenLoading from "../loading/fullscreen-loading";
function TopNav({
  user,
}: {
  user:
    | StaffWithPermission
    | StudentWithPermission
    | MotherWithPermission
    | FatherWithPermission;
}) {
  const p = usePathname();
  const theme = useTheme();
  const [loading,setLoading] = useState(false); 
  if(!user) return redirect("/sign-in")
  const logout = async()=>{
    setLoading(true);
    await Logout();
  }
  if(loading) return <FullScreenLoading></FullScreenLoading>
  return (
    <div className="w-full flex flex-row justify-between p-2 box-border items-center mt-2 shadow-sm h-auto shadow-slate-400 dark:shadow-md dark:shadow-gray-900">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex flex-row">
            <Avatar className="w-[40px] h-[40px] cursor-pointer">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${user?.images[0]?.id}`}
                alt="profile"
              />
              <AvatarFallback>
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Themes</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => theme.setTheme("system")}>
                    System
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => theme.setTheme("dark")}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => theme.setTheme("light")}>Light</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="pl-4 font-bold text-[10px] sm:text-lg h-auto pt-2">
        {p
          .split("/")
          [p.split("/").length - 2].replaceAll("-", " ")
          .toUpperCase()}{" "}
        /{" "}
        {p
          .split("/")
          [p.split("/").length - 1].replaceAll("-", " ")
          .toUpperCase()}
      </div>
      <div className="sm:hidden">
        <Sheet modal={true}>
          <SheetTrigger asChild>
            <IoMenu size={35} />
          </SheetTrigger>
          <SheetContent className="overflow-y-scroll">
            <SheetHeader>
              <Image
                src={Logo}
                alt="logo"
                className=" w-full max-w-[200px]"
              ></Image>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            {navItems.map((e) => (
              <NavItem key={e.link} nav={e} />
            ))}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default TopNav;
