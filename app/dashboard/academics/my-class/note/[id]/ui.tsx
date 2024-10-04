'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {  Topic } from '@prisma/client'
import React, { useState } from 'react'
import { FaPlus, FaSync } from 'react-icons/fa'
import NewNoteDialog from './new_note'
import { Note } from '@/types'

function UI({t,n}:{t:Topic,n:Note[]}) {
  const [showNew,setShowNew] = useState(false)
  return (
    <>
    <div className='flex-1 p-1 flex flex-col overflow-x-hidden overflow-y-scroll sm:overflow-y-hidden'>
        <div className='w-full p-3 text-center capitalize font-bold text-2xl'>{t.title}</div>
      <Card className="p-2 flex w-full items-center gap-x-2 flex-row mt-1">
        <FaSync></FaSync>
        <Input placeholder="Search"></Input>
        <Button onClick={()=>setShowNew(true)} className='flex items-center gap-x-1'><FaPlus></FaPlus> Add</Button>
      </Card>
    </div>
    <NewNoteDialog show={showNew} setShow={setShowNew}></NewNoteDialog>
    </>
  )
}

export default UI
