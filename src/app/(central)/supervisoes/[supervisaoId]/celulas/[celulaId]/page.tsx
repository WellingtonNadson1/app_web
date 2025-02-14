'use client'
import { CelulaData } from '@/components/listMembersCelula'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { columns } from '../table-users-celula/columns'
import { DataTableUsersCelula } from '../table-users-celula/data-table-users-celula'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { BASE_URL } from '@/lib/axios'

export default function ControleCelulaSupervision({
  params: { celulaId },
}: {
  params: { celulaId: string }
}) {
  const { data: session } = useSession()
  const token = session?.user?.token as string
  const axiosAuth = useAxiosAuth(token)

  const URL = `${BASE_URL}/celulas/${celulaId}`

  const CelulaDataQuery = async () => {
    try {
      const { data } = await axiosAuth.get(URL)
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const {
    data: celula,
    isError: error,
    isLoading,
    isSuccess,
  } = useQuery<CelulaData>({
    queryKey: ['celula'],
    queryFn: CelulaDataQuery,
    retry: 3,
  })

  if (error) {
    return (
      <div className="w-full px-2 py-2 mx-auto">
        <div className="w-full mx-auto">
          <div>failed to load</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full px-2 py-2 mx-auto">
        <div className="flex items-center w-full gap-2 mx-auto">
          <div className="text-white">carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full px-2 py-2 mx-auto">
      <div className="relative w-full mx-auto"></div>
      <div className="relative w-full px-2 mx-auto mt-3 mb-4">
        {isSuccess && (
          <DataTableUsersCelula
            columns={columns}
            data={celula.membros as any}
            nomeCelula={celula.nome}
            nomeSupervisao={celula.supervisao.nome}
          />
        )}
      </div>
    </div>
  )
}
