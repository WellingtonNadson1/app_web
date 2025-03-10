/* eslint-disable camelcase */
'use client';
import CalendarLiderCelula from '@/components/CalendarLiderCelula';
import LicoesCelula from '@/components/LicoesCelula';
import SpinnerButton from '@/components/spinners/SpinnerButton';
import { BASE_URL } from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format, isSameDay, parseISO, startOfToday } from 'date-fns';
import { pt } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import CalendarLoading from '../../(celula)/celula/loadingUi/CalendarLoading';
import LicoesLoading from '../../(celula)/celula/loadingUi/LicoesLoading';
import { Meeting } from '../../(celula)/celula/schema';
import ControlePresenceSupervisorFirst from './_components/ControlePresenceSupervisorFirst';
import ControlePresenceSupervisorSecond from './_components/ControlePresenceSupervisorSecond';
import HeaderSupervisao from './HeaderSupervisao';
import HeaderSupervisorLoad from './loadingUi';

export default function ControleSupervisor() {
  const { data: session, status } = useSession();
  const token = session?.user?.token as string;
  const axiosAuth = useAxiosAuth(token);

  const URLCultosInd = `${BASE_URL}/cultosindividuais/perperiodo`;

  const dataHoje = new Date();
  const firstDayOfMonth = new Date(dataHoje.getFullYear(), dataHoje.getMonth(), 1);
  const lastDayOfMonth = new Date(dataHoje.getFullYear(), dataHoje.getMonth() + 1, 0);

  const MeetingsData = async () => {
    try {
      const { data } = await axiosAuth.post(URLCultosInd, {
        firstDayOfMonth,
        lastDayOfMonth,
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Erro ao buscar reuniões:', error.response.data);
      } else {
        console.error(error);
      }
      throw error; // Re-throw para o useQuery tratar o erro
    }
  };

  const { data, isLoading, isSuccess } = useQuery<Meeting>({
    queryKey: ['meetingsData'],
    queryFn: MeetingsData,
    refetchOnWindowFocus: false,
    enabled: status === 'authenticated', // Só executa quando a sessão está autenticada
  });

  const today = startOfToday();
  const selectedDayMeetings = isSuccess
    ? data?.filter((meeting) => isSameDay(parseISO(meeting.data_inicio_culto), today))
    : [];

  // Renderização condicional após todos os hooks
  if (status === 'loading' || isLoading) {
    return (
      <div className="z-10 relative w-full px-2 py-2 mx-auto">
        <HeaderSupervisorLoad />
        <div className="relative flex flex-col w-full gap-3 px-2 mx-auto mt-3 mb-4">
          <CalendarLoading />
        </div>
        <div className="relative w-full px-2 mx-auto mb-4">
          <LicoesLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="z-10 relative w-full px-2 py-2 mx-auto">
      <div className="relative w-full mx-auto">
        <HeaderSupervisao headerSupervisao={session?.user?.supervisao_pertence.nome} />
      </div>
      <div className="relative flex flex-col w-full gap-3 px-2 mx-auto mt-3 mb-1">
        <CalendarLiderCelula />
      </div>
      <div className="relative w-full px-2 mx-auto mb-4">
        <LicoesCelula />
      </div>
      {/* FREQUENCIA DE PRESENCA NOS CULTOS #1 */}
      <div className="relative flex flex-col w-full gap-3 px-2 mx-auto mb-4">
        {selectedDayMeetings && selectedDayMeetings.length > 0 ? (
          session ? (
            <div
              key={selectedDayMeetings[0].id}
              id={selectedDayMeetings[0].id}
              className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap"
            >
              <div className="relative flex-col w-full p-4 bg-white rounded-lg shadow-md flex-warp hover:bg-white/95">
                <div className="flex flex-col items-start justify-start mb-2">
                  <div className="w-full">
                    <div className="w-full p-2 mx-auto bg-white rounded-2xl">
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                              <span>
                                Frequência de Culto -{' '}
                                {format(
                                  dayjs(new Date(selectedDayMeetings[0].data_inicio_culto))
                                    .add(3, 'hour')
                                    .toDate(),
                                  'Pp',
                                  { locale: pt },
                                )}
                              </span>
                              <ChevronUpIcon
                                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="w-full px-1 pt-4 pb-2 text-sm text-gray-500">
                              <ControlePresenceSupervisorFirst
                                id={selectedDayMeetings[0].id}
                                key={selectedDayMeetings[0].id}
                                culto={selectedDayMeetings[0].id}
                                supervisorId={session?.user?.id}
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
            <SpinnerButton message={''} key={selectedDayMeetings[0].id} />
          )
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
        )}
      </div>
      {/* FREQUENCIA DE PRESENCA NOS CULTOS #2 */}
      {selectedDayMeetings && selectedDayMeetings.length > 1 && (
        <div className="relative flex flex-col w-full gap-3 px-2 mx-auto mb-4">
          {session ? (
            <div
              key={selectedDayMeetings[1]?.id}
              id={selectedDayMeetings[1]?.id}
              className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap"
            >
              <div className="relative flex-col w-full p-4 bg-white rounded-lg shadow-md flex-warp hover:bg-white/95">
                <div className="flex flex-col items-start justify-start mb-2">
                  <div className="w-full">
                    <div className="w-full p-2 mx-auto bg-white rounded-2xl">
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                              <span>
                                Frequência de Culto -{' '}
                                {format(
                                  dayjs(new Date(selectedDayMeetings[1].data_inicio_culto))
                                    .add(3, 'hour')
                                    .toDate(),
                                  'Pp',
                                  { locale: pt },
                                )}
                              </span>
                              <ChevronUpIcon
                                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="w-full px-1 pt-4 pb-2 text-sm text-gray-500">
                              <ControlePresenceSupervisorSecond
                                id={selectedDayMeetings[1]?.id}
                                key={selectedDayMeetings[1]?.id}
                                culto={selectedDayMeetings[1]?.id}
                                supervisorId={session?.user?.id}
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
            <SpinnerButton message={''} key={selectedDayMeetings[1]?.id} />
          )}
        </div>
      )}
    </div>
  );
}
