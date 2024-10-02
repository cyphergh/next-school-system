import { Transactions } from '@/actions/finance/transactions'
import React from 'react'
import UI from './ui';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title:"My Transactions",
  description: "",
};
async function Page() {
  const res = await Transactions();
  if(res.error) throw new Error(res.errorMessage);
  return (
    <UI trans={res.transactions??[]} expenses={res.expenses??[]}></UI>
  )
}

export default Page
