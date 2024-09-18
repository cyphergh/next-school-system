import React from 'react'
import TopComponent from './top-component'
import Image from 'next/image'
import Logo from "@/public/logo.png"
function StaffListLoading() {
  return (
    <div className='p-4 flex-1 flex flex-col overflow-y-scroll'>
      <TopComponent></TopComponent>
      <div className='flex-1 flex justify-center items-center'>
          <Image src={Logo} alt='logo' className='w-[200px] animate-bounce'></Image>
      </div>
    </div>
  )
}

export default StaffListLoading