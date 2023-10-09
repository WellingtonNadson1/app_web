/* eslint-disable camelcase */
'use client'
import { meeting } from '@/components/Calendar/Calendar'
import CalendarLiderCelula from '@/components/CalendarLiderCelula'
import LicoesCelula from '@/components/LicoesCelula'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { format, isSameDay, parseISO, startOfToday } from 'date-fns'
import { pt } from 'date-fns/locale'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import ControlePresencaCelula, { CelulaProps } from './ControlePresencaCelula'
import ControlePresencaReuniaoCelula from './ControlePresencaReuniaoCelula'
import HeaderCelula from './HeaderCelula'

export default function ControleCelulaSupervision() {
  const { data: session } = useSession()
  const [dataCelula, setDataCelula] = useState<CelulaProps>()

  const celulaId = session?.user?.celulaId
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  const URLCelula = `${BASE_URL}/celulas/${celulaId}`
  const URLCultosInd = `${BASE_URL}/cultosindividuais`

  const { data, isLoading } = useQuery<meeting[]>({
    queryKey: ['mettingsData'],
    queryFn: () => axiosAuth.get(URLCultosInd)
  })

  const { data: celula, isLoading: isLoadingCelula } = useQuery<CelulaProps>({
    queryKey: ['mettingsData'],
    queryFn: () => axiosAuth.get(URLCelula)
  })

  const today = startOfToday()

  if (isLoading) {
    return
  }

  if (isLoadingCelula) {
    return
  }

  if (!session) {
    return
  }

  const selectedDayMeetings = data?.filter((meeting) =>
    isSameDay(parseISO(meeting.data_inicio_culto), today),
  )

  const fetchCelula = useCallback(async () => {
    try {
      if (!session) {
        return
      }
      if (!celula) {
        console.log('Failed to fetch Celula Lider.')
      }
      setDataCelula(celula)
    } catch (error) {
      console.error('Erro na requisição de celula:', error)
    }
  }, [URLCelula, session, axiosAuth])

  useEffect(() => {
    fetchCelula()
  }, [fetchCelula])

  const dataHoje = new Date()
  const dayOfWeek = dataHoje.getDay()

  if (!session) {
    return <SpinnerButton />
  }

  return (
    <div className="relative mx-auto w-full px-2 py-2">
      <div className="relative mx-auto w-full">
        {dataCelula && <HeaderCelula headerCelula={dataCelula.nome} />}
      </div>
      <div className="relative flex flex-col gap-3 mx-auto mb-4 mt-3 w-full px-2">
        <CalendarLiderCelula />
      </div>
      <div className="relative mx-auto mb-4 w-full px-2">
        <LicoesCelula />
      </div>
      <div className="relative flex flex-col gap-3 mx-auto mb-4 w-full px-2">
  {selectedDayMeetings === null ? (
    <SpinnerButton />
  ) : selectedDayMeetings && selectedDayMeetings.length > 0 ? (
    selectedDayMeetings.map((meeting) => (
      isSameDay(parseISO(meeting.data_inicio_culto), today) ? (
        dataCelula ? (
          <div key={meeting.id} className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-between md:flex-nowrap">
            <div className="flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95">
              <div className="mb-2 flex flex-col items-start justify-start">
                <div className="w-full">
                  <div className="mx-auto w-full rounded-2xl bg-white p-2">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between rounded-lg ring-1 ring-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                            <span>Frequência de Culto - {format(new Date(meeting.data_inicio_culto), 'Pp', { locale: pt })}</span>
                            <ChevronUpIcon
                              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="w-full px-2 pt-4 pb-2 text-sm text-gray-500">
                            <ControlePresencaCelula
                              culto={meeting.id}
                              celula={dataCelula}
                            />
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SpinnerButton key={meeting.id} />
        )
      ) : <SpinnerButton key={meeting.id} />
    ))
  ) : (
    <div className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-between md:flex-nowrap">
      <div className="flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95">
        <div className="mb-2 flex flex-col items-start justify-start">
          <div className="w-full">
            <div className="mx-auto w-full rounded-2xl bg-white p-2">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg ring-1 ring-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                      <span>Frequência de Culto</span>
                      <ChevronUpIcon
                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="w-full px-2 pt-4 pb-2 text-sm text-gray-500">
                      <p>Não há Culto hoje.</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}{' '}
</div>
      <div className="relative mx-auto mb-4 w-full px-2">
        {dataCelula && Number(dataCelula.date_que_ocorre) === dayOfWeek ? (
          <div className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-between md:flex-nowrap">
            <div className="flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95">
              <div className="mb-2 flex flex-col items-start justify-start">
                <div className="w-full">
                  <div className="mx-auto w-full rounded-2xl bg-white p-2">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between rounded-lg ring-1 ring-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                            <span>Frequência de Célula - {format(today, 'P', { locale: pt })}</span>
                            <ChevronUpIcon
                              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="w-full px-2 pt-4 pb-2 text-sm text-gray-500">
                            <ControlePresencaReuniaoCelula
                              dataCelula={dataCelula}
                              celulaId={dataCelula.id}
                            />
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-between md:flex-nowrap">
            <div className="flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95">
              <div className="mb-2 flex flex-col items-start justify-start">
                <div className="w-full">
                  <div className="mx-auto w-full rounded-2xl bg-white p-2">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between rounded-lg ring-1 ring-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                            <span>Frequência de Célula</span>
                            <ChevronUpIcon
                              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="w-full px-2 pt-4 pb-2 text-sm text-gray-500">
                            <p>Não há Célula hoje.</p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
