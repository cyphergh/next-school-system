'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Subject } from '@/types'
import { Prisma } from '@prisma/client'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'

function UI({subjects}:{subjects:Subject[]}) {
    const [search,setSearch] = useState("");
  return (
    <div className='flex flex-col overflow-y-scroll sm:overflow-hidden p-2'>
        <Card className='w-full p-4'>
            <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Search for subject'></Input>
        </Card>
        <div className='flex flex-col sm:flex-1 sm:overflow-y-scroll sm:flex-row sm:flex-wrap gap-2 p-3'>
            {
                subjects.filter((e)=>(e.class.className+" "+e.name).toLowerCase().includes(search.toLowerCase())).map((e)=>{
                    return <Link className="rounded-md w-full sm:w-[300px] p-4 flex flex-col justify-between  shadow-md cursor-pointer hover:border hover:border-blue-400 border" href={"./my-class/"+e.id} key={e.id}>
                        <div className='capitalize font-bold font-mono'>{e.class.className}</div>
                        <div className='capitalize'>{e.name}</div>
                    </Link>
                })
            }
        </div>
    </div>
  )
}

export default UI