"use client";
import { CompleteTransactionType } from "@/types";
import React, { useRef } from "react";
import { FiMessageCircle, FiPrinter } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import logo from "@/public/logo.png";
import gesLogo from "@/public/ges.png";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import QRCode from "react-qr-code";
export function PaymentPrintBar({
  transaction,
}: {
  transaction: CompleteTransactionType;
}) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  return (
    <>
      <div className="flex p-4 flex-row gap-3">
        <FiPrinter
          onClick={handlePrint}
          size={35}
          className="cursor-pointer"
        ></FiPrinter>
      </div>
      <div className="hidden">
        <div
          ref={printRef}
          className="w-[215mm]  h-[278mm] overflow-hidden p-2 flex flex-col justify-between"
        >
          <div className="w-full h-[142mm] rounded-sm">
            <div className="bg-gradient-to-r from-blue-900 to-blue-500 p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    className="h-[80px] w-[80px] mr-4"
                    src={logo}
                    alt="logo"
                  ></Image>
                  <div>
                    <h1 className="text-white text-2xl font-bold">
                      {process.env.NEXT_PUBLIC_SCHOOL}
                    </h1>
                    <h1 className="text-white text-lg font-bold">
                      Ghana Education Service
                    </h1>
                    <p className="text-blue-100">
                      {process.env.NEXT_PUBLIC_DOMAIN}
                    </p>
                    <p className="text-blue-100">
                      {process.env.NEXT_PUBLIC_SCHOOL_SLOGAN}
                    </p>
                  </div>
                </div>
                <div className="text-right text-white">
                  <p>{process.env.NEXT_PUBLIC_SCHOOL_LOCATION}</p>
                  <p>{process.env.NEXT_PUBLIC_SCHOOL_CONTACT}</p>
                  <p>{process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</p>
                  <p>Ref:: {transaction.ref}</p>
                  <p>Bill Ref:: {transaction.billRef}</p>
                </div>
              </div>
            </div>
            <div className="w-full flex text-2xl font-mono p-2 text-center justify-center items-center">
              <h1>Payment Receipt</h1>
            </div>
            <div className="flex w-full justify-around">
              <div className="flex flex-col">
                <div className="border-b p-2">
                  <h1>Payer Details</h1>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Name</div>
                  <div className="capitalize">{transaction.payerName}</div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Email</div>
                  <div className="lowercase">{transaction.payerEmail}</div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Phone</div>
                  <div className="capitalize">
                    {transaction.payerPhoneNumber}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Mode</div>
                  <div className="capitalize">
                    {transaction.transactionMode}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="border-b p-2">
                  <h1>Payment Details</h1>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Amount</div>
                  <div className="font-bold">
                    GH&#8373; {transaction.amount.toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Balance</div>
                  <div className="">
                    GH&#8373; {transaction.previousBalance.toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Phone</div>
                  <div className="capitalize">
                    {transaction.payerPhoneNumber}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Date</div>
                  <div className="capitalize">
                    {transaction.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 pt-8 flex items-center justify-around">
              <QRCode
                className="w-[100px] h-[100px]"
                value={
                  process.env.NEXT_PUBLIC_DOMAIN +
                  "/transaction/" +
                  transaction.id
                }
              ></QRCode>
              <div>
                <div className="flex gap-x-2">
                  <div className="w-[200px]">Accountant</div>
                  <div className="capitalize">
                    {transaction.staff?.firstName} {transaction.staff?.lastName}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[200px]">Email</div>
                  <div className="lowercase">
                    {transaction.staff?.emailAddress}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[200px]">Phone number</div>
                  <div className="capitalize">
                    {transaction.staff?.phoneNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-b-4 border-dashed"></div>
          <div className="w-full h-[142mm] rounded-sm">
            <div className="bg-gradient-to-r p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    className="h-[80px] w-[80px] mr-4"
                    src={logo}
                    alt="logo"
                  ></Image>
                  <div>
                    <h1 className=" text-2xl font-bold">
                      {process.env.NEXT_PUBLIC_SCHOOL}
                    </h1>
                    <h1 className="text-lg font-bold">
                      Ghana Education Service
                    </h1>
                    <p className="">{process.env.NEXT_PUBLIC_DOMAIN}</p>
                    <p className="">{process.env.NEXT_PUBLIC_SCHOOL_SLOGAN}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p>{process.env.NEXT_PUBLIC_SCHOOL_LOCATION}</p>
                  <p>{process.env.NEXT_PUBLIC_SCHOOL_CONTACT}</p>
                  <p>{process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</p>
                  <p>Ref:: {transaction.ref}</p>
                  <p>Bill Ref:: {transaction.billRef}</p>
                </div>
              </div>
            </div>
            <div className="w-full flex text-2xl font-mono p-2 text-center justify-center items-center">
              <h1>Payment Receipt</h1>
            </div>
            <div className="flex w-full justify-around">
              <div className="flex flex-col">
                <div className="border-b p-2">
                  <h1>Payer Details</h1>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Name</div>
                  <div className="capitalize">{transaction.payerName}</div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Email</div>
                  <div className="lowercase">{transaction.payerEmail}</div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Phone</div>
                  <div className="capitalize">
                    {transaction.payerPhoneNumber}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Mode</div>
                  <div className="capitalize">
                    {transaction.transactionMode}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="border-b p-2">
                  <h1>Payment Details</h1>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Amount</div>
                  <div className="font-bold">
                    GH&#8373; {transaction.amount.toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Balance</div>
                  <div className="">
                    GH&#8373; {transaction.previousBalance.toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Phone</div>
                  <div className="capitalize">
                    {transaction.payerPhoneNumber}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[100px]">Date</div>
                  <div className="capitalize">
                    {transaction.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 pt-8 flex items-center justify-around">
              <QRCode
                className="w-[100px] h-[100px]"
                value={
                  process.env.NEXT_PUBLIC_DOMAIN +
                  "/transaction/" +
                  transaction.id
                }
              ></QRCode>
              <div>
                <div className="flex gap-x-2">
                  <div className="w-[200px]">Accountant</div>
                  <div className="capitalize">
                    {transaction.staff?.firstName} {transaction.staff?.lastName}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[200px]">Email</div>
                  <div className="lowercase">
                    {transaction.staff?.emailAddress}
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <div className="w-[200px]">Phone number</div>
                  <div className="capitalize">
                    {transaction.staff?.phoneNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BillPrintBar({transaction}:{transaction:CompleteTransactionType}) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  return <>
  <div className="flex p-4 flex-row gap-3">
    <FiPrinter
      onClick={handlePrint}
      size={35}
      className="cursor-pointer"
    ></FiPrinter>
  </div>
  <div className="hidden">
    <div
      ref={printRef}
      className="w-[215mm]  h-[278mm] overflow-hidden p-2 flex flex-col justify-between"
    >
      <div className="w-full h-[142mm] rounded-sm">
        <div className="bg-gradient-to-r from-blue-900 to-blue-500 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                className="h-[80px] w-[80px] mr-4"
                src={logo}
                alt="logo"
              ></Image>
              <div>
                <h1 className="text-white text-2xl font-bold">
                  {process.env.NEXT_PUBLIC_SCHOOL}
                </h1>
                <h1 className="text-white text-lg font-bold">
                  Ghana Education Service
                </h1>
                <p className="text-blue-100">
                  {process.env.NEXT_PUBLIC_DOMAIN}
                </p>
                <p className="text-blue-100">
                  {process.env.NEXT_PUBLIC_SCHOOL_SLOGAN}
                </p>
              </div>
            </div>
            <div className="text-right text-white">
              <p>{process.env.NEXT_PUBLIC_SCHOOL_LOCATION}</p>
              <p>{process.env.NEXT_PUBLIC_SCHOOL_CONTACT}</p>
              <p>{process.env.NEXT_PUBLIC_SCHOOL_EMAIL}</p>
              <p>Ref:: {transaction.ref}</p>
              <p>Bill Ref:: {transaction.billRef}</p>
            </div>
          </div>
        </div>
        <div className="w-full flex text-4xl font-mono p-2 text-center justify-center items-center">
          <h1>Student Bill</h1>
        </div>
        <div className="text-xl font-thin italic text-center">
          <p>{transaction.bill?.title}</p>
          <p>{transaction.edBill?.title}</p>
        </div>
        <div className="flex w-full justify-around">
          <div className="flex flex-col">
            <div className="border-b p-2">
              <h1>Student Details</h1>
            </div>
            <div className="flex gap-x-2">
              <div className="w-[100px]">Name</div>
              <div className="capitalize font-bold">{transaction.student?.firstName} {transaction.student?.firstName}</div>
            </div>
            <div className="flex gap-x-2">
              <div className="w-[100px]">Email</div>
              <div className="lowercase">{transaction.student?.emailAddress}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="border-b p-2">
              <h1>Bill Details</h1>
            </div>
            <div className="flex gap-x-2">
              <div className="w-[100px]">Amount</div>
              <div className="font-bold">
                GH&#8373; {transaction.amount.toFixed(2)}
              </div>
            </div> 
            <div className="flex gap-x-2">
              <div className="w-[100px]">Date</div>
              <div className="capitalize">
                {transaction.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        {transaction.bill && (
        <div className="mt-6 p-4">

          <div className="mt-4 w-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {transaction.bill?.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      &#8373;{item.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      &#8373;{(item.amount * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDBill Information */}
      {transaction.edBill && (
        <div className="mt-6 w-full">

          <div className="mt-4 w-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {transaction.edBill?.billItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      &#8373;{item.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      &#8373;{(item.amount * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        <div className="p-4 pt-8 flex items-center justify-around">
          <QRCode
            className="w-[100px] h-[100px]"
            value={
              process.env.NEXT_PUBLIC_DOMAIN +
              "/transaction/" +
              transaction.id
            }
          ></QRCode>
          <div>
            <div className="flex gap-x-2">
              <div className="w-[200px]">Accountant</div>
              <div className="capitalize">
                {transaction.staff?.firstName} {transaction.staff?.lastName}
              </div>
            </div>
            <div className="flex gap-x-2">
              <div className="w-[200px]">Email</div>
              <div className="lowercase">
                {transaction.staff?.emailAddress}
              </div>
            </div>
            <div className="flex gap-x-2">
              <div className="w-[200px]">Phone number</div>
              <div className="capitalize">
                {transaction.staff?.phoneNumber}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b-4 border-dashed"></div>
      
    </div>
  </div>
</>
}
