/* eslint-disable camelcase */
'use client'
import { meeting } from '@/components/Calendar/Calendar'
import CalendarLiderCelula from '@/components/CalendarLiderCelula'
import LicoesCelula from '@/components/LicoesCelula'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { FetchError, fetchWithToken } from '@/functions/functions'
import { format, getDay, isSameDay, parseISO, startOfToday } from 'date-fns'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import ControlePresencaCelula, { CelulaProps } from './ControlePresencaCelula'
import ControlePresencaReuniaoCelula from './ControlePresencaReuniaoCelula'
import { Disclosure } from '@headlessui/react'
import HeaderCelula from './HeaderCelula'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { pt } from 'date-fns/locale'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import axios from '@/lib/axios'

export default function ControleCelulaSupervision() {
  const { data: session } = useSession()
  const [dataCelula, setDataCelula] = useState<CelulaProps>()
  const [meetings, setMeetings] = useState<meeting[]>()
  const celulaId = session?.user?.celulaId // Safely access celulaId
  const axiosAuth = useAxiosAuth()

  const URLCelula = `/celulas/${celulaId}`
  const URLCultosInd = `/cultosindividuais`

  // const fetchWithTokenAxios = async (url: string, token: string) => {
  //   const response = await axios.get(url, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   return response.data;
  // };

  useEffect(() => {
    axiosAuth.get(URLCultosInd)
      .then(response => {
        setMeetings(response.data);
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
  }, []);


  // const { data: meetings, isLoading } = useSWR<meeting[]>(
  //   [URLCultosInd, session?.user.token], fetchWithTokenAxios)

  // const { data: meetings, isLoading } = useSWR<meeting[]>(
  //   [URLCultosInd, `${session?.user.token}`],
  //   ([url, token]: [string, string]) => fetchWithToken(url, 'GET', token),
  // )

  const today = startOfToday()

  // if (isLoading) {
  //   return
  // }

  const selectedDayMeetings = meetings?.filter((meeting) =>
    isSameDay(parseISO(meeting.data_inicio_culto), today),
  )

  const fetchCelula = useCallback(async () => {
    try {
      if (!session) {
        return
      }
      const response = await axiosAuth.get(URLCelula)
      const celula = response.data
      if (!celula) {
        const error: FetchError = new Error('Failed to fetch get Celula Lider.')
        throw error
      }
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
                <div className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-between md:flex-nowrap">
                  <div className="flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95">
                    <div className="mb-2 flex flex-col items-start justify-start">
                      <div className="w-full">
                        <div className="mx-auto w-full rounded-2xl bg-white p-2">
                          <Disclosure>
                            {({ open }) => (
                              <>
                                <Disclosure.Button className="flex w-full justify-between rounded-lg ring-1 ring-blue-100  px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                                  <span>Frequência de Culto - {format(new Date(meeting.data_inicio_culto), 'Pp', { locale: pt })}</span>
                                  <ChevronUpIcon
                                    className={`${open ? 'rotate-180 transform' : ''
                                      } h-5 w-5 text-blue-500`}
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
                <SpinnerButton />
              )
            ) : <SpinnerButton />
          )
        ) : (
          <div className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-between md:flex-nowrap">
            <div className="flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95">
              <div className="mb-2 flex flex-col items-start justify-start">
                <div className="w-full">
                  <div className="mx-auto w-full rounded-2xl bg-white p-2">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between rounded-lg ring-1 ring-blue-100  px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                            <span>Frequência de Culto</span>
                            <ChevronUpIcon
                              className={`${open ? 'rotate-180 transform' : ''
                                } h-5 w-5 text-blue-500`}
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
        {Number(dataCelula?.date_que_ocorre) === dayOfWeek ? (
          dataCelula && (
            <div className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-between md:flex-nowrap">
              <div className="flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95">
                <div className="mb-2 flex flex-col items-start justify-start">
                  <div className="w-full">
                    <div className="mx-auto w-full rounded-2xl bg-white p-2">
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg ring-1 ring-blue-100  px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                              <span>Frequência de Célula  - {format(new Date(today), 'P', { locale: pt })}</span>
                              <ChevronUpIcon
                                className={`${open ? 'rotate-180 transform' : ''
                                  } h-5 w-5 text-blue-500`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="w-full px-2 pt-4 pb-2 text-sm text-gray-500">
                              <ControlePresencaReuniaoCelula
                                dataCelula={dataCelula}
                                celulaId={dataCelula?.id}
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
          )
        ) : (
          <div className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-between md:flex-nowrap">
            <div className="flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95">
              <div className="mb-2 flex flex-col items-start justify-start">
                <div className="w-full">
                  <div className="mx-auto w-full rounded-2xl bg-white p-2">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between rounded-lg ring-1 ring-blue-100  px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                            <span>Frequência de Célula</span>
                            <ChevronUpIcon
                              className={`${open ? 'rotate-180 transform' : ''
                                } h-5 w-5 text-blue-500`}
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
