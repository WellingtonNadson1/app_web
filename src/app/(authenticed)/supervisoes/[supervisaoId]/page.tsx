'use client'
// import Header from '@/components/Header'
import { ICelula } from '@/components/ListCelulas'
import ListCelulasSupervision from '@/components/ListCelulasSupervision'
import StatsCardSupervision from '@/components/StatsCardSupervision'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

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
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)


  const hostname = 'app-ibb.onrender.com'
  const URL = `https://${hostname}/supervisoes/${supervisaoId}`

  const { data: supervisao, isError: error, isLoading } = useQuery<ISupervisaoData>({
    queryKey: ["supervisao"],
    queryFn: async () => {
      const response = await axiosAuth.get(URL)
      return await response.data
    },
  })

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <div className="w-full px-2 py-2 mx-auto">
      <div className="w-full mx-auto">
        {/* <Header titlePage={`${!error}` && `Supervisão ${supervisao.nome}`} /> */}
      </div>
      <StatsCardSupervision supervisao={supervisao} />
      {supervisao && 
        <ListCelulasSupervision data={supervisao?.celulas} />
      }

    </div>
  )
}
