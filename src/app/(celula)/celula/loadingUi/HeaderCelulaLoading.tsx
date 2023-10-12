'use client'
import { BellIcon } from '@heroicons/react/24/outline'
import { UserCircle } from '@phosphor-icons/react'
import React from 'react'

function HeaderCelulaLoad() {
  return (
    <>
      <nav className="relative mx-2 mt-3 flex items-center justify-between rounded-full bg-white p-1 shadow-none">
        <div className="animate-pulse mx-auto flex w-full flex-wrap items-center justify-start gap-3">
          <div className="w-4 h-4 px-3 rounded bg-gray-400"></div>
          <div className="w-6 h-4 px-3 rounded bg-gray-400"></div>
        </div>
        <div className="animate-pulse flex w-1/2 items-center justify-end gap-2 sm:w-1/2 sm:gap-8">
          <>
            <div>
              <div className="w-20 h-4 hidden rounded bg-gray-400 sm:block">

                <div className="w-14 h-4 rounded bg-gray-400"></div>
              </div>
              <div className="w-14 h-4 hidden rounded bg-gray-400 sm:block"></div>
            </div>
            <div className="cursor-pointer">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-4 relative rounded-full bg-gray-400"
                >
                  <span className="relative -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-4 w-6" aria-hidden="true" />
                </div>
                {/* Profile dropdown */}
                <div className={`rounded-full bg-gray-400 shadow`}></div>
              </div>
            </div>
          </>
        </div>
      </nav>
    </>
  )
}

export default HeaderCelulaLoad
