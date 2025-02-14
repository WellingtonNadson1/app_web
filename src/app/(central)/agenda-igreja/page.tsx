'use client'
import { Toaster } from '@/components/ui/toaster'
import { Spinner } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import { columns } from './table-agenda-igreja/columns'
import { DataTableAgendaIgreja } from './table-agenda-igreja/data-table-agenda-igreja'
import { useSession } from 'next-auth/react'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { BASE_URL } from '@/lib/axios'

export default function LicoesCelula() {
  const URLEventosAgenda = `${BASE_URL}/agenda-ibb-service/create-evento-agenda`
  const { data: session } = useSession()
  const token = session?.user?.token as string
  const axiosAuth = useAxiosAuth(token)

  const getEventosAgenda = async () => {
    const { data } = await axiosAuth.get(URLEventosAgenda)
    console.log('data agenda:', data)
    return data
  }

  const {
    data: eventosNaAgenda,
    isLoading,
  } = useQuery({
    queryKey: ['eventosAgendaIbb'],
    queryFn: getEventosAgenda,
    staleTime: 0
  })

  const eventosNaAgendaNotReturn: never[] = []

  return (
    <>
      <Toaster />
      <div className="relative w-full px-4 py-2 mx-auto mt-4 ">
        {isLoading ? (
          <Spinner className="animate-spin" />
        ) : eventosNaAgenda?.length === 0 ? (
          <DataTableAgendaIgreja
            columns={columns}
            data={eventosNaAgendaNotReturn as any}
          />
        ) : (
          eventosNaAgenda && (
            <DataTableAgendaIgreja
              columns={columns}
              data={eventosNaAgenda as any}
            />
          )
        )}
      </div>
    </>
  )
}
