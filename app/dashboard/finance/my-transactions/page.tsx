import { Transactions } from '@/actions/finance/transactions'
import React from 'react'
import UI from './ui';

async function Page() {
  const res = await Transactions();
  if(res.error) throw new Error(res.errorMessage);
  return (
    <UI trans={res.transactions??[]} expenses={res.expenses??[]}></UI>
  )
}

export default Page
