'use client'
import { meeting } from '@/components/Calendar/Calendar'
import CalendarLiderCelula from '@/components/CalendarLiderCelula'
import LicoesCelula from '@/components/LicoesCelula'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { FetchError, fetchWithToken } from '@/functions/functions'
import { getDay, isSameDay, parseISO, startOfToday } from 'date-fns'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import ControlePresencaCelula, { CelulaProps } from './ControlePresencaCelula'
import ControlePresencaReuniaoCelula from './ControlePresencaReuniaoCelula'
import HeaderCelula from './HeaderCelula'

export default function ControleCelulaSupervision() {
  const { data: session } = useSession()
  const [dataCelula, setDataCelula] = useState<CelulaProps>()
  const hostname = 'app-ibb.onrender.com'
  const celulaId = session?.user?.celulaId // Safely access celulaId

  const URLCelula = `https://${hostname}/celulas/${celulaId}`
  const URLCultosInd = `https://${hostname}/cultosindividuais`

  const { data: meetings } = useSWR<meeting[]>(
    [URLCultosInd, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, 'GET', token),
  )

  const today = startOfToday()

  const selectedDayMeetings = meetings?.filter((meeting) =>
    isSameDay(parseISO(meeting.data_inicio_culto), today),
  )

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

  const dataHoje = new Date()
  const dayOfWeek = getDay(dataHoje)

  if (!session) {
    return <SpinnerButton />
  }

  return (
    <div className="relative mx-auto w-full px-2 py-2">
      <div className="relative mx-auto w-full">
        {<HeaderCelula headerCelula={dataCelula?.nome} />}
      </div>
      <div className="relative mx-auto mb-4 mt-3 w-full px-2">
        <CalendarLiderCelula />
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        <LicoesCelula />
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        {selectedDayMeetings && selectedDayMeetings?.length > 0 ? (
          selectedDayMeetings?.map((meeting) =>
            isSameDay(parseISO(meeting.data_inicio_culto), today) ? (
              dataCelula ? (
                <ControlePresencaCelula
                  culto={meeting.id}
                  celula={dataCelula}
                />
              ) : (
                <SpinnerButton />
              )
            ) : null,
          )
        ) : (
          <div className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-between md:flex-nowrap">
            <div className="flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95">
              <div className="mb-3 flex flex-col items-start justify-start">
                <p>Não há Culto hoje.</p>
              </div>
            </div>
          </div>
        )}{' '}
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        {Number(dataCelula?.date_que_ocorre) === dayOfWeek ? (
          dataCelula && (
            <ControlePresencaReuniaoCelula
              dataCelula={dataCelula}
              celulaId={dataCelula?.id}
            />
          )
        ) : (
          <div>
            <h2>Frequência de Célula</h2>
            <p>Hoje não temos Célula</p>
          </div>
        )}
      </div>
    </div>
  )
}
