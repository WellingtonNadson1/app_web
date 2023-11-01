import { useSupervisaoContext } from '@/contexts/supervisao/supervisao'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Pagination from './Pagination'
import UpdateCelula from '@/app/(authenticed)/celulas/UpdateCelula'
import UpdateCelulas2 from '@/app/(authenticed)/celulas/UpdateCelula2'
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
  const displayedCelulas = data?.slice(startIndex, endIndex)

  const calculateCellNumber = (pageIndex: number, index: number) => {
    return (pageIndex - 1) * itemsPerPage + index + 1;
  };

  return (
      <div className="relative w-full p-2 mx-auto">
        <div className="relative w-full py-2 mx-auto">
          <div className="w-full p-4 bg-white rounded-lg shadow-md">
            <div className='flex items-center justify-between gap-3 sm:justify-start'>
              <h2 className="py-6 text-lg font-semibold leading-7 text-gray-800">
                Lista Geral de Células IBB
              </h2>
              <div className='items-center justify-center hidden px-2 py-1 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-blue-50 text-sky-700 ring-blue-600/20 sm:block'>
                <p className='flex items-center justify-between'>Total <span className='px-1 py-1 ml-2 text-white rounded-md bg-sky-700'>{data?.length}</span></p>
              </div>
            </div>
            <div className="p-2">
              <table className="w-full px-2 border-separate table-auto border-spacing-y-3">
                <thead>
                  <tr>
                    <th className="text-gray-800 text-start">Ord.</th>
                    <th className="text-gray-800 text-start">Célula</th>
                    <th className="hidden text-gray-800 text-start sm:block">
                      Líder(es)
                    </th>
                    <th className="text-gray-800">Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCelulas?.map((celula, index) => (
                    <tr
                      className="rounded-lg hover:bg-gray-100/90"
                      key={celula.id}
                    >
                      <td>
                        <h2 className="pl-2">{calculateCellNumber(currentPage, index)}</h2>
                      </td>
                      <td>
                        <h2 className="pl-2">{celula.nome}</h2>
                      </td>
                      <td className="hidden mt-2 text-gray-700 text-start sm:block">
                        {celula.lider?.first_name}
                      </td>
                      <td>
                        <div className="flex items-center justify-center w-full gap-2 mx-auto text-center">
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
