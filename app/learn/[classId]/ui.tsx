'use client'
import { Input } from '@/components/ui/input';
import { Topic } from '@prisma/client';
import Link from 'next/link';
import React, { useState } from 'react'

function UI({topics}:{topics:Topic[]}) {
    const [search,setSearch] = useState("");
  return (
      <>
      <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Search...'></Input>
      {topics.filter((e)=>e.title.toLowerCase().includes(search.toLowerCase())).map((c) => {
          return (
              <Link href={"../notes/"+c.id} className="border p-4 block rounded-lg w-full h-[60px] sm:w-auto m-1" key={c.id}>
            <div className="font-bold capitalize">{c.title}</div>
            <div className='capitalize text-red-600'>{c.id}</div>
          </Link>
        );
    })}
    </>
  )
}

export default UI
