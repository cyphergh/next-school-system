import prisma from "@/prisma/db";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import BillPrintBar, { PaymentPrintBar } from "./print_bar";
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
let mainId: string;
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;
  mainId = id;
  // fetch data
  const trans = await prisma.transaction.findFirst({
    where: {
      id: id,
      status:{
        not:"CANCELED"
      }
    },
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title:
      trans?.transactionType + " GH\u20B5 " + trans?.amount ??
      "Transaction Not Found",
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return notFound();
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: params.id,
      status:{
        not:"CANCELED"
      }
    },
    include: {
      bill: {
        include: {
          items: true,
        },
      },
      Father: true,
      Mother: true,
      edBill: {
        include: {
          billItems: true,
        },
      },
      staff: true,
      term: true,
      student: {
        include: {
          class: true,
        },
      },
      cancelationRequest: true,
    },
  });
  if (!transaction) return notFound();
  return (
    <div className="p-6  flex-1 overflow-y-scroll ">
      <div className="flex flex-col justify-between items-start w-full">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Transaction Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          ID: {transaction.id}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Date: {transaction.createdAt.toLocaleDateString()}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Time: {transaction.createdAt.toLocaleTimeString()}
        </p>
        <p className="text-red-400 text-lg">
          <b>Amount</b>: GH&#8373; {transaction.amount.toFixed(2)}
        </p>
      </div>
      {transaction.transactionType === "PAYMENT" && (
        <PaymentPrintBar transaction={transaction}></PaymentPrintBar>
      )}
      
      {transaction.transactionType === "BILL" && (
        <BillPrintBar transaction={transaction}></BillPrintBar>
      )}
      
      {/* Transaction Information */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 gap-4 w-full">
        {transaction.transactionType === "PAYMENT" && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Payer Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Name: {transaction.payerName}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Email: {transaction.payerEmail}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Phone: {transaction.payerPhoneNumber}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Staff Information
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Name: {transaction.staff?.firstName} {transaction.staff?.lastName}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Email: {transaction.staff?.emailAddress}
          </p>
        </div>

        {transaction.student && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Student Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Name: {transaction.student?.firstName}{" "}
              {transaction.student?.lastName}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Class: {transaction.student?.class?.className}
            </p>
          </div>
        )}



        {transaction.Mother && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Mother{"'"}s Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Name: {transaction.Mother?.firstName}{" "}
              {transaction.Mother?.lastName}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Phone: {transaction.Mother?.phoneNumber}
            </p>
          </div>
        )}

        {transaction.Father && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Father{"'"}s Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Name: {transaction.Father?.firstName}{" "}
              {transaction.Father?.lastName}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Phone: {transaction.Father?.phoneNumber}
            </p>
          </div>
        )}

{transaction.bill && (
        <div className="">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Bill Information
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Title: {transaction.bill?.title}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Amount: &#8373;{transaction.bill?.amount}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Payed Amount: &#8373;{transaction.bill?.payedAmount}
          </p>
          
        </div>
      )}
      </div>

      {/* Bill Information */}
      {
        transaction.bill && <div className="mt-4 overflow-x-scroll w-full">
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
      }

      {/* EDBill Information */}
      {transaction.edBill && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            EDBill Information
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Title: {transaction.edBill?.title}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Amount: &#8373;{transaction.edBill?.amount}
          </p>
          <div className="mt-4 overflow-x-scroll">
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
    </div>
  );
}
