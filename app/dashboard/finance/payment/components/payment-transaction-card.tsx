"use client";
import { CompleteTransactionType } from "@/types";
import React, { useRef } from "react";
import { FiPrinter } from "react-icons/fi";
import { IoCopyOutline } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import logo from "@/public/logo.png";
import gesLogo from "@/public/ges.png";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import QRCode from "react-qr-code";
function PaymentTransactionCard({
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
      <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center flex-1 w-full">
          <div className="flex flex-col gap-y-1 w-full">
            <div className=" font-semibold text-[12px] capitalize">
              {transaction.payerName}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mode: {transaction.transactionMode}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-bold">
              Amount: {transaction.currency} {transaction.amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Status: {transaction.status}
            </p>
            <div className=" font-semibold text-[12px] capitalize">Student</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {transaction.student?.firstName} {transaction.student?.lastName}
            </p>

            <div className=" font-semibold text-[12px] capitalize">
              Date and time
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Date: {new Date(transaction.transactionDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              TIme: {new Date(transaction.transactionDate).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <p className="text-sm border select-text  p-2 border-fuchsia-200 rounded-md  w-full flex flex-col">
          {transaction.id}
          <div className="flex justify-between">
            <IoCopyOutline
              onClick={() => {
                navigator.clipboard
                  .writeText(transaction.id)
                  .then(() => {
                    alert("Transaction id copied to clipboard!");
                  })
                  .catch((err) => {
                    alert("Failed to copy transaction id " + err);
                  });
              }}
              className="mt-2 cursor-pointer"
              size={25}
            ></IoCopyOutline>
            <FiPrinter
              onClick={handlePrint}
              size={25}
              className="mt-2 cursor-pointer"
            />
          </div>
        </p>
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

export default PaymentTransactionCard;
