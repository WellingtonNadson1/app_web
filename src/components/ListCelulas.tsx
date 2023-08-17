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

export default function ListCelulas({ data }: ListCelulasProps) {
  const router = useRouter()
  const contextParamsSupervisaoId = useSupervisaoContext()

  const handleClickCelula = (event: React.MouseEvent<HTMLElement>) => {
    const idCelula = event.currentTarget.id
    router.push(`/supervisoes/${contextParamsSupervisaoId}/celulas/${idCelula}`)
  }
  return (
    <div>
      <div className="relative mx-auto mt-3 w-full p-2">
        <div className="relative mx-auto w-full py-2">
          <div className="w-full rounded-lg bg-white p-4 shadow-md">
            <div className="p-2">
              <table className="w-full table-auto border-separate border-spacing-y-2 px-2">
                <thead>
                  <tr>
                    <th className="text-start text-gray-800">Ord.</th>
                    <th className="text-start text-gray-800">Célula</th>
                    <th className="hidden text-start text-gray-800 sm:block">
                      Líder(es)
                    </th>
                    <th className="text-gray-800">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="px-4">
                  {data?.map((celula, index) => (
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

                      <td className="mt-2 hidden text-start text-gray-700 sm:block">
                        {celula.lider?.first_name}
                      </td>
                      <td className="p-2">
                        <div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
