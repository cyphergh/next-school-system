import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React from 'react'
import { IoRefreshCircle } from 'react-icons/io5'

function TopComponent() {
  return (
    <Card className='w-full flex flex-col sm:flex-row gap-4 p-4'>
        <Input className='w-full p-4' placeholder='Name'></Input>
        <Input className='w-full p-4' placeholder='Email'></Input>
       <div className='flex flex-row w-full'>
        <Input  className='w-full p-4' placeholder='Contact'></Input>
        <IoRefreshCircle size={38}></IoRefreshCircle>
       </div>
    </Card>
  )
}

export default TopComponent