
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Bar from "./components/Bar";
import { ListClasses } from "@/actions/class/list";
import { Prisma } from "@prisma/client";
import { GetEDBills } from "@/actions/finance/get-ed-bills";
import { TGetEDBills } from "@/types";
export const dynamic = 'force-dynamic'

async function EventDrivenBillPage() {
  let classList: Prisma.ClassGetPayload<{ include: { students: true } }>[] = [];
  let edBills: TGetEDBills[];
  try {
    const classes = await ListClasses();
    const bills = await GetEDBills();
    if (classes.error) throw new Error(classes.errorMessage);
    if (!classes.classes) throw new Error("Create new class first");
    classList = [...classes.classes];
    if (bills.error) throw new Error(classes.errorMessage);
    if (!bills.bills) throw new Error("Error occurred");
    edBills = [...bills.bills];
  } catch (error:any) {
     throw new Error("Server Connection Failed");
  }
  return (
    <>
        <Bar stages={classList} bills={edBills} />
    </>
  );
}

export default EventDrivenBillPage;
