'use client'
// import Header from '@/components/Header'
import { ICelula } from '@/components/ListCelulas'
import StatsCardSupervision from '@/components/StatsCardSupervision'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { fetchWithToken } from '../../novo-membro/page'

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
  console.log('Id da Supervisao aqui', supervisaoId)
  const { data: session } = useSession()

  const hostname = 'app-ibb.onrender.com'
  const URL = `https://${hostname}/supervisoes/${supervisaoId}`

  const {
    data: supervisao,
    error,
    isValidating,
    isLoading,
  } = useSWR<ISupervisaoData>(
    [URL, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  if (isValidating) {
    console.log('Is Validating', isValidating)
  }

  return (
    <div className="mx-auto w-full px-2 py-2">
      <div className="mx-auto w-full">
        {/* <Header titlePage={`${!error}` && `Supervisão ${supervisao.nome}`} /> */}
      </div>
      <StatsCardSupervision supervisao={supervisao} />
    </div>
  )
}
