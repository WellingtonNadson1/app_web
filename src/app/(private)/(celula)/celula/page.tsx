/* eslint-disable camelcase */
'use client';
import CalendarLiderCelula from '@/components/CalendarLiderCelula';
import LicoesCelula from '@/components/LicoesCelula';
import SpinnerButton from '@/components/spinners/SpinnerButton';
import { Card } from '@/components/ui/card';
import api, { BASE_URL } from '@/lib/axios';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format, isSameDay, parseISO, startOfToday } from 'date-fns';
import { pt } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { RegisterPresenceFormFirst } from './_components/ControlePresenceFirst/registerpresence';
import { RegisterPresenceFormSecond } from './_components/ControlePresenceSecond/registerpresencesecond';
import ControlePresencaReuniaoCelula from './ControlePresencaReuniaoCelula';
import HeaderCelula from './HeaderCelula';
import CalendarLoading from './loadingUi/CalendarLoading';
import HeaderCelulaLoad from './loadingUi/HeaderCelulaLoading';
import LicoesLoading from './loadingUi/LicoesLoading';
import { Celula, Meeting } from './schema';

export default function ControleCelulaSupervision() {
  const [idPrimeiroCulto, setIdPrimeiroCulto] = useState<string | null>(null);
  const [idSegundoCulto, setIdSegundoCulto] = useState<string | null>(null);
  const [presenceIsRegister, setPresenceIsRegister] = useState(false);
  const [secondPresenceIsRegister, setSecondPresenceIsRegister] =
    useState(false);
  const { data: session, status } = useSession();

  const celulaId = session?.user?.celulaId;

  const URLCultosInd = `${BASE_URL}/cultosindividuais/perperiodo`;
  const URLCelula = `${BASE_URL}/celulas/${celulaId}`;

  const CelulaData = async () => {
    try {
      const result = await api.post(URLCelula, {
        idPrimeiroCulto,
        idSegundoCulto,
      });
      const existPresenceForCulto =
        result.data.membros[0].presencas_cultos.length > 0;
      setPresenceIsRegister(existPresenceForCulto);
      const existSecondPresenceForCulto =
        result.data.membros[0].presencas_cultos.length > 1;
      setSecondPresenceIsRegister(existSecondPresenceForCulto);
      return result.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Erro ao buscar célula:', error.response.data);
      } else {
        console.error(error);
      }
      throw error; // Re-throw para o TanStack Query lidar com o erro
    }
  };

  const MeetingsData = async () => {
    const dataHoje = new Date();
    const firstDayOfMonth = new Date(
      dataHoje.getFullYear(),
      dataHoje.getMonth(),
      1,
    );
    const lastDayOfMonth = new Date(
      dataHoje.getFullYear(),
      dataHoje.getMonth() + 1,
      0,
    );
    try {
      const { data } = await api.post(URLCultosInd, {
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
      throw error;
    }
  };

  const { data: meetingsData, isLoading: isLoadingMeetings } =
    useQuery<Meeting>({
      queryKey: ['meetingsData', celulaId],
      queryFn: MeetingsData,
      enabled: status === 'authenticated' && !!celulaId,
      refetchOnWindowFocus: false,
    });

  const { data: celula } = useQuery<Celula>({
    queryKey: ['celula', celulaId, idPrimeiroCulto, idSegundoCulto],
    queryFn: CelulaData,
    enabled:
      status === 'authenticated' &&
      !!celulaId &&
      (!!idPrimeiroCulto || !!idSegundoCulto),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const today = startOfToday();
  const selectedDayMeetings = meetingsData?.filter((meeting) =>
    isSameDay(parseISO(meeting.data_inicio_culto), today),
  );

  useEffect(() => {
    if (selectedDayMeetings && selectedDayMeetings.length > 0) {
      setIdPrimeiroCulto(selectedDayMeetings[0].id);
    }
    if (selectedDayMeetings && selectedDayMeetings.length > 1) {
      setIdSegundoCulto(selectedDayMeetings[1].id);
    }
  }, [selectedDayMeetings]);

  const dayOfWeek = today.getDay();

  if (status === 'loading' || isLoadingMeetings) {
    return (
      <div className="z-10 relative w-full px-2 py-2 mx-auto">
        <HeaderCelulaLoad />
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
        <HeaderCelula headerCelula={celula?.nome} />
      </div>
      <CalendarLiderCelula />
      <LicoesCelula />
      {/* FREQUENCIA DE PRESENCA NOS CULTOS #1 */}
      <Card className="bg-white relative w-full mx-auto mb-4">
        {selectedDayMeetings && selectedDayMeetings.length > 0 ? (
          celula ? (
            <div
              key={selectedDayMeetings[0].id}
              id={selectedDayMeetings[0].id}
              className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap"
            >
              <div className="relative flex-col w-full p-4 rounded-lg flex-warp">
                <div className="flex flex-col items-start justify-start mb-2">
                  <div className="w-full">
                    <div className="w-full p-2 mx-auto rounded-2xl">
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                              <span>
                                Frequência de Culto -{' '}
                                {format(
                                  dayjs(
                                    new Date(
                                      selectedDayMeetings[0].data_inicio_culto,
                                    ),
                                  )
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
                              {!presenceIsRegister ? (
                                <RegisterPresenceFormFirst
                                  id={selectedDayMeetings[0].id}
                                  key={selectedDayMeetings[0].id}
                                  culto={selectedDayMeetings[0].id}
                                  celula={celula}
                                />
                              ) : (
                                <p>Presença já registrada!</p>
                              )}
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
          <div className="relative w-full rounded-md mx-auto mb-1">
            <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
              <div className="relative flex-col w-full p-4 rounded-lg flex-warp">
                <div className="flex flex-col items-start justify-start mb-2">
                  <div className="w-full">
                    <div className="w-full p-2 mx-auto rounded-2xl">
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
          </div>
        )}
      </Card>
      {/* FREQUENCIA DE PRESENCA NOS CULTOS #2 */}
      {selectedDayMeetings && selectedDayMeetings.length > 1 && (
        <Card className="bg-white relative w-full mx-auto mb-4">
          {celula ? (
            <div
              key={selectedDayMeetings[1]?.id}
              id={selectedDayMeetings[1]?.id}
              className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap"
            >
              <div className="relative flex-col w-full p-4 rounded-lg flex-warp">
                <div className="flex flex-col items-start justify-start mb-2">
                  <div className="w-full">
                    <div className="w-full p-2 mx-auto rounded-2xl">
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                              <span>
                                Frequência de Culto -{' '}
                                {format(
                                  dayjs(
                                    new Date(
                                      selectedDayMeetings[1].data_inicio_culto,
                                    ),
                                  )
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
                              {!secondPresenceIsRegister ? (
                                <RegisterPresenceFormSecond
                                  id={selectedDayMeetings[1]?.id}
                                  key={selectedDayMeetings[1]?.id}
                                  culto={selectedDayMeetings[1]?.id}
                                  celula={celula}
                                />
                              ) : (
                                <p>Presença já registrada!</p>
                              )}
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
        </Card>
      )}
      {/* FREQUENCIA DE REUNIAO DE CELULA */}
      <Card className="bg-white relative w-full mx-auto mb-4">
        {celula && Number(celula.date_que_ocorre) === dayOfWeek ? (
          <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
            <div className="relative flex-col w-full p-4 rounded-lg flex-warp">
              <div className="flex flex-col items-start justify-start mb-2">
                <div className="w-full">
                  <div className="w-full p-2 mx-auto rounded-2xl">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                            <span>
                              Frequência de Célula -{' '}
                              {format(today, 'P', { locale: pt })}
                            </span>
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
            <div className="relative flex-col w-full p-4 rounded-lg flex-warp">
              <div className="flex flex-col items-start justify-start mb-2">
                <div className="w-full">
                  <div className="w-full p-2 mx-auto rounded-2xl">
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
      </Card>
    </div>
  );
}
