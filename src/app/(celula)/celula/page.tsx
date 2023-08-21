'use client'
import Calendar from '@/components/Calendar'
import LicoesCelula from '@/components/LicoesCelula'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { fetchWithToken } from '@/functions/functions'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import ControlePresencaCelula, { CelulaProps } from './ControlePresencaCelula'
import HeaderCelula from './HeaderCelula'

export default function ControleCelulaSupervision() {
  const { data: session } = useSession()
  const hostname = 'app-ibb.onrender.com'
  const celulaId = session?.user?.celulaId // Safely access celulaId
  const token = session?.user?.token // Safely access token

  const URL = celulaId ? `https://${hostname}/celulas/${celulaId}` : null

  const { data: celula, error } = useSWR<CelulaProps>(
    [URL, `${token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )

  if (!session) {
    return <SpinnerButton />
  }
  console.log(`Celula DATA PAGE: ${celula}`)
  console.log(JSON.stringify(celula?.nome))

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
        {celula && <HeaderCelula headerCelula={celula.nome} />}
      </div>
      <div className="relative mx-auto mb-4 mt-3 w-full px-2">
        <Calendar />
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        <LicoesCelula />
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        {celula ? (
          <ControlePresencaCelula celula={celula} />
        ) : (
          <SpinnerButton />
        )}
      </div>
    </div>
  )
}
