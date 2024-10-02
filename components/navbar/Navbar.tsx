"use client";
import Image from "next/image";
import logo from "@/public/logo.png";
import logout from "@/public/svg/export.svg";
import navItems from "./items";
import NavItem from "./NavItem";
function NavbarDeskTop() {
  const username = "Kusi Samuel";
  return (
    <div className="hidden  justify-start sm:flex  sm:w-[70px] lg:w-[210px]  flex-col items-center w-full gap-y-2 overflow-y-scroll bg-blue-950 dark:bg-gray-900 p-2  text-white rounded-lg  ">
      <Image
        src={logo}
        priority={true}
        alt="logo"
        className="w-full lg:block max-w-[190px]"
      ></Image>

      {navItems.map((e) => (
        <NavItem key={e.link} nav={e} />
      ))}
    </div>
  );
}

export default NavbarDeskTop;
