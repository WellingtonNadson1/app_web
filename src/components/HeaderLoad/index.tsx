'use client'
import React from 'react'

function HeaderLoad() {
  return (
    <>
      <nav className="relative mx-2 mt-3 flex h-12 items-center justify-between rounded-full bg-white p-1 shadow-none">
          {/* Title Header */}
        <div className="animate-pulse ml-2 mx-auto flex w-full flex-wrap items-center justify-start gap-2">
          <div className="w-8 h-4 px-3 rounded bg-gray-400"></div>
          <div className="w-10 h-4 px-3 rounded bg-gray-400"></div>
        </div>
          {/* Welcome Text */}
        <div className="animate-pulse flex w-1/2 items-center justify-end gap-2 sm:w-1/2 sm:gap-8">
          <>
            <div className="flex flex-col gap-2 justify-start">
              <div className="w-20 h-3 hidden rounded bg-gray-400 sm:block"></div>
              <div className="w-14 h-3 hidden rounded bg-gray-400 sm:block"></div>
            </div>

              <div className="flex items-center gap-4">
                <div className="cursor-pointer w-8 h-8 relative rounded-full bg-gray-400"></div>
                {/* Profile dropdown */}
                <div className={`cursor-pointer w-8 h-8 rounded-full bg-gray-400 shadow`}></div>
              </div>

          </>
        </div>
      </nav>
    </>
  )
}

export default HeaderLoad
