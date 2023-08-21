'use client'
import Calendar from '@/components/Calendar'
// import Header from '@/components/Header'
import LicoesCelula from '@/components/LicoesCelula'
import { fetchWithToken } from '@/functions/functions'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import ControlePresencaCelula, { CelulaProps } from './ControlePresencaCelula'

export default function ControleCelulaSupervision() {
  const { data: session } = useSession()
  console.log(useParams())
  const hostname = 'app-ibb.onrender.com'
  const URL = `https://${hostname}/celulas/${session?.user.celula}`

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

  if (isLoading) {
    return (
      <div className="mx-auto w-full px-2 py-2">
        <div className="mx-auto flex w-full items-center gap-2">
          <div className="text-white">carregando...</div>
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
        {celula && <ControlePresencaCelula celula={celula} />}
      </div>
    </div>
  )
}
