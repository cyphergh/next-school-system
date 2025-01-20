import { getSession } from '@/actions/session'
import React from 'react'
import UI from './ui';

async function  Dashboard() {
  const session = await getSession();
  return (
   <UI></UI>
  )
}

export default Dashboard