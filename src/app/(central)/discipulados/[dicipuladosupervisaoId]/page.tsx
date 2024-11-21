'use client'
import { ICelula } from '@/components/ListCelulas'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { useCombinedStore } from '@/store/DataCombineted'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import ListDisicipuladoCelulasSupervision from '../Components/ListDisicipuladoCelulasSupervision'
import TableSkeletonDiscipulosSupervisor from './supervisor/[supervisorId]/table-skeleton'
import { columns } from './supervisores/table-discipulos-supervisores/columns'
import { DataTableDiscipulosSUpervisores } from './supervisores/table-discipulos-supervisores/data-table-discipulos-supervisores'
import { TSupervisor } from './supervisores/table-discipulos-supervisores/schema'

interface IUser {
  id: string
  first_name: string
}

interface ISupervisor {
  id: string
  first_name: string
}

export interface ISupervisaoData {
  id: string
  nome: string
  cor: string
  supervisor: ISupervisor
  nivel: string
  User: IUser[]
  celulas: ICelula[]
}

export default function Supervisao({
  params: { supervisaoId },
}: {
  params: { supervisaoId: string }
}) {
  const URLSupervisoresDiscipulos = `${BASE_URL}/users/alldiscipuladossupervisores`
  const { dicipuladosupervisaoId } = useParams()

  const { state } = useCombinedStore()
  const supervisoesAll = state.supervisoes

  const supervisao = supervisoesAll?.filter(
    (supervisao) => supervisao.id === dicipuladosupervisaoId,
  )

  const cargoLideranca = state.cargoLideranca
  const cargoLiderancaSupervisores = cargoLideranca?.filter(
    (cargo) =>
      cargo.nome !== 'Pastor' &&
      cargo.nome !== 'Líder de Célula' &&
      cargo.nome !== 'Membro' &&
      cargo.nome !== 'Líder de Célula Supervisor' &&
      cargo.nome !== 'Líder Auxiliar',
  )

  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth(session?.user.token as string)

  const getDiscipuloSupervisorBySupervisao = async () => {
    const { data } = await axiosAuth.post(URLSupervisoresDiscipulos, {
      dicipuladosupervisaoId,
      cargoLiderancaSupervisores
    })
    return data
  }

  const {
    data: supervisores,
    isLoading,
    isSuccess,
    error,
  } = useQuery<TSupervisor[]>({
    queryKey: ['discipulosSupervisores'],
    queryFn: getDiscipuloSupervisorBySupervisao,
  })


  return (
    <div className="w-full px-2 py-2 mx-auto z-50">
      {/* DISCIPULADO DO SUPERVISOR DE AREA */}
      {/* <StatsCardSupervisionDiscipulado
        nome={supervisao[0]?.nome}
        cor={supervisao[0]?.cor}
        idSupervisao={supervisao[0]?.id}
        supervisor={supervisao[0]?.supervisor}
      /> */}

      {isLoading ?
        <TableSkeletonDiscipulosSupervisor /> :
        <div>
          {supervisores
            && <DataTableDiscipulosSUpervisores columns={columns} supervisaoCor={supervisao[0]?.cor} supervisaoNome={supervisao[0]?.nome} data={supervisores as any} />
          }
        </div>
      }
      {/* DISCIPULADOS POR CELULAS */}
      {supervisao && (
        <ListDisicipuladoCelulasSupervision data={supervisao[0]?.celulas} />
      )}
    </div>
  )
}
