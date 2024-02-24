/* eslint-disable camelcase */
'use client'
import CalendarLiderCelula from '@/components/CalendarLiderCelula'
import LicoesCelula from '@/components/LicoesCelula'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { BASE_URL, BASE_URL_LOCAL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { format, isSameDay, parseISO, startOfToday } from 'date-fns'
import { pt } from 'date-fns/locale'
import { useSession } from 'next-auth/react'
import ControlePresencaCelula from './ControlePresencaCelula'
import ControlePresencaReuniaoCelula from './ControlePresencaReuniaoCelula'
import HeaderCelula from './HeaderCelula'
import { CelulaProps, Meeting } from './schema'
import HeaderCelulaLoad from './loadingUi/HeaderCelulaLoading'
// import AvisoLicoesCelula from '@/components/AvisoLicoesCelula'
import axios from 'axios'
import { useUserDataStore } from '@/store/UserDataStore'
import CalendarLoading from './loadingUi/CalendarLoading'
import LicoesLoading from './loadingUi/LicoesLoading'

export default function ControleCelulaSupervision() {
  const { data: session } = useSession()

  const celulaId = session?.user.celulaId
  const { token } = useUserDataStore.getState()

  const axiosAuth = useAxiosAuthToken(token)

  const URLCultosInd = `${BASE_URL}/cultosindividuais/perperiodo`
  const URLCelula = `${BASE_URL}/celulas/${celulaId}`

  const CelulaData = async () => {
    try {
      const result = await axiosAuth.get(URLCelula)
      return await result.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const { data: celula, isLoading: isLoadingCelula } = useQuery<CelulaProps>({
    queryKey: ['celula', celulaId],
    queryFn: CelulaData,
    enabled: !!celulaId,
    refetchOnWindowFocus: false,
    retry: false
  })

  const dataHoje = new Date()
  const dayOfWeek = dataHoje.getDay()
  const firstDayOfMonth = new Date(dataHoje.getFullYear(), dataHoje.getMonth(), 1);
  const lastDayOfMonth = new Date(dataHoje.getFullYear(), dataHoje.getMonth() + 1, 0);

  const MeetingsData = async () => {
    try {
      const { data } = await axiosAuth.post(URLCultosInd, {
        firstDayOfMonth,
        lastDayOfMonth
      })
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const { data, isLoading, isSuccess } = useQuery<Meeting>({
    queryKey: ['meetingsData'],
    queryFn: MeetingsData,
    refetchOnWindowFocus: false,
  })

  if (isSuccess) {
    console.log('data', data)
  }

  const today = startOfToday()

  const selectedDayMeetings = data?.filter((meeting) =>
    isSameDay(parseISO(meeting.data_inicio_culto), today),
  )

  return (
    <>
      {isLoadingCelula ? (
        <>
          <div className="relative w-full px-2 py-2 mx-auto">
            <HeaderCelulaLoad />
            <div className="relative flex flex-col w-full gap-3 px-2 mx-auto mt-3 mb-4">
              <CalendarLoading />
            </div>
            <div className="relative w-full px-2 mx-auto mb-4">
              <LicoesLoading />
            </div>
          </div>
        </>
      ) : (
        <div className="relative w-full px-2 py-2 mx-auto">
          <div className="relative w-full mx-auto">
            <HeaderCelula headerCelula={celula?.nome} />
          </div>
          <div className="relative flex flex-col w-full gap-3 px-2 mx-auto mt-3 mb-4">
            <CalendarLiderCelula />
          </div>
          <div className="relative w-full px-2 mx-auto mb-4">
            <LicoesCelula />
          </div>
          <div className="relative flex flex-col w-full gap-3 px-2 mx-auto mb-4">
            {isLoading ? (
              <SpinnerButton message={''} />
            ) : selectedDayMeetings && selectedDayMeetings.length > 0 ? (
              selectedDayMeetings.map((meeting) => (
                isSameDay(parseISO(meeting.data_inicio_culto), today) ? (
                  celula ? (
                    <div key={meeting.id} className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
                      <div className="relative flex-col w-full p-4 bg-white rounded-lg shadow-md flex-warp hover:bg-white/95">
                        <div className="flex flex-col items-start justify-start mb-2">
                          <div className="w-full">
                            <div className="w-full p-2 mx-auto bg-white rounded-2xl">
                              <Disclosure>
                                {({ open }) => (
                                  <>
                                    <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                                      <span>Frequência de Culto - {format(new Date(meeting.data_inicio_culto), 'Pp', { locale: pt })}</span>
                                      <ChevronUpIcon
                                        className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                                      />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="w-full px-1 pt-4 pb-2 text-sm text-gray-500">
                                      <ControlePresencaCelula
                                        culto={meeting.id}
                                        celula={celula}
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
                    <SpinnerButton message={''} key={meeting.id} />
                  )
                ) : <SpinnerButton message={''} key={meeting.id} />
              ))
            ) : (
              <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
                <div className="relative flex-col w-full p-4 bg-white rounded-lg shadow-md flex-warp hover:bg-white/95">
                  <div className="flex flex-col items-start justify-start mb-2">
                    <div className="w-full">
                      <div className="w-full p-2 mx-auto bg-white rounded-2xl">
                        <Disclosure>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                                <span>Frequência de Culto</span>
                                <ChevronUpIcon
                                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="w-full px-1 pt-4 pb-2 text-sm text-gray-500">
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
          <div className="relative w-full px-2 mx-auto mb-4">
            {celula && Number(celula.date_que_ocorre) === dayOfWeek ? (
              <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
                <div className="relative flex-col w-full p-4 bg-white rounded-lg shadow-md flex-warp hover:bg-white/95">
                  <div className="flex flex-col items-start justify-start mb-2">
                    <div className="w-full">
                      <div className="w-full p-2 mx-auto bg-white rounded-2xl">
                        <Disclosure>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                                <span>Frequência de Célula - {format(today, 'P', { locale: pt })}</span>
                                <ChevronUpIcon
                                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="w-full px-1 pt-4 pb-2 text-sm text-gray-500">
                                <ControlePresencaReuniaoCelula
                                  dataCelula={celula}
                                  celulaId={celula.id}
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
              <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
                <div className="relative flex-col w-full p-4 bg-white rounded-lg shadow-md flex-warp hover:bg-white/95">
                  <div className="flex flex-col items-start justify-start mb-2">
                    <div className="w-full">
                      <div className="w-full p-2 mx-auto bg-white rounded-2xl">
                        <Disclosure>
                          {({ open }) => (
                            <>
                              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                                <span>Frequência de Célula</span>
                                <ChevronUpIcon
                                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="w-full px-1 pt-4 pb-2 text-sm text-gray-500">
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
      )}
    </>
  )
}
