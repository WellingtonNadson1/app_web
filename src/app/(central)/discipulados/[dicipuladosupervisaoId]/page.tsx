'use client'
import ListDisicipuladoCelulasSupervision from '@/app/(central)/discipulados/Components/ListDisicipuladoCelulasSupervision'
import StatsCardSupervisionDiscipulado from '@/app/(central)/discipulados/Components/StatsCardSupervisionDiscipulado'
import { ICelula } from '@/components/ListCelulas'
import { useData } from '@/providers/providers'
import { useParams } from 'next/navigation'

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
  const id = useParams()
  // @ts-ignore
  const { data, error, isLoading } = useData()

  const supervisoes = data?.combinedData[0]
  console.log('supervisoes', supervisoes)
  // @ts-ignore
  const supervisao = supervisoes?.filter(
    // @ts-ignore
    (supervisao) => supervisao.id === id.dicipuladosupervisaoId,
  )

  return (
    <div className="w-full px-2 py-2 mx-auto">
      <div className="w-full mx-auto"></div>
      <StatsCardSupervisionDiscipulado
        nome={supervisao[0]?.nome}
        cor={supervisao[0]?.cor}
        idSupervisao={supervisao[0]?.id}
        supervisor={supervisao[0]?.supervisor}
      />
      {supervisao && (
        <ListDisicipuladoCelulasSupervision data={supervisao[0]?.celulas} />
      )}
    </div>
  )
}
