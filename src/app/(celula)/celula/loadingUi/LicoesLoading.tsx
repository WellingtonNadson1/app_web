import { FilePdf } from '@phosphor-icons/react'
import React from 'react'

export default function LicoesLoading() {
  return (
    <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
      <div className="relative flex-col w-full p-4 bg-white rounded-lg shadow-md flex-warp hover:bg-white/95">
        <div className="flex flex-col items-start justify-start mb-3">
          <h1 className="p-2 mb-3 text-lg font-semibold leading-7">
            <div className="w-40 h-5 bg-gray-400 rounded-md animate-pulse"></div>
          </h1>
          <div className="flex flex-col items-start justify-start px-3 py-2 mb-3 rounded-md bg-gray-50">
            <span className="mb-1 text-base">
              <span className="font-semibold">
                <div className="w-40 h-5 bg-gray-400 rounded-md animate-pulse"></div>
              </span>
              <div className="w-56 h-5 mt-1 mb-3 bg-gray-400 rounded-md animate-pulse"></div>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 px-2 py-1 mb-3 sm:grid-cols-2">
          {Array(4).fill(null).map((_, index) => (
            <div key={index} className="rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100/80">
              <div className="p-2 sm:col-span-1">
                <div className="flex items-center justify-between w-full gap-4">
                  <div>
                    <div className="w-40 h-5 mb-1 bg-gray-400 rounded-md animate-pulse"></div>
                    <div className="w-full h-4 bg-gray-400 rounded-md animate-pulse"></div>
                    <div className="flex items-center gap-1 mt-3">
                      <div className="w-40 h-4 bg-gray-400 rounded-md animate-pulse"></div>
                      <div className="w-40 h-4 bg-gray-400 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                  <div className={`h-[4.5rem] rounded-md bg-gray-900 p-2 drop-shadow-md`}>
                    <FilePdf width={24} height={24} color="#fff" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
