'use client' // Error boundaries must be Client Components
 
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='flex flex-col w-full h-full gap-8 justify-center   items-center text-center  fixed'>
      <h2 className='text-xl text-red-500 font-bold'>{error.message}</h2>
      <p>Refresh page to try again</p>
    </div>
  )
}