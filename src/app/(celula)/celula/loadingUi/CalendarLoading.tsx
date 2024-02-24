import React from 'react'

export default function CalendarLoading() {
  return (
    <div className="pt-4">
      <div className="px-2 py-6 bg-white rounded-lg shadow-md">
        <div className="max-w-md px-4 mx-auto sm:px-4 md:max-w-4xl md:px-6">
          <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
            <div className="md:pr-10">
              <div className="flex items-center mb-6">
                <h2 className="flex-auto font-semibold text-gray-900 capitalize">
                  <div className="w-40 h-5 bg-gray-400 rounded-md animate-pulse"></div>
                </h2>
                {/* Replace buttons with loading indicators */}
                {/* <div className="w-8 h-8 mx-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-400 rounded-full animate-pulse"></div> */}
              </div>
              <div className="grid grid-cols-7 text-xs leading-6 text-center text-gray-500 mt-9">
                <div>D</div>
                <div>S</div>
                <div>T</div>
                <div>Q</div>
                <div>Q</div>
                <div>S</div>
                <div>S</div>
              </div>
              <div className="grid grid-cols-7 mt-2">
                {Array(42).fill(null).map((_, dayIdx) => (
                  <div key={dayIdx} className="py-1">
                    <div className="w-8 h-8 bg-gray-400 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            {/* Section for Events Day */}
            <section className="mt-12 md:mt-0 md:pl-14">
              <h2 className="font-semibold text-gray-900">
                Agenda para{' '}
                <div className="w-24 h-5 bg-gray-400 rounded-md animate-pulse"></div>
              </h2>
              <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                <div className="w-full h-4 bg-gray-400 rounded-md animate-pulse"></div>
                <div className="w-full h-4 bg-gray-400 rounded-md animate-pulse"></div>
                <div className="w-full h-4 bg-gray-400 rounded-md animate-pulse"></div>
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
