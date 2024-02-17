'use client'
import React from 'react'

function HeaderCelulaDiscipuladosLoad() {
  return (
    <>
      <nav className="relative flex items-center justify-between h-12 p-1 mx-2 mt-3 bg-white rounded-full shadow-none">
        {/* Title Header */}
        <div className="flex flex-wrap items-center justify-start w-full gap-2 mx-auto ml-2 animate-pulse">
          <div className="w-8 h-4 px-3 bg-gray-400 rounded"></div>
          <div className="w-10 h-4 px-3 bg-gray-400 rounded"></div>
        </div>
        {/* Welcome Text */}
        <div className="flex items-center justify-end w-1/2 gap-2 animate-pulse sm:w-1/2 sm:gap-8">
          <>
            <div className="flex flex-col justify-start gap-2">
              <div className="hidden w-20 h-3 bg-gray-400 rounded sm:block"></div>
              <div className="hidden h-3 bg-gray-400 rounded w-14 sm:block"></div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-8 h-8 bg-gray-400 rounded-full cursor-pointer"></div>
              {/* Profile dropdown */}
              <div className={`cursor-pointer w-8 h-8 rounded-full bg-gray-400 shadow`}></div>
            </div>

          </>
        </div>
      </nav>
    </>
  )
}

export default HeaderCelulaDiscipuladosLoad
