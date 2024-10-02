"use client";
import { Button } from "@/components/ui/button";
import { NavItem as NavItemType } from "@/types";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbCircleChevronDown } from "react-icons/tb";
import { TbCircleChevronUp } from "react-icons/tb";
import { SheetClose } from "../ui/sheet";

function NavItem({ nav }: { nav: NavItemType }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  if (!nav.subMenu) {
    return (
        <Link
          title={"" + nav.title}
          href={nav.link}
          className={`flex flex-row p-1 w-full sm:hover:pb-2 sm:hover:pl-4 items-center lg:hover:pl-8 cursor-pointer hover:border-l-4 hover:border-blue-600 rounded-md mt-2 justify-between} ${
            path === nav.link ? "bg-blue-700 text-white" : ""
          }`}
        >
          <div className="flex sm:flex-col lg:flex-row sm:hover:flex sm:text-[8px] lg:text-[14px] flex-row gap-x-4 items-center w-full overflow-hidden">
            <div>{nav.image}</div>
            <p className="lg:block overflow-x-hidden">{nav.title}</p>
          </div>
        </Link>
    );
  }
  return (
    <div
      title={"" + nav.title}
      className="w-full"
      onClick={() => {
        setOpen(!open);
      }}
    >
      <div className="flex flex-row p-2 w-full items-center sm:hover:pb-2 lg:hover:pl-8 cursor-pointer hover:border-l-4 hover:border-blue-600 rounded-md mt-2 justify-between overflow-hidden">
        <div className="flex flex-row sm:flex-col lg:flex-row sm:hover:flex sm:text-[8px] lg:text-[14px] gap-x-4 items-center  ">
          {nav.image}
          
          <p className="lg:block overflow-hidden font-bold font-mono">{nav.title}</p>
        </div>
      </div>
      <div
        className={`ml-4 sm:ml-0 lg:ml-6 ${
          open || path.includes(nav.link) ? "block" : "hidden"
        }`}
      >
        {nav.subMenu.map((e) => (
          <NavItem key={e.link} nav={e}></NavItem>
        ))}
      </div>
    </div>
  );
}

export default NavItem;
