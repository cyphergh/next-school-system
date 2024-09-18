"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { QrScan } from "pastel-qr-scan";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CompleteTransactionType, StInfo } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { InfinitySpin } from "react-loader-spinner";
import { Payment } from "@/actions/finance/payment";
import { useState } from "react";
import PaymentTransactionCard from "./components/payment-transaction-card";
import { GetStaffPaymentTransactions } from "@/actions/finance/staff-payment-transactions";

function PaymentPage({ st,ts }: { st: StInfo[],ts:CompleteTransactionType[]  }) {
  const [payer, setPayer] = useState<"MOTHER" | "FATHER" | "GUARDIAN" | null>(
    null
  );
  const [transactions,setTransactions] =useState<CompleteTransactionType[]>(ts)
  const [students, setStudent] = useState<StInfo[]>(st);
  const [studentId, setStudentId] = useState<string>("");
  const [payerName, setPayerName] = useState("");
  const [payerPhoneNumber, setPayerPhoneNumber] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [repeatAmount, setRepeatAmount] = useState("");
  const [billReference, setBillReference] = useState("");
  const [description, setDescription] = useState("");
  const [emailOrNumber, setEmailOrNumber] = useState("");
  const [showStudents, setShowStudents] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [showPay, setShowPay] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPaymentId, setLastPaymentId] = useState("");
  async function makePayment() {
    if (!amount)
      return toast({
        title: "Amount required",
        description: "Enter amount to pay",
        variant: "destructive",
      });
    if (!repeatAmount)
      return toast({
        title: "Repeat amount",
        description: "Enter repeat amount",
        variant: "destructive",
      });
    if (amount !== repeatAmount)
      return toast({
        title: "Amount mismatch",
        description: "Enter correct amount",
        variant: "destructive",
      });
    if (!payer) {
      if (!payerName)
        return toast({
          title: "Payer name required",
          description: "Enter payer name",
          variant: "destructive",
        });
      if (!payerPhoneNumber)
        return toast({
          title: "Payer phone number required",
          description: "Enter payer phone number",
          variant: "destructive",
        });
      if (!payerEmail)
        return toast({
          title: "Payer email required",
          description: "Enter payer email",
          variant: "destructive",
        });
    }
    setShowPay(true);
  }
  const change = (p: "MOTHER" | "FATHER" | "GUARDIAN") => {
    if (payer == p) {
      setPayer(null);
      return;
    }
    setPayer(p);
  };
  const select = (id: string, email: string) => {
    if (studentId == id) {
      setStudentId("");
      setEmailOrNumber(email);
      setShowStudents(false);
      return;
    }
    setEmailOrNumber(email);
    setShowStudents(false);
    setStudentId(id);
  };
  const validate = () => {
    setStudentId("");
    if (!emailOrNumber) {
      toast({
        title: "Email Or Phone number required",
        description: "Enter phone number or email of student",
        variant: "destructive",
      });
      return;
    }
    const st = students.find(
      (e) =>
        e.emailAddress.toLowerCase() === emailOrNumber.toLowerCase() ||
        e.phoneNumber == emailOrNumber
    );
    if (!st)
      return toast({
        title: "Invalid Email Or Phone number",
        description: "Enter phone number or email of student",
        variant: "destructive",
      });
    setStudentId(st.id);
    setEmailOrNumber(st.emailAddress);
  };
  const pay = async () => {
    try {
      if (!password)
        return toast({
          title: "Password required",
          description: "Enter password",
          variant: "destructive",
        });
      setLoading(true);
      const res = await Payment({
        studentId,
        payer: payer,
        payerName,
        amount,
        description,
        password,
        payerEmail,
        payerPhone: payerPhoneNumber,
        billReference:billReference,
      });
      setLoading(false);
      const resT = await GetStaffPaymentTransactions()
      if (res.error) throw Error(res.errorMessage);
      if (res.students) setStudent([...res.students]);
      if(resT.error) throw Error(resT.errorMessage);
      if(resT.transactions) setTransactions([...resT.transactions])
      if (res.transactionId) setLastPaymentId(res.transactionId);
      setPassword("");
      setPayer(null);
      setPayerName("");
      setAmount("");
      setStudentId("");
      setRepeatAmount("");
      setEmailOrNumber("");
      setDescription("");
      setPayerEmail("");
      setBillReference("")
      setShowPay(false);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description: error.toString(),
        variant: "destructive",
      });
    }
  };
  return (
    <div className="p-4 flex-1 flex-col-reverse lg:flex-row-reverse flex lg:overflow-y-hidden w-full overflow-y-scroll">
      <div className="gap-y-2 rounded-md w-full lg:w-[300px]  flex flex-col lg:overflow-y-scroll p-2 items-center  dark:bg-gray-900 ">
        <h1>My Recent Payments</h1>
        <hr className="w-full mt-2 mb-2" />
        {transactions.map((t) => (
          <PaymentTransactionCard
            key={t.id}
            transaction={t}
          />
        ))}
      </div>
      <div className="flex flex-col lg:flex-row lg:flex-1 p-2 pt-6 lg:overflow-y-scroll lg:flex-wrap content-start gap-4 lg:h-full">
        <>
          <AlertDialog
            open={showStudents}
            defaultOpen={showStudents}
            onOpenChange={setShowStudents}
          >
            <AlertDialogContent className="h-[80%] flex flex-col p-6">
              <div className="flex justify-center ">
                <h1 className="text-2xl">Choose Student</h1>
              </div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="p-4"
              />
              <hr className="my-2"></hr>
              <div className="flex-1 overflow-y-scroll">
                {students.map((student) => {
                  let validated: boolean;
                  let validateName =
                    student.firstName
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    student.lastName
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    (student.firstName + " " + student.lastName)
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    (student.lastName + " " + student.firstName)
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    student.mother.firstName
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    student.mother.lastName
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    (student.mother.firstName + " " + student.mother.lastName)
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    (student.mother.lastName + " " + student.father.firstName)
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    student.father.firstName
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    student.father.lastName
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    (student.father.firstName + " " + student.father.lastName)
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    (student.father.lastName + " " + student.father.firstName)
                      .toLowerCase()
                      .includes(search.toLowerCase());
                  let validateEmail =
                    student.emailAddress
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    student.mother.emailAddress
                      ?.toLowerCase()
                      .includes(search.toLowerCase()) ||
                    student.father.emailAddress
                      ?.toLowerCase()
                      .includes(search.toLowerCase());
                  let validatePhone =
                    student.phoneNumber?.includes(search) ||
                    student.mother.phoneNumber?.includes(search) ||
                    student.father.phoneNumber?.includes(search);
                  let validateStage = student.class.className
                    .toLowerCase()
                    .includes(search.toLowerCase());
                  validated =
                    (validateName ||
                      validateEmail ||
                      validatePhone ||
                      validateStage) ??
                    false;
                  if (!validated) return <></>;
                  return (
                    <div
                      onClick={() => select(student.id, student.emailAddress)}
                      className="flex border-b p-2 cursor-pointer hover:bg-slate-100 items-center"
                      key={"s-s" + student.id}
                    >
                      <Avatar className="w-[70px] h-[70px] cursor-pointer dark:text-white text-black font-normal text-xl">
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${student?.images[0]?.id}`}
                          alt="profile"
                        />
                        <AvatarFallback>
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="p-2">
                        <div className="capitalize">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="capitalize">
                          {student.class.className}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog
            open={showPay}
            defaultOpen={showPay}
            onOpenChange={setShowPay}
          >
            {!loading ? (
              <AlertDialogContent>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-4 h-10"
                  placeholder="Enter your password"
                  type="password"
                ></Input>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button onClick={pay}>Pay</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            ) : (
              <AlertDialogContent>
                <div className="flex justify-center w-full">
                  <InfinitySpin width="200" color="blue"></InfinitySpin>
                </div>
              </AlertDialogContent>
            )}
          </AlertDialog>
          <Card className="p-4 w-full lg:w-[400px] max-w-full flex flex-col items-center sm:w-[48%]">
            <h1>Student Information</h1>
            <div className="p-3 h-auto flex flex-col gap-y-3 w-full">
              <Input
                value={emailOrNumber}
                onChange={(e) => setEmailOrNumber(e.target.value)}
                type="search"
                className="p-4 h-10"
                placeholder="Student Email Or Phone number"
              ></Input>
              <div className="flex justify-around">
                <Button onClick={validate}>Validate</Button>
                <Button
                  onClick={() => setShowStudents(true)}
                  variant={"outline"}
                >
                  Choose student
                </Button>
              </div>
            </div>
          </Card>
          {studentId && (
            <Card className="p-4 w-full lg:w-[400px] max-w-full flex flex-col items-center sm:w-[48%]">
              <h1>Selected Student</h1>
              {
                <div className="p-3 h-auto flex flex-col gap-y-3 w-full items-center">
                  <Avatar className="w-[100px] h-[100px] cursor-pointer dark:text-white text-black font-normal text-xl">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_DOMAIN}/api/image/${
                        students.find((e) => e.id == studentId)?.images[0]?.id
                      }`}
                      alt="profile"
                    />
                    <AvatarFallback>
                      {students.find((e) => e.id == studentId)?.firstName[0]}
                      {students.find((e) => e.id == studentId)?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="capitalize font-bold text-lg">
                    {students.find((e) => e.id == studentId)?.firstName}{" "}
                    {students.find((e) => e.id == studentId)?.lastName}
                  </div>
                  <div className="capitalize">
                    {students.find((e) => e.id == studentId)?.class.className}
                  </div>
                  <div className="capitalize">
                    Balance{" "}
                    <b className="text-red-500">
                      GH&#8373;{" "}
                      {students.find((e) => e.id == studentId)?.balance}
                    </b>
                  </div>
                </div>
              }
            </Card>
          )}
          <Card className="p-4 w-full lg:w-[400px] sm:w-[48%] max-w-full flex flex-col items-center gap-y-2">
            <h1>Payer Information</h1>
            <div
              className={`p-3 h-auto flex flex-col gap-y-3 w-full ${
                payer && "hidden"
              }`}
            >
              <Input
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                type="search"
                className="p-4 h-10"
                placeholder="Name"
              ></Input>
              <Input
                value={payerPhoneNumber}
                onChange={(e) => setPayerPhoneNumber(e.target.value)}
                type="search"
                className="p-4 h-10"
                placeholder="Phone number"
              ></Input>
              <Input
                value={payerEmail}
                onChange={(e) => setPayerEmail(e.target.value)}
                type="search"
                className="p-4 h-10"
                placeholder="Email"
              ></Input>
            </div>
            <div className="w-full pt-3">
              <div
                className={`flex ${
                  !payer && "flex-wrap"
                } justify-between gap-y-2 ${payer && "flex-col"}`}
              >
                <div className="flex gap-x-3 items-center ">
                  <Checkbox
                    checked={payer === "MOTHER"}
                    onCheckedChange={(e) => change("MOTHER")}
                    className="h-8 w-8 rounded-full"
                  ></Checkbox>
                  <b>Mother</b>
                </div>
                <div className="flex gap-x-3 items-center">
                  <Checkbox
                    checked={payer === "FATHER"}
                    onCheckedChange={(e) => change("FATHER")}
                    className="h-8 w-8 rounded-full"
                  ></Checkbox>
                  <b>Father</b>
                </div>
                <div className="flex gap-x-3 items-center">
                  <Checkbox
                    checked={payer === "GUARDIAN"}
                    onCheckedChange={(e) => change("GUARDIAN")}
                    className="h-8 w-8 rounded-full"
                  ></Checkbox>
                  <b>Guardian</b>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4 w-full lg:w-[400px] max-w-full flex flex-col items-center sm:w-[48%]">
            <h1>Payment Details</h1>
            <div className="p-3 h-auto flex flex-col gap-y-3 w-full">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                className="p-4 h-10"
                placeholder="Amount"
              ></Input>
              <Input
                value={repeatAmount}
                onChange={(e) => setRepeatAmount(e.target.value)}
                type="number"
                className="p-4 h-10"
                placeholder="Repeat Amount"
              ></Input>
              <Input
                value={billReference}
                onChange={(e) => setBillReference(e.target.value)}
                type="number"
                className="p-4 h-10"
                placeholder="Bill reference"
              ></Input>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-4 h-20 resize-none"
                placeholder="Payment Description"
              ></Textarea>
            </div>
          </Card>
          <div className="w-full p-2 flex flex-col ">
            {studentId &&
              amount &&
              amount == repeatAmount &&
              (payer || (payerName && payerPhoneNumber && payerEmail)) &&
              description && <Button onClick={makePayment}>Pay</Button>}
          </div>
        </>
      </div>
    </div>
  );
}

export default PaymentPage;
