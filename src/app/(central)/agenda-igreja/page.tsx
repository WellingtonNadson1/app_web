'use client'
import { Toaster } from '@/components/ui/toaster'
import { Spinner } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { columns } from './table-agenda-igreja/columns'
import { DataTableAgendaIgreja } from './table-agenda-igreja/data-table-agenda-igreja'

export default function LicoesCelula() {
  const URLEventosAgenda = `/api/agenda-ibb-service/create-evento-agenda`

  const getEventosAgenda = async () => {
    const { data } = await axios.get(URLEventosAgenda)
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
