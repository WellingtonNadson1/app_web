'use client'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState, Fragment } from 'react'
import utc from 'dayjs/plugin/utc'
import timezone from "dayjs/plugin/timezone"
import ptBr from "dayjs/locale/pt-br"
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { FormRelatorioSchema, GroupedForCulto, Pessoa, PresencaForDate } from './schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CorSupervision, ListSupervisores } from '@/contexts/ListSupervisores'
import Image from 'next/image'
import { useCombinetedStore } from '@/store/DataCombineted'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
dayjs.extend(localizedFormat)
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);
dayjs.tz.setDefault('America/Sao_Paulo')

export default function StatsCardRelatoriosSupervisores() {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  // const URLPresencaGeralCultos = `http://localhost:3333/presencacultos/relatorios/supervisores`
  // const URLRelatorioPresenceCulto = `http://localhost:3333/cultosindividuais/fordate`
  // const URLSupervisoes = `http://localhost:3333/supervisoes`

  const URLSupervisoes = `${BASE_URL}/supervisoes`
  const URLPresencaGeralCultos = `${BASE_URL}/presencacultos/relatorios/supervisores`
  const URLRelatorioPresenceCulto = `${BASE_URL}/cultosindividuais/fordate`

  const [groupedForCell, setGroupedForCell] = useState<Record<string, Pessoa[]> | undefined>();
  const [dateCultoData, setDateCultoData] = useState<GroupedForCulto | null>(null);
  const [corSupervisao, setCorSupervisao] = useState('');
  const [idCultos, setIdCultos] = useState<string[] | undefined>()
  const [datasUnic, setDatasUnic] = useState<string[] | undefined>()
  const [numberOfRowsCell, setNumberOfRowsCell] = useState<number[] | undefined>();
  const { register, handleSubmit, reset } = useForm<FormRelatorioSchema>()
  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>()
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const [totalCultos, setTotalCultos] = useState<number>(0)
  const [totalCultosPrimicias, setTotalCultosPrimicias] = useState<number>(0)
  const [totalCultosSacrificio, setTotalCultosSacrificio] = useState<number>(0)
  const [totalCultosQuarta, setTotalCultosQuarta] = useState<number>(0)
  const [totalCultosSabado, setTotalCultosSabado] = useState<number>(0)
  const [totalCultosDomingoManha, setTotalCultosDomingoManha] = useState<number>(0)
  const [totalCultosDomingoTarde, setTotalCultosDomingoTarde] = useState<number>(0)

  const { supervisoes, cargoLideranca } = useCombinetedStore.getState().state

  const cargoLiderancaFilter = cargoLideranca.filter(cargo =>
    cargo.nome !== "Pastor" &&
    cargo.nome !== "Líder de Célula" &&
    cargo.nome !== "Membro" &&
    cargo.nome !== "Líder Auxiliar" &&
    cargo.nome !== "Líder de Célula Supervisor"
  )

  const DataGeralCultos = async (
    startDate: string,
    endDate: string,
    superVisionId: string,
    cargoLideranca: string[]
  ) => {
    const { data } = await axiosAuth.post(URLPresencaGeralCultos, {
      startDate,
      endDate,
      superVisionId,
      cargoLideranca
    });
    return data
  }


  const handleRelatorio: SubmitHandler<FormRelatorioSchema> = async ({ startDate, endDate, superVisionId, cargoLideranca }) => {
    try {
      setIsLoadingSubmitForm(true)

      dayjs(startDate).tz("America/Sao_Paulo").toISOString();
      dayjs(endDate).tz("America/Sao_Paulo").toISOString();

      const data = await DataGeralCultos(
        startDate,
        endDate,
        superVisionId,
        cargoLideranca
      );

      const { data: relatorioData } = await axiosAuth.post(URLRelatorioPresenceCulto, {
        superVisionId,
        startDate,
        endDate
      });

      const presencaGeralCultos = data as unknown as Pessoa[];

      if (presencaGeralCultos) {
        // Pegando as datas unicas para o THeader
        const datasUnicas = new Set<string>();

        presencaGeralCultos.forEach(membro => {
          membro.presencasFiltradas.forEach(presenca => {
            datasUnicas.add(presenca.presenca_culto.data_inicio_culto);
          });
        });

        const datasArray: string[] = Array.from(datasUnicas).sort();
        setDatasUnic(datasArray);
        // Fim do get for datas unicas para o THeader
        console.log('presencaGeralCultos', presencaGeralCultos)

        const dataGroupedForCell = groupDataByCell(presencaGeralCultos);

        console.log('dataGroupedForCell', dataGroupedForCell)
        setGroupedForCell(dataGroupedForCell);
      }

      if (presencaGeralCultos && dateCultoData && presencaGeralCultos?.length > 0) {
        let ids = new Set<string>();
        presencaGeralCultos.map((membro, index) => {
          // Ordenar os cultos por data
          const presencasOrdenadas = membro.presencasFiltradas.sort((a, b) =>
            new Date(a.presenca_culto.data_inicio_culto).getTime() - new Date(b.presenca_culto.data_inicio_culto).getTime()
          );
          presencasOrdenadas.map((t) => {
            ids.add(t.cultoIndividualId);
          })
        })

        // Converter Set para Array e ordenar pelos timestamps de data
        const sortedIds = Array.from(ids).sort((a, b) => {
          const cultoA = presencaGeralCultos.find(membro =>
            membro.presencasFiltradas.some(presenca => presenca.cultoIndividualId === a)
          );
          const cultoB = presencaGeralCultos.find(membro =>
            membro.presencasFiltradas.some(presenca => presenca.cultoIndividualId === b)
          );

          const dataInicioA = cultoA?.presencasFiltradas.find(presenca => presenca.cultoIndividualId === a)?.presenca_culto.data_inicio_culto;
          const dataInicioB = cultoB?.presencasFiltradas.find(presenca => presenca.cultoIndividualId === b)?.presenca_culto.data_inicio_culto;

          // Verificar se dataInicioA e dataInicioB não são undefined antes de comparar
          if (dataInicioA && dataInicioB) {
            return new Date(dataInicioA).getTime() - new Date(dataInicioB).getTime();
          } else {
            return 0;
          }
        });
        setIdCultos(sortedIds);
        idCultos && console.log('IDS: ', idCultos);
      }

      // Inicio do Trecho que busca os dados do Relatorio por data
      const relatorio: PresencaForDate[] = Object.values(relatorioData);

      if (!relatorio) {
        console.log('Erro na resposta da API:', relatorioData.statusText);
        return;
      }
      const dataGroupedForDateCulto: GroupedForCulto = groupDataByDateCulto(relatorio);

      console.log('relatorioSUper', corSupervisao)
      setCorSupervisao(relatorio[0].presencas_culto[0].membro.supervisao_pertence.nome)

      const Cultos = relatorio.pop()
      setTotalCultos(Cultos as unknown as number)

      const CultoDomingoTarde = relatorio.pop()
      setTotalCultosDomingoTarde(CultoDomingoTarde as unknown as number)

      const CultoDomingoManha = relatorio.pop()
      setTotalCultosDomingoManha(CultoDomingoManha as unknown as number)

      const CultoSabado = relatorio.pop()
      setTotalCultosSabado(CultoSabado as unknown as number)

      const cultoDomingoSacrificio = relatorio.pop()
      setTotalCultosSacrificio(cultoDomingoSacrificio as unknown as number)

      const cultoPrimicia = relatorio.pop()
      setTotalCultosPrimicias(cultoPrimicia as unknown as number)

      const CultoQuarta = relatorio.pop()
      setTotalCultosQuarta(CultoQuarta as unknown as number)

      setDateCultoData(dataGroupedForDateCulto)

      setIsLoadingSubmitForm(false)

    } catch (error) {
      setIsLoadingSubmitForm(false)
      console.log('Erro ao buscar o relatório:', error);
    }
  };

  // const handleFunctions = (data: FormRelatorioSchema) => {
  //   handleRelatorio(data);
  // }

  const groupDataByDateCulto = (relatorio: PresencaForDate[]) => {
    const groupedDataForDateCulto: GroupedForCulto = {};

    relatorio.forEach(entry => {
      const dateCultoId = entry.data_inicio_culto
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
    console.log('relatorio', relatorio)

    relatorio.forEach(person => {
      const cargoName = person.cargo_de_lideranca.nome;

      if (cargoName) {
        if (!grupos[cargoName]) {
          grupos[cargoName] = [];
        }
        grupos[cargoName].push(person);
      }
    });
    return grupos;
  };

  const newCorSupervisao = CorSupervision(corSupervisao)
  const Supervisor = ListSupervisores(corSupervisao)

  useEffect(() => {
    let rowsCellName = new Set<number>();
    let rowsNameCell: number[] = (groupedForCell && idCultos &&
      Object.keys(groupedForCell)?.map((cellName, cellIndex) => {
        const length = groupedForCell[cellName].length;
        rowsCellName.add(length);
        return length; // Return the length to populate the array
      })) || [];

    setNumberOfRowsCell(rowsNameCell);
  }, [groupedForCell, idCultos]); // Add dependencies to useEffect

  const handleSupervisaoSelecionada = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSupervisaoSelecionada(event.target.value)
  }

  return (
    <Fragment>
      <div className='relative z-40 p-2 bg-white rounded-sm'>
        <div className="px-3 mt-2 mb-3">
          <Fragment>
            <form onSubmit={handleSubmit(handleRelatorio)}>
              <div className="flex flex-col gap-4 p-3">
                <div className='flex items-center justify-start gap-4'>
                  <Link href={'/dashboard'}>
                    <Image
                      src="/images/logo-ibb-1.svg"
                      width={62}
                      height={64}
                      alt="Logo IBB"
                    />
                  </Link>
                  <div>
                    <h1 className="text-base leading-normal text-gray-600 uppercase">
                      Igreja Batista Betânia - Lugar do derramar de Deus
                    </h1>
                    <h2 className="text-sm leading-normal text-gray-400 uppercase">
                      Relatório de Supervisores
                    </h2>
                  </div>
                </div>

                <div className='flex items-center mt-4 gap-x-4'>
                  <div className="p-3">
                    <div className="flex items-center gap-x-5">
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Dt. Início
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('startDate', { required: true })}
                            type="datetime-local"
                            name="startDate"
                            id="startDate"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Dt. Final
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('endDate', { required: true })}
                            type="datetime-local"
                            name="endDate"
                            id="endDate"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      {/* INFORMAÇÕES DO REINO */}
                      <div>
                        <label
                          htmlFor="superVisionId"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Supervisão
                        </label>
                        <div className="mt-3">
                          <select
                            {...register('superVisionId', { required: true })}
                            id="superVisionId"
                            name="superVisionId"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            onChange={handleSupervisaoSelecionada}
                          >
                            {!supervisoes ? (
                              <option value="">Carregando supervisões...</option>
                            ) : (
                              <option value="">
                                Selecione
                              </option>
                            )}
                            {supervisoes &&
                              supervisoes?.map((supervisao) => (
                                <option key={supervisao.id} value={supervisao.id}>
                                  {supervisao.nome}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      {/* Botões para submeter Forms */}
                    </div>

                    <div className="flex items-center justify-between mt-4 gap-x-6">
                      {supervisoes ? (
                        cargoLiderancaFilter?.map((cargo) => (
                          <div
                            key={cargo.id}
                            className="flex gap-x-3"
                          >
                            <div className="flex items-center h-6">
                              <input
                                {...register('cargoLideranca', { required: true })}
                                id={cargo.id}
                                value={cargo.id}
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded shadow-sm focus:ring-blue-600"
                              />
                            </div>
                            <div className="text-sm leading-6">
                              <label
                                htmlFor={cargo.id}
                                className="font-medium text-slate-700"
                              >
                                {cargo.nome}
                              </label>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>Carregando...</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-end p-3 sm:col-span-2">
                    <div className="">
                      {isLoadingSubmitForm ? (
                        <button
                          type="submit"
                          // disabled={isLoadingSubmitForm}
                          className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        >
                          <svg
                            className="w-5 h-5 mr-3 text-white animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Gerando Relat...</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="px-3 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        >
                          <span>Gerar Relatório</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>


              </div>
            </form>
          </Fragment>
        </div>
        {/* Inicio Relatorio */}
        <div className={cn(`text-center text-white bg-yellow-400 dark:bg-yellow-400`, newCorSupervisao)}>
          <div className='pt-2 pb-0'>
            {corSupervisao ? (
              <h1 className='py-1 font-bold uppercase'>RELATÓRIO - SUPERVISORES - {corSupervisao}</h1>
            ) : (
              <h1 className='py-1 font-bold uppercase'>RELATÓRIO - SUPERVISORES - Sem Dados</h1>
            )}
          </div>
          {
            totalCultos ? (
              <div className='pb-2 pl-2'>
                <p className='p-2 text-base font-medium uppercase text-start'>SUPERVISOR(ES): <span className='font-normal '>{Supervisor}</span></p>
              </div>
            ) : (
              <div className='pb-2 pl-2'>
                <p className='p-2 text-base font-medium uppercase text-start'>SUPERVISOR(ES): <span className='font-normal '>Sem Dados</span></p>
              </div>
            )
          }
          <div className='flex items-center justify-between gap-1 pb-2 pl-2 text-zinc-700 bg-slate-50'>
            {
              totalCultos ? (
                <div>
                  <p className='p-2 text-base font-bold uppercase text-start'>TOTAL DE CULTOS: <span className='font-normal '>{totalCultos}</span></p>
                </div>
              ) : (
                <div>
                  <p className='p-2 text-base font-bold uppercase text-start'>TOTAL DE CULTOS: <span className='font-normal '>Sem Registro</span></p>
                </div>
              )
            }
            {
              totalCultosPrimicias && (
                <div>
                  <p className='p-2 text-base font-bold uppercase text-start'>CULTOS DE PRIMÍCIAS: <span className='font-normal '>{totalCultosPrimicias}</span></p>
                </div>
              )
            }
            {
              totalCultosSacrificio ? (
                <div>
                  <p className='p-2 text-base font-bold uppercase text-start'>DOMINGO DE SACRIFÍCIO: <span className='font-normal '>{totalCultosSacrificio}</span></p>
                </div>
              ) : (
                <div className='hidden'>
                  <p className='p-2 text-base font-bold uppercase text-start'>DOMINGO DE SACRIFÍCIO: <span className='font-normal'>Sem Registro</span></p>
                </div>
              )
            }
            <div>
              {totalCultosDomingoManha ? (
                <p className='p-2 text-base font-bold uppercase text-start'>DOMINGO MANHÃ: <span className='font-normal '>{totalCultosDomingoManha}</span></p>
              ) : (
                <p className='p-2 text-base font-bold uppercase text-start'>DOMINGO MANHÃ: <span className='font-normal '>Sem Registro</span></p>
              )
              }
            </div>
            <div>
              {totalCultosDomingoTarde ? (
                <p className='p-2 text-base font-bold uppercase text-start'>DOMINGO TARDE: <span className='font-normal '>{totalCultosDomingoTarde}</span></p>
              ) : (
                <p className='p-2 font-bold uppercase text-start'>DOMINGO TARDE: <span className='font-normal '>Sem Registro</span></p>
              )
              }
            </div>
            <div>
              {totalCultosSabado ? (
                <p className='p-2 text-base font-bold uppercase text-start'>SÁBADO (CPD): <span className='font-normal '>{totalCultosSabado}</span></p>
              ) : (
                <p className='p-2 text-base font-bold uppercase text-start'>SÁBADO (CPD): <span className='font-normal '>Sem Registro</span></p>
              )
              }
            </div>
            <div>
              {totalCultosQuarta ? (
                <p className='p-2 text-base font-bold uppercase text-start'>CULTOS DE QUARTA: <span className='font-normal '>{totalCultosQuarta}</span></p>
              ) : (
                <p className='p-2 text-base font-bold uppercase text-start'>CULTOS DE QUARTA: <span className='font-normal '>Sem Registro</span></p>
              )
              }
            </div>
          </div>
        </div>
        <table className='text-sm text-left text-gray-500 auto-table dark:text-gray-400'>
          {/* Cabeçalho da tabela */}
          <thead className={cn(`p-2 text-center text-white`, newCorSupervisao)}>
            <Fragment>
              <tr className={`mx-4 p-2`}>
                <th>
                  <h1 className='p-2 font-bold text-center text-white uppercase'>TIPO</h1>
                </th>
                <th>
                  <h1 className='p-2 font-bold text-center text-white uppercase'>NOME</h1>
                </th>
                <th className='flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700'>
                  <div>
                    <h1 className='font-bold text-center uppercase'>% PRES. TOTAL</h1>
                  </div>
                </th>
                {
                  totalCultosPrimicias ? (
                    <th className='flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700'>
                      <div>
                        <h1 className='font-bold text-center uppercase'>%</h1>
                        <h1 className='font-bold text-center uppercase'>PRIMI.</h1>
                      </div>
                    </th>
                  ) : (
                    <th className='hidden'></th>
                  )
                }
                {
                  totalCultosSacrificio ? (
                    <th className='flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700'>
                      <div>
                        <h1 className='font-bold text-center uppercase'>%</h1>
                        <h1 className='font-bold text-center uppercase'>SACRIFI.</h1>
                      </div>
                    </th>
                  ) : (
                    <th className='hidden'></th>
                  )
                }
                <th className='flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700'>
                  <div className='text-center'>
                    <h1 className='font-bold text-center uppercase'>%</h1>
                    <h1 className='font-bold text-center uppercase'>DOM M.</h1>
                  </div>
                </th>
                <th className='flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700'>
                  <div className='text-center'>
                    <h1 className='font-bold text-center uppercase'>%</h1>
                    <h1 className='font-bold text-center uppercase'>DOM T.</h1>
                  </div>
                </th>
                <th className='flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700'>
                  <div className='text-center'>
                    <h1 className='font-bold text-center uppercase'>%</h1>
                    <h1 className='font-bold text-center uppercase'>CPD</h1>
                  </div>
                </th>
                <th className='flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700'>
                  <div className='text-center'>
                    <h1 className='font-bold text-center uppercase'>%</h1>
                    <h1 className='font-bold text-center uppercase'>QUARTA</h1>
                  </div>
                </th>
                {groupedForCell && datasUnic &&
                  datasUnic.map((dataCulto, dataCultoIndex) => (
                    <th className='flex-col items-center justify-center w-20 h-20 p-2 mb-2 text-white' key={dataCultoIndex}>
                      <div className=''>
                        <p>{`${dayjs(dataCulto).format('ddd').toUpperCase()}`}</p>
                        <p>{`${dayjs(dataCulto).format('DD/MM')}`}</p>
                      </div>
                    </th>
                  ))
                }
              </tr>
            </Fragment>
          </thead>
          <tbody>
            {groupedForCell && idCultos &&
              Object.keys(groupedForCell).map((cellName, cellIndex) => (
                <tr className={`border-b border-slate-600`} key={cellName + cellIndex}>
                  {/* Coluna fixa */}
                  <td className='px-4 bg-gray-50'>
                    <p className='text-base font-medium text-black'>{cellName}</p>
                    {/* <p className='text-sm text-slate-600'>
                      Líder: <span>{groupedForCell[cellName][0].celula.lider.first_name}</span>
                    </p> */}
                    <p className='text-sm text-slate-600'>
                      Membros: <span>{groupedForCell[cellName].length}</span>
                    </p>
                  </td>
                  {/* Coluna para membros */}
                  <td className='px-4'>
                    {groupedForCell[cellName].map((member) => (
                      <tr className='w-20 h-20 py-4' key={member.id}>
                        <div className='flex flex-col justify-center h-20'>
                          {member.first_name}
                        </div>
                      </tr>
                    ))}
                  </td>
                  <td className='border'>
                    {groupedForCell[cellName].map((member) => (
                      <tr className='' key={member.id}>
                        <div className='flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50'>
                          {member.cultos.porcentagemPresencaTotal} %
                        </div>
                      </tr>
                    ))}
                  </td>
                  {
                    totalCultosPrimicias ? (
                      <td className='border'>
                        {groupedForCell[cellName].map((member) => (
                          <tr className='' key={member.id}>
                            <div className='flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50'>
                              {member.cultos.porcentagemPresencaPrimicia} %
                            </div>
                          </tr>
                        ))}
                      </td>
                    ) :
                      (
                        <div className='hidden'></div>
                      )
                  }
                  {
                    totalCultosSacrificio ? (
                      <td className='border'>
                        {groupedForCell[cellName].map((member) => (
                          <tr className='' key={member.id}>
                            <div className='flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50'>
                              {member.cultos.porcentagemPresencaDomingoSacrificio} %
                            </div>
                          </tr>
                        ))}
                      </td>
                    ) :
                      (
                        <div className='hidden'></div>
                      )
                  }
                  <td className='border'>
                    {groupedForCell[cellName].map((member) => (
                      <tr className='' key={member.id}>
                        <div className='flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50'>
                          {member.cultos.porcentagemPresencaTotalDomingoManha} %
                        </div>
                      </tr>
                    ))}
                  </td>
                  <td className='border'>
                    {groupedForCell[cellName].map((member) => (
                      <tr className='' key={member.id}>
                        <div className='flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50'>
                          {member.cultos.porcentagemPresencaTotalDomingoTarde} %
                        </div>
                      </tr>
                    ))}
                  </td>
                  <td className='border'>
                    {groupedForCell[cellName].map((member) => (
                      <tr className='' key={member.id}>
                        <div className='flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50'>
                          {member.cultos.porcentagemPresencaSabado} %
                        </div>
                      </tr>
                    ))}
                  </td>
                  <td className='border'>
                    {groupedForCell[cellName].map((member) => (
                      <tr className='' key={member.id}>
                        <div className='flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50'>
                          {member.cultos.porcentagemPresencaQuarta} %
                        </div>
                      </tr>
                    ))}
                  </td>
                  {/* Colunas dinâmicas para presenças */}
                  {idCultos.map((cultoId, indexCulto) => (
                    <td className='mx-4 mb-4 text-center border border-zinc-200' key={cultoId + indexCulto}>
                      {groupedForCell[cellName].map((member, indexMember) => {
                        const presenceCulto = member.presencas_cultos.find(p => p.cultoIndividualId === cultoId);
                        return (
                          <div className='flex flex-col justify-center w-20 h-20 font-bold border-b border-zinc-200' key={cultoId + indexMember}>
                            {presenceCulto ? (
                              <Fragment>
                                {presenceCulto.status === true && (
                                  <p className='text-green-600'>P</p>
                                )}
                                {presenceCulto.status === false && (
                                  <p className='text-red-600'>F</p>
                                )}
                              </Fragment>
                            ) : (
                              <p key={indexMember}>
                                <p className='font-normal text-slate-600'>-</p>
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  )
}
