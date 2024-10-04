'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { FaPlus, FaSync } from 'react-icons/fa'
import NewNoteDialog from './new_note'
import { Note, Topic } from '@/types'
import { GetNotes } from '@/actions/academics/class/note/get_note'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import UpdateNoteCard from './update_note'

function UI({t,n}:{t:Topic,n:Note[]}) {
  const [notes,setNotes] = useState(n)
  const [showNew,setShowNew] = useState(false)
  const [refreshing,setRefreshing] = useState(false)
  const [search,setSearch] = useState("")
  const { toast } = useToast();

  const reload = async () =>{
    setRefreshing(true)
    try {
        const res =await GetNotes({topicId:t.id})
        setRefreshing(false)
        if(res.error) return toast({
            title: res.errorMessage,
            variant: "destructive",
            action: <ToastAction altText="Ok">Ok</ToastAction>,
          });
        setNotes(res.notes);
    } catch (error) {
        setRefreshing(false)
        return toast({
            title: "Connection failed",
            variant: "destructive",
            action: <ToastAction altText="Ok">Ok</ToastAction>,
          });
    }
  }
  return (
    <>
    <div className='flex flex-1 flex-col overflow-y-scroll sm:overflow-hidden p-2'>
        <div className='w-full p-3 text-center capitalize font-bold text-2xl'>{t.title}</div>
      <Card  className="p-2 flex w-full items-center gap-x-2 flex-row mt-1">
        <FaSync className={`cursor-pointer ${refreshing && "animate-spin"}`} onClick={reload} size={25}></FaSync>
        <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search"></Input>
        <Button onClick={()=>setShowNew(true)} className='flex items-center gap-x-1'><FaPlus></FaPlus> Add</Button>
      </Card>
    {!notes.length && (
          <div className=" flex flex-col flex-1 items-center justify-center font-bold text-2xl">
            No note added
          </div>
    )}
    <div className=' sm:flex sm:flex-row sm:flex-wrap sm:overflow-y-scroll sm:flex-1 content-start p-3 gap-2 '>
        {notes.filter((e)=>e.title.toLowerCase().includes(search)).map((e)=>{
            return <UpdateNoteCard setNotes={setNotes} key={e.id+e.updatedAt.toString()} e={e}></UpdateNoteCard>
        })}
    </div>
    </div>

    <NewNoteDialog setNotes={setNotes} topic={t} show={showNew} setShow={setShowNew}></NewNoteDialog>
    </>
  )
}

export default UI
