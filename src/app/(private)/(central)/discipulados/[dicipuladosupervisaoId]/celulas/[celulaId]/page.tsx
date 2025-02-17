'use client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CelulaDataDiscipulado } from '../../../Components/ListMembersDiscipuladoSupervisor/schema'
import ListMembersDiscipulados from '../../../Components/ListMembersDiscipulados'
import { BASE_URL } from '@/lib/axios'
import { useSession } from 'next-auth/react'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'

export default function ControleCelulaSupervision({
  params: { celulaId },
}: {
  params: { celulaId: string }
}) {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth(session?.user?.token as string)

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
  } = useQuery<CelulaDataDiscipulado>({
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
        {isSuccess && <ListMembersDiscipulados data={celula} />}
      </div>
    </div>
  )
}
