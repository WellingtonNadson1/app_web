'use client'
import { BellIcon } from '@heroicons/react/24/outline'
import { UserCircle } from '@phosphor-icons/react'
import React from 'react'

function HeaderCelulaLoad() {
  return (
    <>
      <nav className="relative mx-2 mt-3 flex items-center justify-between rounded-full bg-white p-1 shadow-none">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between">
          {/* Titile Page */}
          <h1 className="w-28 h-6 animate-pulse px-3 text-xl font-semibold leading-relaxed text-gray-800">
          </h1>
        </div>
        <div className="flex w-1/2 items-center justify-end gap-2 sm:w-1/2 sm:gap-8">
          {/* {session?.user ? ( */}
          <>
            <div>
              <h2 className="w-20 h-6 hidden animate-pulse text-xs text-gray-700 sm:block">
                Shalom,{' '}
                <span className="w-16 h-6 animate-pulse font-bold"></span>
              </h2>
              <p className="w-14 h-6 animate-pulse hidden text-xs text-gray-700 sm:block"></p>
            </div>
            <div className="cursor-pointer">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="w-12 h-6 animate-pulse relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 focus:ring-offset-gray-800"
                >
                  <span className="relative -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}

                <UserCircle
                  size={32}
                  width={40}
                  height={40}
                  weight="thin"
                  className={`rounded-full text-zinc-500 shadow`}
                />

              </div>
            </div>
          </>
        </div>

      </nav>
    </>
  )
}

export default HeaderCelulaLoad
