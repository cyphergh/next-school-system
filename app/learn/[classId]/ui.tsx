import { Topic } from '@/types'
import Link from 'next/link';
import React from 'react'

function UI({topics}:{topics:Topic[]}) {
  return (
      <>
      {topics.map((c) => {
          return (
              <Link href={"notes/"+c.id} className="border p-4 block rounded-lg w-full h-[120px] sm:w-auto m-1" key={c.id}>
            <div className="font-bold capitalize">{c.title}</div>
            <div className="">Available notes {c.notes.length}</div>
            <div className='capitalize text-red-600'>{c.term.name}</div>
          </Link>
        );
    })}
    </>
  )
}

export default UI
