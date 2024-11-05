'use client'

import { Card } from "@/components/ui/card"

export default function LicoesCelulaSkeleton() {
  return (
    <Card className="bg-white relative w-full px-2 mx-auto mb-4 animate-pulse">
      <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
        <div className="relative flex-col w-full p-4 bg-white rounded-lg flex-warp">
          <div className="flex flex-col items-start justify-start mb-3">
            <div className="h-7 w-24 bg-gray-200 rounded mb-3"></div>
            <div className="flex flex-col items-start justify-start px-3 py-2 mb-3 rounded-md bg-gray-50 w-full">
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-1"></div>
              <div className="h-6 w-full bg-gray-200 rounded mb-3"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 px-2 py-1 mb-3 sm:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="rounded-md p-1 bg-gray-50">
                <div className="p-2 sm:col-span-1">
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="w-full">
                      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-[4.5rem] w-[4.5rem] rounded-md bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
