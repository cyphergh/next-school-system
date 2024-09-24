'use client'
import React from 'react'
import { FiMessageCircle, FiPrinter } from 'react-icons/fi'

export function PaymentPrintBar() {
  return (
    <div className='flex p-4 flex-row gap-3'> 
      <FiPrinter size={35}></FiPrinter>
      <FiMessageCircle size={35}></FiMessageCircle>
    </div>
  )
}

