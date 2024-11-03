import { useSupervisaoContext } from '@/contexts/supervisao/supervisao'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Pagination from './Pagination'

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

export default function ListTemaLicoesCelula({ data }: ListCelulasProps) {
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
    return (pageIndex - 1) * itemsPerPage + index + 1
  }

  return (
    <div className="relative  mx-auto w-full p-2">
      <div className="relative mx-auto w-full py-2">
        <div className="w-full rounded-lg bg-white p-4 shadow-md">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <h2 className="text-lg py-6 font-semibold leading-7 text-gray-800">
              Temas Lições de Células
            </h2>
            <div className="flex items-center justify-center rounded-md px-3 py-2 text-center text-xs font-medium ring-1 ring-inset bg-blue-50  text-sky-700 ring-blue-600/20">
              <p className="flex items-center justify-between">
                Total{' '}
                <span className="text-white ml-2 rounded-md px-2 py-1 bg-sky-700">
                  {data?.length}
                </span>
              </p>
            </div>
          </div>
          <div className="p-2">
            <table className="w-full table-auto border-separate border-spacing-y-3 px-2">
              <thead>
                <tr>
                  <th className="text-start text-gray-800">Ord.</th>
                  <th className="text-start text-gray-800">Temas</th>
                  <th className="hidden text-start text-gray-800 sm:block">
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
                      <h2 className="pl-2">
                        {calculateCellNumber(currentPage, index)}
                      </h2>
                    </td>
                    <td>
                      <h2 className="pl-2">{celula.nome}</h2>
                    </td>
                    <td className="mt-2 hidden text-start text-gray-700 sm:block">
                      {celula.lider?.first_name}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2 text-center">
                        <button
                          onClick={handleClickCelula}
                          id={celula.id}
                          className="block rounded-md bg-green-500 px-4 py-2 text-center text-sm font-medium leading-3 text-white  ring-1 ring-slate-700/10 duration-150 hover:bg-green-600"
                        >
                          Acessar
                        </button>
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
