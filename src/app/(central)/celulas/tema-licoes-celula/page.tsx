'use client'
import { Toaster } from '@/components/ui/toaster'
import { Spinner } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { columns } from './table-temas-licoes-celulas/columns'
import { DataTableTemasLicoesCelula } from './table-temas-licoes-celulas/data-table-licoes-celulas'

export default function LicoesCelula() {
  const URLTemasLicoesCelula = `/api/licoes-celula/create-tema-folder`

  const getTemasLicoesCelula = async () => {
    const { data } = await axios.get(URLTemasLicoesCelula)
    return data
  }

  const {
    data: temasLicoesCelula,
    isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['temasCelulasIbb'],
    queryFn: getTemasLicoesCelula,
  })

  const temasLicoesCelulaNotReturn: never[] = []

  return (
    <>
      <Toaster />
      <div className="relative w-full px-4 py-2 mx-auto mt-4 ">
        {isLoading ? (
          <Spinner className="animate-spin" />
        ) : temasLicoesCelula?.length === 0 ? (
          <DataTableTemasLicoesCelula
            columns={columns}
            data={temasLicoesCelulaNotReturn as any}
          />
        ) : (
          temasLicoesCelula && (
            <DataTableTemasLicoesCelula
              columns={columns}
              data={temasLicoesCelula as any}
            />
          )
        )}
      </div>
    </>
  )
}