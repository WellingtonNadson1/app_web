import { ReturnMembers } from '@/app/(authenticed)/novo-membro/schema'
import { useSupervisaoContext } from '@/contexts/supervisao/supervisao'
import { useRouter } from 'next/navigation'
import React from 'react'

interface ListMembersProps {
  data: ReturnMembers[]
}

export default function ListMembers({ data }: ListMembersProps) {
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
                    <th className="text-start text-gray-800">Nome Memb.</th>
                    <th className="hidden text-start text-gray-800 sm:block">
                      Supervisão
                    </th>
                    <th className="text-gray-800">Controle</th>
                  </tr>
                </thead>
                <tbody className="px-4">
                  {data?.map((member, index) => (
                    <tr
                      className="rounded-lg hover:bg-gray-100/90"
                      key={member.id}
                    >
                      <td>
                        <h2 className="pl-2">{index + 1}</h2>
                      </td>
                      <td>
                        <h2 className="pl-2">{member.first_name}</h2>
                      </td>

                      <td className="mt-2 hidden text-start text-gray-700 sm:block">
                        {member.supervisao_pertence}
                      </td>
                      <td>
                        <div className="flex w-3/4 items-center justify-center">
                          <button
                            onClick={handleClickCelula}
                            id={member.id}
                            className="block rounded-md bg-red-500 px-4 py-2 text-center text-sm font-medium leading-3 text-white  ring-1 ring-slate-700/10 duration-150 hover:bg-red-600"
                          >
                            Deletar
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="flex w-3/4 items-center justify-center">
                          <button
                            onClick={handleClickCelula}
                            id={member.id}
                            className="block rounded-md bg-green-500 px-4 py-2 text-center text-sm font-medium leading-3 text-white  ring-1 ring-slate-700/10 duration-150 hover:bg-green-600"
                          >
                            Editar
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
