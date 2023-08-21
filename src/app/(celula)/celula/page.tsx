'use client'
import Calendar from '@/components/Calendar'
import LicoesCelula from '@/components/LicoesCelula'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { FetchError } from '@/functions/functions'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import ControlePresencaCelula, { CelulaProps } from './ControlePresencaCelula'
import HeaderCelula from './HeaderCelula'

export default function ControleCelulaSupervision() {
  const { data: session } = useSession()
  const [dataCelula, setDataCelula] = useState<CelulaProps>()
  const hostname = 'app-ibb.onrender.com'
  const celulaId = session?.user?.celulaId // Safely access celulaId

  const URLCelula = `https://${hostname}/celulas/${celulaId}`

  const fetchCelula = useCallback(async () => {
    try {
      if (!session) {
        return
      }
      const response = await fetch(URLCelula, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      })
      if (!response.ok) {
        const error: FetchError = new Error('Failed to fetch get Celula Lider.')
        error.status = response.status
        throw error
      }
      const celula = await response.json()
      setDataCelula(celula)
    } catch (error) {
      console.log(error)
    }
  }, [URLCelula, session])

  // UseEffect para buscar as células quando a página é carregada
  useEffect(() => {
    fetchCelula()
  }, [fetchCelula])

  if (!session) {
    return <SpinnerButton />
  }

  return (
    <div className="relative mx-auto w-full px-2 py-2">
      <div className="relative mx-auto w-full">
        {<HeaderCelula headerCelula={dataCelula?.nome} />}
      </div>
      <div className="relative mx-auto mb-4 mt-3 w-full px-2">
        <Calendar />
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        <LicoesCelula />
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        {dataCelula ? (
          <ControlePresencaCelula celula={dataCelula} />
        ) : (
          <SpinnerButton />
        )}
      </div>
    </div>
  )
}
