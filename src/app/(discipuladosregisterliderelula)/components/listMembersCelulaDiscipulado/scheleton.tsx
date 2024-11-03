
export default function Scheleton() {
  return (
    <div className="relative w-full px-2 py-2 mx-auto bg-gray-100 shadow-md rounded-xl">
      <div className="w-full px-2 py-2 ">
        <div className="w-full px-1 py-2 rounded-md">
          <div className="flex items-center justify-start gap-1 mb-6 sm:mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-200 rounded-md"></div>
          </div>
          <div className="flex flex-col gap-4 mb-4 sm:mb-3 sm:flex sm:flex-row sm:items-start sm:justify-between">
            {/* 1º Discipulado */}
            <div className="sm:w-full sm:gap-2 sm:flex sm:flex-col sm:items-center sm:justify-between">
              <div className="w-full h-24 bg-gray-200 rounded-md animate-pulse"></div>
            </div>

            {/* 2º Discipulado */}
            <div className="sm:w-full sm:gap-2 sm:flex sm:flex-col sm:items-center sm:justify-between">
              <div className="w-full h-24 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
