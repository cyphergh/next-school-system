import { GetStudentsInfo } from "@/actions/student/info_students";
import PaymentPage from "./ui";
import { StInfo } from "@/types";
import { GetStaffPaymentTransactions } from "@/actions/finance/staff-payment-transactions";

async function PaymentPageAsync() {
  const [studentsRes, transactionsRes] = await Promise.all([
    GetStudentsInfo(),
    GetStaffPaymentTransactions(),
  ]);

  if (studentsRes.error) {
    throw new Error(studentsRes.errorMessage);
  }
  if (!studentsRes.students) {
    throw new Error("No students found");
  }
  return <PaymentPage ts={transactionsRes.transactions ?? []} st={studentsRes.students!} />;
}

export default PaymentPageAsync;
