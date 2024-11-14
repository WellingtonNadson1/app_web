'use client'
import { useData } from '@/providers/providers'
import { useCombinedStore } from '@/store/DataCombineted'
import { useParams } from 'next/navigation'
import ListMembersDiscipuladoSupervisor from '../../../Components/ListMembersDiscipuladoSupervisor'
import { columns } from '../table-discipulos-supervisores/columns'
import { DataTableDiscipulosSUpervisores } from '../table-discipulos-supervisores/data-table-discipulos-supervisores'

export default function ControleDiscipuladoSupervisiores({
  params: { supervisoresId },
}: {
  params: { supervisoresId: string }
}) {
  const { data, error, isLoading } = useData()

  if (isLoading) {
    return <p>Carregando...</p>
  }

  if (error) {
    return <p>Ocorreu um erro ao carregar os dados.</p>
  }

  const { state } = useCombinedStore()
  const supervisoesAll = state.supervisoes

  const id = useParams()

  const supervisao = supervisoesAll?.filter(
    (supervisao) => supervisao.id === id.supervisorId,
  )

  return (
    <div className="relative w-full px-2 py-2 mx-auto">
      <div className="relative w-full mx-auto"></div>
      <div className="relative w-full px-2 mx-auto mt-3 mb-4">
        {supervisao && (
          <div className='flex flex-col gap-3'>
            <DataTableDiscipulosSUpervisores columns={columns} supervisaoCor={supervisao[0]?.cor} supervisaoNome={supervisao[0]?.nome} data={supervisao[0]?.supervisor?.discipulos as any} />
            <ListMembersDiscipuladoSupervisor
              //@ts-ignore
              supervisor={supervisao[0]?.supervisor}
            />
          </div>
        )}
      </div>
    </div>
  )
}
