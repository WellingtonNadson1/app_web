'use client'
import { Toaster } from '@/components/ui/toaster'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { columns } from './table-celulas/columns'
import { DataTableCelulas } from './table-celulas/data-table-ucelulas'

export default function Celulas() {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth(session?.user.token as string)
  const URLCelulas = `${BASE_URL}/celulas`

  const getCelulas = async () => {
    const { data } = await axiosAuth.get(URLCelulas)
    return data
  }

  const {
    data: celulas,
    isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['allCelulasIbb'],
    queryFn: getCelulas,
    staleTime: 0
  })

  return (
    <>
      <Toaster />
      {/* <AddNewCelula /> */}
      {isSuccess && celulas && (
        <div className="relative z-10 px-2">
          <DataTableCelulas columns={columns} data={celulas as any} />
        </div>
      )}
    </>
  )
}
