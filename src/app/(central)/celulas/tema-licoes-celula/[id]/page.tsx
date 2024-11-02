'use client'
import { Toaster } from '@/components/ui/toaster'
import { Spinner } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { columnsLicoes } from './licoes-celula/table-licoes-celula/columns-licoes'
import { DataTableLicoesCelulas } from './licoes-celula/table-licoes-celula/data-table-licoes-celulas'

export default function Licao({
  idTemaLicaoCelula,
}: {
  idTemaLicaoCelula: string
}) {
  const URLLicoesCelula = `/api/licoes-celula/create-lesson-celula`
  const URLTemaMonth = `/api/licoes-celula/tema-of-month`

  const searchParams = useSearchParams()

  const id = searchParams.get('id')

  const getLicoesCelula = async () => {
    const { data } = await axios.get(URLLicoesCelula, {
      params: { id },
    })
    console.log('data lesson get: ', data)
    return data
  }

  const {
    data: licoesCelula,
    isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['licoesCelulasIbb'],
    queryFn: getLicoesCelula,
  })

  const licoesCelulaNotReturn: never[] = []

  return (
    <>
      <Toaster />
      <div className="relative w-full px-4 py-2 mx-auto mt-4 ">
        {isLoading ? (
          <Spinner className="animate-spin" />
        ) : licoesCelula?.length === 0 || licoesCelula === null ? (
          <DataTableLicoesCelulas
            columns={columnsLicoes}
            data={licoesCelulaNotReturn as any}
          />
        ) : (
          licoesCelula && (
            <DataTableLicoesCelulas
              columns={columnsLicoes}
              data={licoesCelula as any}
            />
          )
        )}
      </div>
    </>
  )
}