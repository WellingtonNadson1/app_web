'use client'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import utc from 'dayjs/plugin/utc'
import timezone from "dayjs/plugin/timezone"
import ptBr from "dayjs/locale/pt-br"
import { twMerge } from 'tailwind-merge'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { FormRelatorioSchema, GroupedForCulto, ISupervisoes, Pessoa, PresencaForDate } from './schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
dayjs.extend(localizedFormat)
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);
dayjs.tz.setDefault('America/Sao_Paulo')

export default function StatsCardRelatorios() {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  // const URLPresencaGeralCultos = `http://localhost:3333/relatorio/presencacultos`
  // const URLRelatorioPresenceCulto = `http://localhost:3333/cultosindividuais/fordate`
  // const URLSupervisoes = `http://localhost:3333/supervisoes`

  const URLSupervisoes = `${BASE_URL}/supervisoes`
  const URLPresencaGeralCultos = `${BASE_URL}/relatorio/presencacultos`
  const URLRelatorioPresenceCulto = `${BASE_URL}/cultosindividuais/fordate`

  const [groupedForCell, setGroupedForCell] = useState<Record<string, Pessoa[]> | undefined>();
  const [dateCultoData, setDateCultoData] = useState<GroupedForCulto | null>(null);
  const [corSupervisao, setCorSupervisao] = useState<string | null>(null);
  const [idCultos, setIdCultos] = useState<string[] | undefined>()
  const [datasUnic, setDatasUnic] = useState<string[] | undefined>()
  const [numberOfRowsCell, setNumberOfRowsCell] = useState<number[] | undefined>();
  const { register, handleSubmit, reset } = useForm<FormRelatorioSchema>()
  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>()
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const [totalCultos, setTotalCultos] = useState<number>(0)


  const { data: supervisoes, isError: error, isLoading } = useQuery<ISupervisoes[]>({
    queryKey: ["supervisoes"],
    queryFn: async () => {
      const response = await axiosAuth.get(URLSupervisoes)
      return await response.data
    },
  })

  const handleRelatorio: SubmitHandler<FormRelatorioSchema> = async ({ startDate, endDate, superVisionId }) => {
    try {
      setIsLoadingSubmitForm(true)


      dayjs(startDate).tz("America/Sao_Paulo").toISOString();
      dayjs(endDate).tz("America/Sao_Paulo").toISOString();

      const { data } = await axiosAuth.post(URLPresencaGeralCultos, {
        startDate,
        endDate,
        superVisionId
      });
      const presencaGeralCultos = data as Pessoa[];

      if (presencaGeralCultos) {
        // Pegando as datas unicas para o THeader
        const datasUnicas = new Set<string>();

        presencaGeralCultos.forEach(membro => {
          membro.presencas_cultos.forEach(presenca => {
            datasUnicas.add(presenca.presenca_culto.data_inicio_culto);
          });
        });

        const datasArray: string[] = Array.from(datasUnicas).sort();
        setDatasUnic(datasArray);
        // Fim do get for datas unicas para o THeader

        const dataGroupedForCell = groupDataByCell(presencaGeralCultos);
        setGroupedForCell(dataGroupedForCell);
        const celulaBetel = dataGroupedForCell["Betel"];
        if (celulaBetel) {
          console.log('Celula Betel', celulaBetel);
        }
        console.log('Dados por Celula', groupedForCell);

      }

      if (presencaGeralCultos && dateCultoData && presencaGeralCultos?.length > 0) {
        let ids = new Set<string>();
        presencaGeralCultos.map((membro, index) => {
          // Ordenar os cultos por data
          const presencasOrdenadas = membro.presencas_cultos.sort((a, b) =>
            new Date(a.presenca_culto.data_inicio_culto).getTime() - new Date(b.presenca_culto.data_inicio_culto).getTime()
          );
          presencasOrdenadas.map((t) => {
            ids.add(t.cultoIndividualId);
          })
        })

        // Converter Set para Array e ordenar pelos timestamps de data
        const sortedIds = Array.from(ids).sort((a, b) => {
          const cultoA = presencaGeralCultos.find(membro =>
            membro.presencas_cultos.some(presenca => presenca.cultoIndividualId === a)
          );
          const cultoB = presencaGeralCultos.find(membro =>
            membro.presencas_cultos.some(presenca => presenca.cultoIndividualId === b)
          );

          const dataInicioA = cultoA?.presencas_cultos.find(presenca => presenca.cultoIndividualId === a)?.presenca_culto.data_inicio_culto;
          const dataInicioB = cultoB?.presencas_cultos.find(presenca => presenca.cultoIndividualId === b)?.presenca_culto.data_inicio_culto;

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
    } catch (error) {
      console.log('Erro ao buscar o relatório:', error);
    }
  };

  const handlePresenceCulto: SubmitHandler<FormRelatorioSchema> = async ({ startDate, endDate, superVisionId }) => {
    try {
      setIsLoadingSubmitForm(true)

      dayjs(startDate).tz("America/Sao_Paulo").toISOString();
      dayjs(endDate).tz("America/Sao_Paulo").toISOString();

      const { data } = await axiosAuth.post(URLRelatorioPresenceCulto, {
        superVisionId,
        startDate,
        endDate
      });
      const relatorio: PresencaForDate[] = Object.values(data);

      if (!relatorio) {
        console.log('Erro na resposta da API:', data.statusText);
        return;
      }

      setCorSupervisao(relatorio[0].presencas_culto[0].membro.supervisao_pertence.nome)
      const Cultos = relatorio.pop()
      setTotalCultos(Cultos as unknown as number)

      const dataGroupedForDateCulto: GroupedForCulto = groupDataByDateCulto(relatorio);
      setDateCultoData(dataGroupedForDateCulto)


      if (!dateCultoData) {
        console.log('Ainda sem Date Cuto!');
        return
      }
      setIsLoadingSubmitForm(false)
      console.log(dateCultoData[0]);
    } catch (error) {
      console.log('Erro ao buscar o relatório:', error);
      setIsLoadingSubmitForm(false)
    }
  };

  const handleFunctions = (data: FormRelatorioSchema) => {
    handleRelatorio(data);
    handlePresenceCulto(data);
  }
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

    relatorio.forEach(person => {
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


  let newCorSupervisao = ''

  switch (corSupervisao) {
    case "Vermelha":
      newCorSupervisao = "w-full bg-red-500 dark:bg-red-500 dark:text-gray-100"
      break;
    case "Azul":
      newCorSupervisao = "w-full bg-blue-500 dark:bg-blue-500 dark:text-gray-100"
      break;
    case "Verde":
      newCorSupervisao = "w-full bg-green-500 dark:bg-green-500 dark:text-gray-100"
      break;
    case "Laranja":
      newCorSupervisao = "w-full bg-orange-500 dark:bg-orange-500 dark:text-gray-100"
      break;
    case "Amarela":
      newCorSupervisao = "w-full bg-yellow-500 dark:bg-yellow-500 dark:text-gray-100"
      break;
    default:
      break;

  }

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
    <>
      <div className='relative z-40 w-full bg-white rounded-sm'>
        <div className="px-3 mt-2 mb-3">
          <>
            <form onSubmit={handleSubmit(handleFunctions)}>
              <div className="p-3">
                <h2 className="text-sm leading-normal text-gray-400 uppercase">
                  Relatório de Supervisão
                </h2>

                <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-9">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium leading-6 text-slate-700"
                    >
                      Dt. Início
                    </label>
                    <div className="mt-3">
                      <input
                        {...register('startDate')}
                        type="datetime-local"
                        name="startDate"
                        id="startDate"
                        className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium leading-6 text-slate-700"
                    >
                      Dt. Final
                    </label>
                    <div className="mt-3">
                      <input
                        {...register('endDate')}
                        type="datetime-local"
                        name="endDate"
                        id="endDate"
                        className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* INFORMAÇÕES DO REINO */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="superVisionId"
                      className="block text-sm font-medium leading-6 text-slate-700"
                    >
                      Supervisão
                    </label>
                    <div className="mt-3">
                      <select
                        {...register('superVisionId')}
                        id="superVisionId"
                        name="superVisionId"
                        className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        onChange={handleSupervisaoSelecionada}
                      >
                        {isLoading ? (
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
                  <div className="flex flex-col justify-end sm:col-span-2">
                    <div className="">
                      {isLoadingSubmitForm ? (
                        <button
                          type="submit"
                          // disabled={isLoadingSubmitForm}
                          className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        >
                          <svg
                            className="w-5 h-5 mr-3 text-gray-400 animate-spin"
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
                          <span>Relat. Supervisão</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </>
        </div>
        <div >
          <div className={twMerge(`w-full text-center text-white`, newCorSupervisao)}>
            <div className='pt-2 pb-0'>
              <h1 className='py-1 font-bold uppercase'>RELATÓRIO - SUPERVISÃO - {corSupervisao}</h1>
            </div>
            <div className='pb-2 pl-2'>
              {totalCultos &&
                <h1 className='p-2 font-bold uppercase text-start'>QUANTIDADE DE CULTOS NO PERÍODO: {totalCultos}</h1>
              }
            </div>
          </div>
          <table className='text-sm text-left text-gray-500 auto-table dark:text-gray-400'>
            {/* Cabeçalho da tabela */}
            <thead className={twMerge(`p-2 text-center w-full text-white`, newCorSupervisao)}>
              <>
                <tr className={twMerge(`mx-4 mb-2 p-2 w-full`, newCorSupervisao)}>
                  <th className={twMerge(`p-2 mb-2`, 'w-1/4')}>
                    <h1 className='p-2 font-bold text-center text-white uppercase'>CÉLULAS</h1>
                  </th>
                  <th className={twMerge(`p-2 mb-2`, 'w-1/5')}>
                    <h1 className='p-2 font-bold text-center text-white uppercase'>MEMBROS</h1>
                  </th>
                  <th className='flex-col items-center justify-center h-20 p-2 text-black bg-white border w-14'>
                    <div>
                      <h1 className='font-bold text-center uppercase'>% PRES.</h1>
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
              </>
            </thead>
            <tbody>
              {groupedForCell && idCultos &&
                Object.keys(groupedForCell).map((cellName, cellIndex) => (
                  <tr className={`border-b border-slate-600`} key={cellName + cellIndex}>
                    {/* Coluna fixa */}
                    <td className='px-4 bg-gray-50'>
                      <p className='text-base font-medium text-black'>{cellName}</p>
                      <p className='text-sm text-slate-600'>
                        Membros: <span>{groupedForCell[cellName].length}</span>
                      </p>
                    </td>
                    {/* Coluna para membros */}
                    <td className='px-4'>
                      {groupedForCell[cellName].map((member) => (
                        <tr className='h-24 py-4 w-28' key={member.id}>
                          <div className='flex flex-col justify-center h-24'>
                            {member.first_name}
                          </div>
                        </tr>
                      ))}
                    </td>
                    <td className='border'>
                      {groupedForCell[cellName].map((member) => (
                        <tr className='' key={member.id}>
                          <div className='flex flex-col items-center justify-center w-24 h-24 border-b'>
                            {member.porcentagemPresenca} %
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
                            <div className='flex flex-col justify-center w-24 h-24 font-bold border-b border-zinc-200' key={cultoId + indexMember}>
                              {presenceCulto ? (
                                <>
                                  {presenceCulto.status === true && (
                                    <p className='text-green-600'>P</p>
                                  )}
                                  {presenceCulto.status === false && (
                                    <p className='text-red-600'>F</p>
                                  )}
                                </>
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
      </div>
    </>
  )
}
