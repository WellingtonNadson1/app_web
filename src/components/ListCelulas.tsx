import { useSupervisaoContext } from '@/contexts/supervisao/supervisao'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Pagination from './Pagination'
import UpdateCelula from '@/app/(authenticed)/celulas/UpdateCelula'
import UpdateCelula2 from '@/app/(authenticed)/celulas/UpdateCelula2'

export interface ICelula {
  id: string
  nome: string
  lider: {
    id: string
    first_name: string
  }
}

interface ListCelulasProps {
  data: ICelula[]
}

export default function ListCelulas({ data }: ListCelulasProps) {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const router = useRouter()
  const contextParamsSupervisaoId = useSupervisaoContext()

  const handleClickCelula = (event: React.MouseEvent<HTMLElement>) => {
    const idCelula = event.currentTarget.id
    router.push(`/supervisoes/${contextParamsSupervisaoId}/celulas/${idCelula}`)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  // Pagination
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const membersSort = data.sort((a, b) => a.nome.localeCompare(b.nome))
  const displayedCelulas = membersSort?.slice(startIndex, endIndex)

  const calculateCellNumber = (pageIndex: number, index: number) => {
    return (pageIndex - 1) * itemsPerPage + index + 1;
  };

  return (
    <div className="relative w-full p-2 mx-auto">
      <div className="relative w-full py-2 mx-auto">
        <div className="w-full p-4 bg-white rounded-lg shadow-md">
          <div className='flex items-center justify-between gap-3 sm:justify-start'>
            <h2 className="py-6 text-lg font-semibold leading-7 text-gray-700">
              Lista Geral de Células IBB
            </h2>
            <div className='items-center justify-center hidden px-2 py-1 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-blue-50 text-sky-700 ring-blue-600/20 sm:block'>
              <p className='flex items-center justify-between'>Total <span className='px-1 py-1 ml-2 text-white rounded-md bg-sky-700'>{data?.length}</span></p>
            </div>
          </div>
          <div className="p-2">
            <table className="w-full px-2 border-separate table-auto">
              <thead className='bg-[#F8FAFC]'>
                <tr>
                  <th className="px-2 py-3 font-medium text-[#6D8396] text-start">Ord.</th>
                  <th className="px-2 py-3 font-medium text-[#6D8396] text-start">Célula</th>
                  <th className="px-2 py-3 font-medium text-[#6D8396] hidden  text-start sm:block">
                    Líder(es)
                  </th>
                  <th className="px-2 py-3 font-medium text-[#6D8396]">Detalhes</th>
                </tr>
              </thead>
              <tbody className='text-sm font-normal text-gray-700'>
                {displayedCelulas?.map((celula, index) => (
                  <tr
                    className="py-8 border-b border-gray-200 rounded-lg hover:bg-gray-50/90"
                    key={celula.id}
                  >
                    <td className='px-2 py-1 border-b border-gray-200'>
                      <h2 className="pl-2">{calculateCellNumber(currentPage, index)}</h2>
                    </td>
                    <td className='px-2 py-1 border-b border-gray-200'>
                      <h2 className="pl-2">{celula.nome}</h2>
                    </td>
                    <td className="hidden px-2 py-1 text-gray-700 text-start sm:table-cell">
                      {celula.lider?.first_name}
                    </td>
                    <td className='px-2 py-1 border-b border-gray-200'>
                      <div className="flex items-center justify-center gap-2 mx-auto text-center">
                        <button
                          onClick={handleClickCelula}
                          id={celula.id}
                          className="'z-10 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700'"
                        >
                          Acessar
                        </button>
                        {data && (
                          <UpdateCelula2
                            shouldFetch={shouldFetch}
                            id={celula.id}
                          />
                        )}
                        {data && (
                          <UpdateCelula
                            shouldFetch={shouldFetch}
                            celulaId={celula.id}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Use the Pagination component */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((data?.length || 0) / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
