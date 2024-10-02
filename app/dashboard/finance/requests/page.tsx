import { GetTransactionRequests } from '@/actions/finance/requests'
import React from 'react'
import UI from './ui';

async function Page() {
    const res = await GetTransactionRequests();
    if(res.error) throw Error(res.errorMessage)
  return (
    <UI requests={res.requests??[]}></UI>
  )
}

export default Page