import { useSupervisaoContext } from '@/contexts/supervisao/supervisao'
import { useRouter } from 'next/navigation'
import React from 'react'

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

export default function ListCelulasSupervision({ data }: ListCelulasProps) {
  const router = useRouter()
  const contextParamsSupervisaoId = useSupervisaoContext()
  const dataSort = data.sort((a, b) => a.nome.localeCompare(b.nome))

  const handleClickCelula = (event: React.MouseEvent<HTMLElement>) => {
    const idCelula = event.currentTarget.id
    router.push(`/discipulados/${contextParamsSupervisaoId}/celulas/${idCelula}`)
  }
  return (
    <div>
      <div className="relative w-full p-2 mx-auto mt-1">
        <div className="relative w-full py-2 mx-auto">
          <div className="w-full p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold leading-7 text-gray-800">
              Lista de Células
            </h2>
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
                <tbody className="px-4">
                  {dataSort?.map((celula, index) => (
                    <tr
                      className="rounded-lg hover:bg-gray-100/90"
                      key={celula.id}
                    >
                      <td>
                        <h2 className="pl-2">{index + 1}</h2>
                      </td>
                      <td>
                        <h2 className="pl-2">{celula.nome}</h2>
                      </td>

                      <td className="hidden mt-2 text-gray-700 text-start sm:block">
                        {celula.lider?.first_name}
                      </td>
                      <td className='mx-auto'>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={handleClickCelula}
                            id={celula.id}
                            className="px-4 py-2 mx-auto mt-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                          >
                            Acessar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
