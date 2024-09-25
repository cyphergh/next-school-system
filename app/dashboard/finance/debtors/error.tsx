'use client'; // Mark this as a Client Component
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center text-center gap-4">
      <h2 className="text-red-500 font-bold text-2xl">Something went wrong!</h2>
      <p>May be you don{"'"}t have access</p>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => reset()} // Attempt to recover by resetting the error boundary
      >
        Try again
      </button>
    </div>
  );
}