"use client";
import { NewExpenditure } from "@/actions/finance/new-expense";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import React from "react";
import { FaDollarSign, FaFileInvoiceDollar } from "react-icons/fa";
import { InfinitySpin } from "react-loader-spinner";

function UI() {
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [recipient, setRecipient] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const { toast } = useToast();
  const submit = async () => {
    if (!amount)
      return toast({
        title: "Amount required",
        description: "Enter amount to pay",
        variant: "destructive",
      });
    if (isNaN(parseInt(amount)))
      return toast({
        title: "Amount required",
        description: "Enter correct amount",
        variant: "destructive",
      });
    if (!description)
      return toast({
        title: "Description required",
        description: "Enter description",
        variant: "destructive",
      });
    if (!recipient)
      return toast({
        title: "Recipient required",
        description: "Enter recipient",
        variant: "destructive",
      });
    if (!phoneNumber)
      return toast({
        title: "Phone number required",
        description: "Enter recipient phone number",
        variant: "destructive",
      });
    setShowConfirmation(true);
  };
  const finalizeExpenditure = async () => {
    if(!password) return toast({
      title: "Password required",
      description: "Enter password",
      variant: "destructive",
    })
    try {
      setLoading(true);
      const res = await NewExpenditure({
        amount: parseInt(amount),
        description,
        recipientName: recipient,
        recipientPhoneNumber: phoneNumber,
        password,
      });
      if (res.error)
        return toast({
          title: res.errorMessage,
          description: "Please try again",
          variant: "destructive",
        });
      toast({
        title: "Success",
        description: "Expenditure added successfully",
        variant: "default",
      });
      setAmount("");
      setDescription("");
      setRecipient("");
      setPhoneNumber("");
      setShowConfirmation(false);
      setLoading(false);
      setPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex flex-1 p-6 overflow-hidden">
      <div className="flex-1 flex flex-col w-full items-center justify-center transition-colors overflow-scroll">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {
            <>
              <AlertDialog
                open={showConfirmation}
                defaultOpen={showConfirmation}
                onOpenChange={setShowConfirmation}
              >
               { loading? <AlertDialogContent className="flex justify-center items-center p-10"><InfinitySpin color="red" /></AlertDialogContent> :<AlertDialogContent>
                  <AlertDialogHeader>Confirm password</AlertDialogHeader>
                  <div>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="Enter your password"
                    ></Input>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <Button onClick={finalizeExpenditure}>Continue</Button>
                  </AlertDialogFooter>
                </AlertDialogContent>}
              </AlertDialog>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                <FaFileInvoiceDollar className="inline-block mr-2" />
                Expenditure Form
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                  <span className="px-3 bg-gray-200 dark:bg-gray-700 border-r dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    <FaDollarSign />
                  </span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    id="amount"
                    className="w-full py-2 px-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  id="description"
                  className="w-full py-2 px-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter description"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                  htmlFor="recipient"
                >
                  Recipient Name
                </label>
                <input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  type="text"
                  id="recipient"
                  className="w-full py-2 px-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter Name Of Recipient"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                  htmlFor="phoneNumber"
                >
                  Recipient Phone Number
                </label>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="text"
                  id="phoneNumber"
                  className="w-full py-2 px-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter Phone number Of Recipient"
                />
              </div>

              <div>
                <Button type="submit" onClick={submit}>
                  Submit
                </Button>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default UI;
