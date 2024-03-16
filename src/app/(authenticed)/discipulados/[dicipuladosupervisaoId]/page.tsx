'use client'
import { ICelula } from '@/components/ListCelulas'
import { useCombinetedStore } from '@/store/DataCombineted'
import { useParams } from 'next/navigation'
import StatsCardSupervisionDiscipulado from '@/app/(authenticed)/discipulados/Components/StatsCardSupervisionDiscipulado'
import ListDisicipuladoCelulasSupervision from '@/app/(authenticed)/discipulados/Components/ListDisicipuladoCelulasSupervision'

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
  const { supervisoes } = useCombinetedStore.getState().state
  console.log('supervisoes', supervisoes)
  const supervisao = supervisoes?.filter(supervisao => supervisao.id === id.dicipuladosupervisaoId)

  return (
    <div className="w-full px-2 py-2 mx-auto">
      <div className="w-full mx-auto">
      </div>
      <StatsCardSupervisionDiscipulado
        nome={supervisao[0].nome}
        cor={supervisao[0].cor}
        idSupervisao={supervisao[0].id}
        supervisor={supervisao[0].supervisor} />
      {supervisao &&
        <ListDisicipuladoCelulasSupervision data={supervisao[0].celulas} />
      }

    </div>
  )
}
