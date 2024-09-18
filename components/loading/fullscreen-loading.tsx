'use client'
import {InfinitySpin} from "react-loader-spinner"
function FullScreenLoading() {
  return (
    <div className="fixed z-50 top-0 left-0 h-full w-full flex flex-col items-center justify-center bg-white dark:bg-black">
<InfinitySpin
  width="200"
  color="blue"
  />
  <p>Please wait...</p>
    </div>
  )
}

export default FullScreenLoading