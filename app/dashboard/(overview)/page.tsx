import { getSession } from '@/actions/session'
import React from 'react'

async function  Dashboard() {
  const session = await getSession();
  return (
    <div className="p-4">
      
    </div>
  )
}

export default Dashboard