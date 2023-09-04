import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (newPage: number) => void
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePageClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    pageNumber: number,
  ) => {
    event.preventDefault()
    onPageChange(pageNumber)
  }
  console.log('currentPage', currentPage)
  console.log('totalPages', totalPages)
  const maxPagesToShow = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
if (endPage - startPage + 1 < maxPagesToShow) {
  startPage = Math.max(1, endPage - maxPagesToShow + 1);
}
  
  return (
    <div className="mt-4 flex justify-center">
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center ${
            currentPage === 1
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer'
          } rounded-l-md px-2 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
        >
          <span className="sr-only">Anterior</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        {/* Render page numbers dynamically */}
        {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={(event) => handlePageClick(event, startPage + index)}
            className={`relative inline-flex items-center ${
              startPage + index === currentPage
                ? 'bg-[#1D70B6] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D70B6]'
                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            } cursor-pointer px-4 py-1 text-sm font-semibold`}
          >
            {startPage + index}
          </button>
        ))}
        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center ${
            currentPage === totalPages
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer'
          } rounded-r-md px-2 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
        >
          <span className="sr-only">Próximo</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  )
}

export default Pagination
