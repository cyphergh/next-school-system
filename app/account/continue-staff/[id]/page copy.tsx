"use server";
import { notFound, useParams } from "next/navigation";
import logo from "@/public/logo.png";
import Image from "next/image";
import { GetStaffBasicInfoWithUser } from "@/actions/staff/get-basic-info";
import { Staff } from "@prisma/client";
import ContinueStaffRegistrationForm from "../components/form";
async function ContinueStaffRegistration({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) return notFound();
  let staffInfo = await GetStaffBasicInfoWithUser(params.id);
  if (staffInfo.error) throw Error(staffInfo.errorMessage);
  if (!staffInfo.staff) return notFound();
  let school: string = process.env.SCHOOL as string;
  let staff: Staff = staffInfo.staff!;
  let banks = staffInfo.banks as { id: number, code: string, name: string }[]
  banks = banks.filter((e)=>(e.code!="MTN" && e.code != "VODAFONE"&& e.code != "AIRTELTIGO"))
  return (
    <div className="w-full flex flex-col items-center break-words text-wrap p-6 overflow-y-scroll overflow-x-clip text-center">
      <h1 className="text-xl">{school}</h1>
      <Image priority={true} src={logo} alt="logo" className="w-[200px]" />
      <h1 className="text-xl">
        Welcome, <b>{staff.firstName}</b>
      </h1>
      <ContinueStaffRegistrationForm
        params={{ staff,banks}}
      ></ContinueStaffRegistrationForm>
    </div>
  );
}

export default ContinueStaffRegistration;
