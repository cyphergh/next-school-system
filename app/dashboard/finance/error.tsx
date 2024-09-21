'use client' // Error boundaries must be Client Components
 
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error 
  reset: () => void
}) {
  return (
    <div className='flex flex-col w-full h-full gap-8 justify-center  flex-1 items-center text-center'>
      <h2 className='text-xl text-red-500 font-bold'>{error.message}</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  )
}