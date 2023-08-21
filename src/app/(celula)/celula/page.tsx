'use client'
import Calendar from '@/components/Calendar'
// import Header from '@/components/Header'
import LicoesCelula from '@/components/LicoesCelula'
import { fetchWithToken } from '@/functions/functions'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import ControlePresencaCelula, { CelulaProps } from './ControlePresencaCelula'

export default function ControleCelulaSupervision() {
  const { data: session } = useSession()
  const hostname = 'app-ibb.onrender.com'
  console.log(`Use session CelulaID: ${session?.user.celulaId}`)
  const URL = `https://${hostname}/celulas/${session?.user.celulaId}`

  const {
    data: celula,
    error,
    isLoading,
  } = useSWR<CelulaProps>(
    [URL, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )

  if (error) {
    return (
      <div className="mx-auto w-full px-2 py-2">
        <div className="mx-auto w-full">
          <div>failed to load</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto w-full px-2 py-2">
      <div className="relative mx-auto w-full">
        {/* <Header titlePage={`Célula ${data?.nome}`} /> */}
      </div>
      <div className="relative mx-auto mb-4 mt-3 w-full px-2">
        <Calendar />
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        <LicoesCelula />
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        {!isLoading ? (
          celula && <ControlePresencaCelula celula={celula} />
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="mr-3 h-5 w-5 animate-spin text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            carregando...
          </div>
        )}
      </div>
    </div>
  )
}
