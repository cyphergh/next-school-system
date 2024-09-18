import { Transactions } from '@/actions/finance/transactions'
import React from 'react'
import UI from './ui';

async function Page() {
  const res = await Transactions();
  if(res.error) throw new Error(res.errorMessage);
  if(!res.transactions) throw new Error("No transactions found");

  return (
    <UI></UI>
  )
}

export default Page
