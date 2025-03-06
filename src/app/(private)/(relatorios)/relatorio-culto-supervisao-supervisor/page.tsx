'use client';
import { TimePicker } from '@/components/timer-picker-input/time-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CorSupervision, ListSupervisores } from '@/contexts/ListSupervisores';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { addYears } from 'date-fns';
import dayjs from 'dayjs';
import ptBr from 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  FormRelatorioSupervisaoDataSchema,
  GroupedForCulto,
  Pessoa,
  PresencaForDate,
} from './schema';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { BASE_URL } from '@/lib/axios';
import Cookies from 'js-cookie';
import { HandsClapping, Spinner, WarningCircle } from '@phosphor-icons/react';
import BackButton from '@/components/back-button';
import MemberDetailsDialog from '@/components/member-details-dialog';

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);
dayjs.tz.setDefault('America/Sao_Paulo');

export default function StatsCardRelatoriosSupervisao() {
  const token_session = Cookies.get('session_token');
  const { data: session, status } = useSession();

  if (status === 'loading') {
    <p>carregando...</p>;
  }

  const idSupervision = session?.user?.supervisao_pertence?.id;

  console.log('idSupervision: ', idSupervision);

  const axiosAuth = useAxiosAuth(
    (token_session || session?.user?.token) as string,
  );

  const URLPresencaGeralCultos = `${BASE_URL}/relatorio/presencacultos`;
  const URLRelatorioPresenceCulto = `${BASE_URL}/cultosindividuais/fordate`;

  const [groupedForCell, setGroupedForCell] = useState<
    Record<string, Pessoa[]> | undefined
  >();
  const [dateCultoData, setDateCultoData] = useState<GroupedForCulto | null>(
    null,
  );
  const [corSupervisao, setCorSupervisao] = useState<string>('');
  const [idCultos, setIdCultos] = useState<string[] | undefined>();
  const [datasUnic, setDatasUnic] = useState<string[] | undefined>();
  const [numberOfRowsCell, setNumberOfRowsCell] = useState<
    number[] | undefined
  >();
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false);
  const [totalCultos, setTotalCultos] = useState<number>(0);
  const [totalCultosPrimicias, setTotalCultosPrimicias] = useState<number>(0);
  const [totalCultosSacrificio, setTotalCultosSacrificio] = useState<number>(0);
  const [totalCultosQuarta, setTotalCultosQuarta] = useState<number>(0);
  const [totalCultosSabado, setTotalCultosSabado] = useState<number>(0);
  const [totalCultosDomingoManha, setTotalCultosDomingoManha] =
    useState<number>(0);
  const [totalCultosDomingoTarde, setTotalCultosDomingoTarde] =
    useState<number>(0);

  const form = useForm<z.infer<typeof FormRelatorioSupervisaoDataSchema>>({
    resolver: zodResolver(FormRelatorioSupervisaoDataSchema),
    defaultValues: {
      superVisionId: idSupervision || '', // Define o valor inicial, vazio se a sessão não estiver pronta
    },
  });

  const today = new Date();
  const yearCalendar = addYears(today, 5).getFullYear();

  // Atualiza o superVisionId no formulário quando a sessão estiver disponível
  useEffect(() => {
    if (status === 'authenticated' && idSupervision) {
      form.setValue('superVisionId', idSupervision);
    }
  }, [status, idSupervision, form]);

  useEffect(() => {
    console.log('groupedForCell:', groupedForCell);
    console.log('idCultos:', idCultos);
  }, [groupedForCell, idCultos]);

  const handleRelatorio = async ({
    startDate,
    endDate,
    superVisionId,
  }: z.infer<typeof FormRelatorioSupervisaoDataSchema>) => {
    try {
      setIsLoadingSubmitForm(true);

      const adjustedEndDate = dayjs(endDate).add(1, 'day').toISOString();

      const [presencaGeralResponse, relatorioResponse] = await Promise.all([
        axiosAuth.post(URLPresencaGeralCultos, {
          startDate,
          endDate: adjustedEndDate,
          superVisionId,
        }),
        axiosAuth.post(URLRelatorioPresenceCulto, {
          superVisionId,
          startDate,
          endDate: adjustedEndDate,
        }),
      ]);

      const presencaGeralCultos = presencaGeralResponse.data as Pessoa[];
      const relatorioData = relatorioResponse.data;

      if (presencaGeralCultos) {
        const datasUnicas = new Set<string>();
        presencaGeralCultos.forEach((membro) => {
          membro.presencasFiltradas.forEach((presenca) => {
            datasUnicas.add(presenca.presenca_culto.data_inicio_culto);
          });
        });
        const datasArray: string[] = Array.from(datasUnicas).sort();
        setDatasUnic(datasArray);

        const dataGroupedForCell = groupDataByCell(presencaGeralCultos);
        setGroupedForCell(dataGroupedForCell);
      }

      if (
        presencaGeralCultos &&
        relatorioData &&
        presencaGeralCultos.length > 0
      ) {
        const ids = new Set<string>();
        presencaGeralCultos.forEach((membro) => {
          const presencasOrdenadas = membro.presencasFiltradas.sort(
            (a, b) =>
              new Date(a.presenca_culto.data_inicio_culto).getTime() -
              new Date(b.presenca_culto.data_inicio_culto).getTime(),
          );
          presencasOrdenadas.forEach((t) => {
            ids.add(t.cultoIndividualId);
          });
        });

        const sortedIds = Array.from(ids).sort((a, b) => {
          const cultoA = presencaGeralCultos.find((membro) =>
            membro.presencasFiltradas.some(
              (presenca) => presenca.cultoIndividualId === a,
            ),
          );
          const cultoB = presencaGeralCultos.find((membro) =>
            membro.presencasFiltradas.some(
              (presenca) => presenca.cultoIndividualId === b,
            ),
          );

          const dataInicioA = cultoA?.presencasFiltradas.find(
            (presenca) => presenca.cultoIndividualId === a,
          )?.presenca_culto.data_inicio_culto;
          const dataInicioB = cultoB?.presencasFiltradas.find(
            (presenca) => presenca.cultoIndividualId === b,
          )?.presenca_culto.data_inicio_culto;

          if (dataInicioA && dataInicioB) {
            return (
              new Date(dataInicioA).getTime() - new Date(dataInicioB).getTime()
            );
          }
          return 0;
        });
        setIdCultos(sortedIds);
      }

      const relatorio: PresencaForDate[] = Object.values(relatorioData);

      if (!relatorio || relatorio.length === 0) {
        console.log('Nenhum dado retornado pela API');
        setIsLoadingSubmitForm(false);
        return;
      }

      const dataGroupedForDateCulto: GroupedForCulto =
        groupDataByDateCulto(relatorio);

      setCorSupervisao(
        relatorio[0].presencas_culto[0].membro.supervisao_pertence.nome,
      );

      setTotalCultos(relatorio.pop() as unknown as number);
      setTotalCultosDomingoTarde(relatorio.pop() as unknown as number);
      setTotalCultosDomingoManha(relatorio.pop() as unknown as number);
      setTotalCultosSabado(relatorio.pop() as unknown as number);
      setTotalCultosSacrificio(relatorio.pop() as unknown as number);
      setTotalCultosPrimicias(relatorio.pop() as unknown as number);
      setTotalCultosQuarta(relatorio.pop() as unknown as number);

      setDateCultoData(dataGroupedForDateCulto);
      setIsLoadingSubmitForm(false);
    } catch (error) {
      setIsLoadingSubmitForm(false);
      console.error('Erro ao buscar o relatório:', error);
      alert('Erro ao gerar o relatório. Verifique os dados e tente novamente.');
    } finally {
      setIsLoadingSubmitForm(false);
    }
  };

  const handleFunctions = (
    data: z.infer<typeof FormRelatorioSupervisaoDataSchema>,
  ) => {
    console.log('Formulário submetido com dados:', data);
    handleRelatorio(data); // Apenas chama handleRelatorio, sem sobrescrever superVisionId
  };

  const groupDataByDateCulto = (relatorio: PresencaForDate[]) => {
    const groupedDataForDateCulto: GroupedForCulto = {};
    relatorio.forEach((entry) => {
      const dateCultoId = entry.data_inicio_culto;
      if (dateCultoId) {
        if (!groupedDataForDateCulto[dateCultoId]) {
          groupedDataForDateCulto[dateCultoId] = [];
        }
        groupedDataForDateCulto[dateCultoId].push(entry);
      }
    });
    return groupedDataForDateCulto;
  };

  const groupDataByCell = (relatorio: Pessoa[]): Record<string, Pessoa[]> => {
    const grupos: Record<string, Pessoa[]> = {};
    relatorio.forEach((person) => {
      const cellName = person.celula?.nome;
      if (cellName) {
        if (!grupos[cellName]) {
          grupos[cellName] = [];
        }
        grupos[cellName].push(person);
      }
    });
    return grupos;
  };

  const newCorSupervisao = CorSupervision(corSupervisao);
  const Supervisor = ListSupervisores(corSupervisao);

  useEffect(() => {
    const rowsCellName = new Set<number>();
    const rowsNameCell: number[] =
      groupedForCell && idCultos
        ? Object.keys(groupedForCell).map((cellName) => {
            const length = groupedForCell[cellName].length;
            rowsCellName.add(length);
            return length;
          })
        : [];
    setNumberOfRowsCell(rowsNameCell);
  }, [groupedForCell, idCultos]);

  // Renderiza apenas se a sessão estiver carregada
  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  return (
    <div className="relative z-40 p-2 bg-white rounded-sm">
      <div className="px-3 mt-2 mb-3">
        <Fragment>
          <div className="p-3">
            {/* HEADER */}
            <div className="flex items-center justify-start gap-4">
              <a href={'/dashboard'}>
                <Image
                  className="cursor-pointer"
                  src="/images/logo-ibb-1.svg"
                  width={62}
                  height={64}
                  alt="Logo IBB"
                />
              </a>
              <div>
                <h1 className="text-base leading-normal text-gray-600 uppercase">
                  Igreja Batista Betânia - Lugar do derramar de Deus
                </h1>
                <h2 className="text-sm leading-normal text-gray-400 uppercase">
                  Relatório de Supervisão
                </h2>
              </div>
            </div>

            <BackButton label="Voltar" className="my-6" />

            {/* FORMS */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFunctions)}>
                <div className="grid grid-cols-1 items-center justify-center mt-10 gap-2 gap-y-6 sm:grid-cols-12">
                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de início</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value ? (
                                    dayjs(field.value)
                                      .utc()
                                      .local()
                                      .locale('pt-br')
                                      .format('DD-MM-YYYY HH:mm:ss')
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                className="flex items-center justify-center gap-1"
                                captionLayout="dropdown-buttons"
                                selected={field.value}
                                onSelect={field.onChange}
                                fromYear={2023}
                                toYear={yearCalendar}
                                initialFocus
                              />
                              <div className="p-3 border-t border-border">
                                <TimePicker
                                  setDate={field.onChange}
                                  date={field.value}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* DATA FINAL */}
                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data final</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value ? (
                                    dayjs(field.value)
                                      .utc()
                                      .local()
                                      .locale('pt-br')
                                      .format('DD-MM-YYYY HH:mm:ss')
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                captionLayout="dropdown-buttons"
                                selected={field.value}
                                onSelect={field.onChange}
                                fromYear={2023}
                                toYear={yearCalendar}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                              <div className="p-3 border-t border-border">
                                <TimePicker
                                  setDate={field.onChange}
                                  date={field.value}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Botões para submeter Forms */}
                  <div className="flex flex-col w-full sm:justify-center sm:items-center sm:col-span-2">
                    <div className="sm:mt-6 w-full">
                      {isLoadingSubmitForm ? (
                        <Button
                          type="submit"
                          disabled
                          className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md shadow-sm"
                        >
                          <Spinner
                            className="animate-spin h-5 w-5"
                            color="white"
                          />
                          <span>Gerando...</span>
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="px-3 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        >
                          <span>Relatório</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </Fragment>
      </div>

      {/* Início Relatório */}
      {groupedForCell ? (
        <div
          className={cn(
            `bg-yellow-400 w-full text-center text-white`,
            `${newCorSupervisao}`,
          )}
        >
          <div className="pt-2 pb-0">
            <h1 className="py-1 font-bold uppercase">
              RELATÓRIO - SUPERVISÃO - {corSupervisao}
            </h1>
          </div>
          {totalCultos ? (
            <div className="pb-2 pl-2">
              <p className="p-2 text-base font-medium uppercase text-start">
                SUPERVISOR(ES):{' '}
                <span className="font-normal">{Supervisor}</span>
              </p>
            </div>
          ) : (
            <div className="pb-2 pl-2">
              <p className="p-2 text-base font-medium uppercase text-start">
                SUPERVISOR(ES): <span className="font-normal">Sem Dados</span>
              </p>
            </div>
          )}
          <div className="flex items-center justify-between gap-2 pb-2 pl-2 text-zinc-700 bg-slate-50">
            {totalCultos ? (
              <div>
                <p className="p-2 text-base font-medium uppercase text-start">
                  TOTAL DE CULTOS:{' '}
                  <span className="font-normal">{totalCultos}</span>
                </p>
              </div>
            ) : (
              <div>
                <p className="p-2 text-base font-medium uppercase text-start">
                  TOTAL DE CULTOS:{' '}
                  <span className="font-normal">Sem Registro</span>
                </p>
              </div>
            )}
            {totalCultosPrimicias ? (
              <div>
                <p className="p-2 font-medium uppercase text-start">
                  CULTOS DE PRIMÍCIAS:{' '}
                  <span className="font-normal">{totalCultosPrimicias}</span>
                </p>
              </div>
            ) : (
              <div className="hidden" />
            )}
            {totalCultosSacrificio ? (
              <div>
                <p className="p-2 font-medium uppercase text-start">
                  DOMINGO DE SACRIFÍCIO:{' '}
                  <span className="font-normal">{totalCultosSacrificio}</span>
                </p>
              </div>
            ) : (
              <div className="hidden" />
            )}
            <div>
              {totalCultosDomingoManha ? (
                <p className="p-2 font-medium uppercase text-start">
                  DOMINGO MANHÃ:{' '}
                  <span className="font-normal">{totalCultosDomingoManha}</span>
                </p>
              ) : (
                <p className="p-2 font-medium uppercase text-start">
                  DOMINGO MANHÃ:{' '}
                  <span className="font-normal">Sem Registro</span>
                </p>
              )}
            </div>
            <div>
              {totalCultosDomingoTarde ? (
                <p className="p-2 font-medium uppercase text-start">
                  DOMINGO TARDE:{' '}
                  <span className="font-normal">{totalCultosDomingoTarde}</span>
                </p>
              ) : (
                <p className="p-2 font-medium uppercase text-start">
                  DOMINGO TARDE:{' '}
                  <span className="font-normal">Sem Registro</span>
                </p>
              )}
            </div>
            <div>
              {totalCultosSabado ? (
                <p className="p-2 font-medium uppercase text-start">
                  SÁBADO (CPD):{' '}
                  <span className="font-normal">{totalCultosSabado}</span>
                </p>
              ) : (
                <p className="p-2 font-medium uppercase text-start">
                  SÁBADO (CPD):{' '}
                  <span className="font-normal">Sem Registro</span>
                </p>
              )}
            </div>
            <div>
              {totalCultosQuarta ? (
                <p className="p-2 font-medium uppercase text-start">
                  CULTOS DE QUARTA:{' '}
                  <span className="font-normal">{totalCultosQuarta}</span>
                </p>
              ) : (
                <p className="p-2 font-medium uppercase text-start">
                  CULTOS DE QUARTA:{' '}
                  <span className="font-normal">Sem Registro</span>
                </p>
              )}
            </div>
          </div>

          <table className="text-sm text-left text-gray-500 auto-table dark:text-gray-400">
            <thead className={cn(`p-2 text-center `, `${newCorSupervisao}`)}>
              <Fragment>
                <tr className="mx-4 p-2 ">
                  <th className="border border-zinc-100">
                    <h1 className="p-2 font-bold text-center text-white uppercase">
                      CÉLULAS
                    </h1>
                  </th>
                  <th className="border border-zinc-100">
                    <h1 className="p-2 font-bold text-center text-white uppercase">
                      MEMBROS
                    </h1>
                  </th>
                  <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                    <div>
                      <h1 className="font-bold text-center uppercase">
                        TOTAL PRES.
                      </h1>
                    </div>
                  </th>
                  {totalCultosPrimicias ? (
                    <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                      <div>
                        <h1 className="font-bold text-center uppercase">%</h1>
                        <h1 className="font-bold text-center uppercase">
                          PRIMI.
                        </h1>
                      </div>
                    </th>
                  ) : (
                    <th className="hidden" />
                  )}
                  {totalCultosSacrificio ? (
                    <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                      <div>
                        <h1 className="font-bold text-center uppercase">%</h1>
                        <h1 className="font-bold text-center uppercase">
                          SACRIFI.
                        </h1>
                      </div>
                    </th>
                  ) : (
                    <th className="hidden" />
                  )}
                  <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                    <div className="text-center">
                      <h1 className="font-bold text-center uppercase">%</h1>
                      <h1 className="font-bold text-center uppercase">
                        DOM M.
                      </h1>
                    </div>
                  </th>
                  <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                    <div className="text-center">
                      <h1 className="font-bold text-center uppercase">%</h1>
                      <h1 className="font-bold text-center uppercase">
                        DOM T.
                      </h1>
                    </div>
                  </th>
                  <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                    <div className="text-center">
                      <h1 className="font-bold text-center uppercase">%</h1>
                      <h1 className="font-bold text-center uppercase">CPD</h1>
                    </div>
                  </th>
                  <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                    <div className="text-center">
                      <h1 className="font-bold text-center uppercase">%</h1>
                      <h1 className="font-bold text-center uppercase">
                        QUARTA
                      </h1>
                    </div>
                  </th>
                  {datasUnic &&
                    datasUnic.map((dataCulto, dataCultoIndex) => (
                      <th
                        className="border border-zinc-100 flex-col items-center justify-center w-20 h-20 p-2 text-white"
                        key={dataCultoIndex}
                      >
                        <div>
                          <p>
                            {`${dayjs(dataCulto).format('ddd').toUpperCase()}`}
                          </p>
                          <p>{`${dayjs(dataCulto).format('DD/MM')}`}</p>
                        </div>
                      </th>
                    ))}
                </tr>
              </Fragment>
            </thead>
            <tbody>
              {groupedForCell &&
                idCultos &&
                Object.keys(groupedForCell).map((cellName, cellIndex) => (
                  <tr
                    className="border-b bg-slate-50"
                    key={cellName + cellIndex}
                  >
                    <td className="px-4 bg-gray-50">
                      <p className="text-base font-medium text-black">
                        {cellName}
                      </p>
                      <p className="text-sm font-medium text-slate-600 w-36">
                        Líder:{' '}
                        <span className="font-normal">
                          {groupedForCell[cellName][0].celula.lider.first_name}
                        </span>
                      </p>
                      <p className="text-sm text-slate-600">
                        Membros: <span>{groupedForCell[cellName].length}</span>
                      </p>
                    </td>
                    {/* LINK PARA ACESSAR DETALHE DO MEMBRO */}
                    <td className="bg-slate-100 border border-zinc-200">
                      {groupedForCell[cellName].map((member) => {
                        // Calcula o total de presenças verdadeiras
                        const presencas = member.presencas_cultos.filter(
                          (status) => status.status === true,
                        ).length;
                        // Calcula a porcentagem
                        const porcentagem = (presencas / totalCultos) * 100;
                        const isMenor = porcentagem < 50;
                        // Define a classe de cor com base na porcentagem
                        const corClasse = isMenor
                          ? 'bg-red-400 text-white'
                          : 'bg-emerald-50';

                        return (
                          <tr
                            className="h-20 w-full border-b border-zinc-200 cursor-pointer"
                            key={member.id}
                          >
                            <MemberDetailsDialog
                              memberId={member.id}
                              trigger={
                                <div
                                  className={`relative px-4 py-4 flex flex-col justify-center h-20 text-slate-600 w-36 ${corClasse}`}
                                >
                                  {member.first_name}
                                  {isMenor ? (
                                    <div className="absolute right-1 top-1 p-0 rounded-full bg-white animate-pulse">
                                      <WarningCircle color="red" size={24} />
                                    </div>
                                  ) : (
                                    <div className="absolute right-1 top-1 p-0 rounded-full bg-white animate-pulse">
                                      <HandsClapping color="green" size={24} />
                                    </div>
                                  )}
                                </div>
                              }
                            />
                          </tr>
                        );
                      })}
                    </td>
                    <td className="bg-slate-100 border border-zinc-200">
                      {groupedForCell[cellName].map((member) => {
                        // Calcula o total de presenças verdadeiras
                        const presencas = member.presencas_cultos.filter(
                          (status) => status.status === true,
                        ).length;
                        // Calcula a porcentagem
                        const porcentagem = (presencas / totalCultos) * 100;
                        // Define a classe de cor com base na porcentagem
                        const corClasse =
                          porcentagem < 50 ? 'text-red-600' : 'text-green-600';

                        return (
                          <tr className="border-b bg-slate-50" key={member.id}>
                            <div className="flex gap-1 items-center justify-center w-20 h-20">
                              <span className="text-slate-600 font-bold">
                                {totalCultos}
                              </span>{' '}
                              /{' '}
                              <span className={`${corClasse} font-bold`}>
                                {presencas}
                              </span>
                            </div>
                          </tr>
                        );
                      })}
                    </td>
                    {totalCultosPrimicias ? (
                      <td className="bg-slate-100 border border-zinc-200">
                        {groupedForCell[cellName].map((member) => (
                          <tr className="border-b bg-slate-50" key={member.id}>
                            <div className="flex flex-col items-center justify-center w-20 h-20">
                              {member.cultos.porcentagemPresencaPrimicia} %
                            </div>
                          </tr>
                        ))}
                      </td>
                    ) : (
                      <div className="hidden" />
                    )}
                    {totalCultosSacrificio ? (
                      <td className="bg-slate-100 border border-zinc-200">
                        {groupedForCell[cellName].map((member) => (
                          <tr className="border-b bg-slate-50" key={member.id}>
                            <div className="flex flex-col items-center justify-center w-20 h-20">
                              {
                                member.cultos
                                  .porcentagemPresencaDomingoSacrificio
                              }{' '}
                              %
                            </div>
                          </tr>
                        ))}
                      </td>
                    ) : (
                      <div className="hidden" />
                    )}
                    <td className="bg-slate-100 border border-zinc-200">
                      {groupedForCell[cellName].map((member) => (
                        <tr className="border-b bg-slate-50" key={member.id}>
                          <div className="flex flex-col items-center justify-center w-20 h-20">
                            {member.cultos.porcentagemPresencaTotalDomingoManha}{' '}
                            %
                          </div>
                        </tr>
                      ))}
                    </td>
                    <td className="bg-slate-100 border border-zinc-200">
                      {groupedForCell[cellName].map((member) => (
                        <tr className="border-b bg-slate-50" key={member.id}>
                          <div className="flex flex-col items-center justify-center w-20 h-20">
                            {member.cultos.porcentagemPresencaTotalDomingoTarde}{' '}
                            %
                          </div>
                        </tr>
                      ))}
                    </td>
                    <td className="bg-slate-100 border border-zinc-200">
                      {groupedForCell[cellName].map((member) => (
                        <tr className="border-b bg-slate-50" key={member.id}>
                          <div className="flex flex-col items-center justify-center w-20 h-20">
                            {member.cultos.porcentagemPresencaSabado} %
                          </div>
                        </tr>
                      ))}
                    </td>
                    <td className="bg-slate-100 border border-zinc-200">
                      {groupedForCell[cellName].map((member) => (
                        <tr className="border-b bg-slate-50" key={member.id}>
                          <div className="flex flex-col items-center justify-center w-20 h-20">
                            {member.cultos.porcentagemPresencaQuarta} %
                          </div>
                        </tr>
                      ))}
                    </td>
                    {idCultos.map((cultoId, indexCulto) => (
                      <td
                        className="mx-4 text-center"
                        key={cultoId + indexCulto}
                      >
                        {groupedForCell[cellName].map((member, indexMember) => {
                          const presenceCulto = member.presencas_cultos.find(
                            (p) => p.cultoIndividualId === cultoId,
                          );
                          return (
                            <tr className="border-b bg-slate-50">
                              <div
                                className={cn(
                                  'flex flex-col justify-center w-20 h-20 font-bold',
                                  presenceCulto?.status === true
                                    ? 'bg-green-50'
                                    : presenceCulto?.status === false
                                      ? 'bg-red-50'
                                      : 'bg-zinc-50',
                                )}
                                key={cultoId + indexMember}
                              >
                                {presenceCulto ? (
                                  <Fragment>
                                    {presenceCulto.status === true && (
                                      <p className="text-green-600">P</p>
                                    )}
                                    {presenceCulto.status === false && (
                                      <p className="text-red-600">F</p>
                                    )}
                                  </Fragment>
                                ) : (
                                  <p className="font-normal text-slate-600">
                                    -
                                  </p>
                                )}
                              </div>
                            </tr>
                          );
                        })}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-4">
          <p>
            Nenhum dado disponível. Preencha o formulário para gerar o
            relatório.
          </p>
        </div>
      )}
    </div>
  );
}
