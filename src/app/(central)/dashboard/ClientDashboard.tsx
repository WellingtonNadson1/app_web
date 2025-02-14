'use client'

import { ChartConversions } from '@/components/Graficos/chart-coversoes'
import MainSide from '@/components/MainSide'
import {
  useAlmasAnoStore,
  useAlmasMesPassadoStore,
  useAlmasMesStore,
} from '@/store/AlmasStorage'
import { useCombinedStore } from '@/store/DataCombineted'
import { InitializerAlmasAnoStore } from '@/store/InitializerAlmasAnoStore'
import { InitializerAlmasMesPassadoStore } from '@/store/InitializerAlmasMesPassadoStore'
import { InitializerAlmasMesStore } from '@/store/InitializerAlmasMesStore'
import { InitializerStore } from '@/store/InitializerStore'
import { InitializerUserStore } from '@/store/InitializerUserStore'
import { useEffect } from 'react'

interface Session {
  user: {
    id: string
    role: string
    user_roles: string[]
    email: string
    image_url: string
    first_name: string
    token: string
    refreshToken: {
      id: string
      expiresIn: number
      userIdRefresh: string
    }
  }
}

interface Result {
  combinedData: [
    supervisoes: any[],
    escolas: any[],
    encontros: any[],
    situacoesNoReino: any[],
    cargoLideranca: any[],
  ]
  almasGanhasNoMes: number
  almasGanhasNoMesPassado: number
  almasGanhasNoAno: number
}

interface ClientDashboardProps {
  session: Session | null
  result: Result
}

export default function ClientDashboard({
  session,
  result,
}: ClientDashboardProps) {
  console.log('result', result)
  const id = session?.user?.id
  const role = session?.user?.role
  const user_roles = session?.user?.user_roles
  const email = session?.user?.token
  const image_url = session?.user?.image_url
  const first_name = session?.user?.first_name
  const token = session?.user?.token
  const refreshToken = session?.user?.refreshToken

  useEffect(() => {
    useCombinedStore.setState({
      state: {
        // @ts-ignore
        supervisoes: result.combinedData[0] ?? [],
        // @ts-ignore
        escolas: result.combinedData[1] ?? [],
        // @ts-ignore
        encontros: result.combinedData[2] ?? [],
        // @ts-ignore
        situacoesNoReino: result.combinedData[3] ?? [],
        // @ts-ignore
        cargoLideranca: result.combinedData[4] ?? [],
      },
    })
    useAlmasAnoStore.setState({
      // @ts-ignore
      almasGanhasNoAno: result?.almasGanhasNoAno ?? [],
    })
    useAlmasMesPassadoStore.setState({
      almasGanhasNoMesPassado: result?.almasGanhasNoMesPassado ?? [],
    })
    useAlmasMesStore.setState({
      almasGanhasNoMes: result?.almasGanhasNoMes ?? [],
    })
  }, [result])

  return (
    <div className="w-full px-2 py-2 mx-auto">
      <InitializerUserStore
        id={id ?? ''}
        role={role ?? ''}
        // @ts-ignore
        user_roles={user_roles ?? []}
        email={email ?? ''}
        image_url={image_url ?? ''}
        first_name={first_name ?? ''}
        token={token ?? ''}
        refreshToken={
          refreshToken ?? { id: '', expiresIn: 0, userIdRefresh: '' }
        }
      />
      <InitializerStore
        // @ts-ignore
        supervisoes={result[0] ?? []}
        // @ts-ignore
        escolas={result[1] ?? []}
        // @ts-ignore
        encontros={result[2] ?? []}
        // @ts-ignore
        situacoesNoReino={result[3] ?? []}
        // @ts-ignore
        cargoLideranca={result[4] ?? []}
      />

      <InitializerAlmasMesStore
        // @ts-ignore
        almasGanhasNoAno={result?.almasGanhasNoMes ?? []}
      />

      <InitializerAlmasMesPassadoStore
        // @ts-ignore
        almasGanhasNoAno={result?.almasGanhasNoMesPassado ?? []}
      />

      <InitializerAlmasAnoStore
        // @ts-ignore
        almasGanhasNoAno={result?.almasGanhasNoAno ?? []}
      />

      <MainSide />
      <ChartConversions />
    </div>
  )
}
