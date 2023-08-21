'use client'
import Calendar from '@/components/Calendar'
// import Header from '@/components/Header'
import LicoesCelula from '@/components/LicoesCelula'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { fetchWithToken } from '@/functions/functions'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import ControlePresencaCelula, { CelulaProps } from './ControlePresencaCelula'

export default function ControleCelulaSupervision() {
  const { data: session } = useSession()
  const hostname = 'app-ibb.onrender.com'
  console.log(`Use session CelulaID: ${session?.user.celulaId}`)
  const URL = session?.user.celulaId
    ? `https://${hostname}/celulas/${session.user.celulaId}`
    : null

  const {
    data: celula,
    error,
    isLoading,
  } = useSWR<CelulaProps>(
    [URL, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )

  if (!session) {
    return <SpinnerButton />
  }
  console.log(`Celula DATA PAGE: ${celula}`)

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
          <SpinnerButton />
        )}
      </div>
    </div>
  )
}
