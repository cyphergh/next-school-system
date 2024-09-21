import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/public/logo.png";
import Link from "next/link";
import { getSession } from "@/actions/session";
import NavBar from "./navbar";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex flex-col  fixed w-full overflow-y-scroll snap-y snap-mandatory h-screen ">
      <div className="bg-[url('../public/img1.jpg')] bg-cover bg-center lg:bg-cover w-full min-h-screen flex-col flex justify-center items-center snap-start h-screen">
        <NavBar loggedIn={session.isLoggedIn}></NavBar>

        <Image
          src={Logo}
          alt="logo"
          className="w-[50%] sm:w-[300px] animate-bounce"
        ></Image>
        <div className="text-[3rem] lg:text-[5rem] font-bold text-shadow text-white animate-pulse">
          Welcome
        </div>
      </div>
    </div>
  );
}
