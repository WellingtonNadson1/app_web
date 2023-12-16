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
import { CelulaProps, GroupedData, GroupedForCulto, MemberData, MembroPresencaProps, Pessoa, PresencaForDate } from './schema'
import { useQuery } from '@tanstack/react-query'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import RelatorioTable from '../relatorioComponet'
dayjs.extend(localizedFormat)
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);

export default function StatsCardRelatorios() {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  const URLPresencaGeralCultos = `http://localhost:3333/relatorio/presencacultos`
  const URLRelatorioPresenceCulto = `http://localhost:3333/cultosindividuais/fordate`
  // const URLPresencaGeralCultos = `${BASE_URL}/relatorio/presencacultos`
  // const URLRelatorioPresenceCulto = `${BASE_URL}/cultosindividuais/fordate`

  const [groupedForCell, setGroupedForCell] = useState<Record<string, Pessoa[]> | undefined>();
  const [groupedDataForCell, setGroupedDataForCell] = useState<Pessoa[] | undefined>();
  const [celulas, setCelulas] = useState<GroupedForCulto | null>(null);
  const [celulas2, setCelulas2] = useState<PresencaForDate[] | null>(null);
  const [dateCultoData, setDateCultoData] = useState<GroupedForCulto | null>(null);
  const [dataCulto, setDataCulto] = useState<string | null>(null);
  const [corSupervisao, setCorSupervisao] = useState<string | null>(null);
  const [relatorioData, setRelatorioData] = useState<PresencaForDate[] | undefined>();
  const [idCultos, setIdCultos] = useState<string[] | undefined>()
  const [datasUnic, setDatasUnic] = useState<string[] | undefined>()
  const [numberOfRowsCell, setNumberOfRowsCell] = useState<number[] | undefined>();

  useEffect(() => {
    handleRelatorio();
    handlePresenceCulto();
  }, []);

  const handleRelatorio = async () => {
    try {
      const response = await axiosAuth.get(URLPresencaGeralCultos);
      const presencaGeralCultos = response.data as Pessoa[];
      setGroupedDataForCell(presencaGeralCultos)

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
        // PFim do egando as datas unicas para o THeader

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
            // Lógica de tratamento para valores undefined
            return 0; // ou outra lógica adequada
          }

        });

        setIdCultos(sortedIds);
        idCultos && console.log('IDS: ', idCultos);

      }
    } catch (error) {
      console.log('Erro ao buscar o relatório:', error);
    }
  };

  const handlePresenceCulto = async () => {
    let startDate: string, endDate: string, superVisionId: string
    try {
      const response = await axiosAuth.post(URLRelatorioPresenceCulto, {
        startDate: "2023-10-01T00:00:00.000Z",
        endDate: "2023-10-28T00:00:00.000Z",
        superVisionId: "5e392d1b-f425-4865-a730-5191bc0821cd"
      });
      const relatorio: PresencaForDate[] = response.data;

      if (!relatorio) {
        console.log('Erro na resposta da API:', response.statusText);
        return;
      }

      const dataGroupedForCulto: GroupedForCulto = groupDataByCulto(relatorio);

      setCelulas(dataGroupedForCulto)
      setCelulas2(relatorio)
      setCorSupervisao(relatorio[0].presencas_culto[0].membro.supervisao_pertence.nome)
      setRelatorioData(relatorio)

      const dataGroupedForDateCulto: GroupedForCulto = groupDataByDateCulto(relatorio);
      setDateCultoData(dataGroupedForDateCulto)

      console.log('Data dataGroupedForCulto: ', dataGroupedForCulto)
      console.log('Data dataGroupedForDateCulto: ', dataGroupedForDateCulto)

      if (!dateCultoData) {
        console.log('Ainda sem Date Cuto!');
        return
      }
      console.log(dateCultoData[0]);
    } catch (error) {
      console.log('Erro ao buscar o relatório:', error);
    }
  };

  const handleFunctions = () => {
    console.log('Botão de Relat. Mensal Supervisão clicado');
    handleRelatorio();
    handlePresenceCulto();
  }

  const groupDataByCulto = (relatorio: PresencaForDate[]) => {
    const groupedDataForCell: GroupedForCulto = {};

    relatorio.forEach(entry => {
      const celulaId = entry.presencas_culto[0]?.membro.celula.id;
      if (celulaId) {
        if (!groupedDataForCell[celulaId]) {
          groupedDataForCell[celulaId] = [];
        }
        groupedDataForCell[celulaId].push(entry);
      }
    });
    return groupedDataForCell;
  };

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
      const cellName = person.celula.nome;

      if (!grupos[cellName]) {
        grupos[cellName] = [];
      }

      grupos[cellName].push(person);
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
    case "Laranja":
      newCorSupervisao = "w-full bg-yellow-500 dark:bg-yellow-500 dark:text-gray-100"
      break;
    default:
      break;

  }
  const col = datasUnic && `grid grid-cols-${2 + datasUnic?.length}`
  const span = datasUnic && `col-span-${2 + datasUnic?.length}`

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

  numberOfRowsCell


  console.log('Rows', numberOfRowsCell);



  return (
    <>
    {/* {datasUnic &&
      <div className={twMerge(`${newCorSupervisao} p-2`, 'flex flex-col items-center')}> */}

        {/* HEADER SUPERVISION */}
        {/* <div className={twMerge(`p-2 mb-2 w-full`, '')}>
          <h1 className='p-2 font-bold text-center uppercase'>SUPERVISÃO - {corSupervisao}</h1>
        </div> */}

        {/* HEADER SUBTITELS */}
        {/* <div className='flex items-center justify-between w-full'>
          <div className="p-2 font-bold uppercase">Célula</div>
          <div className="p-2 font-bold uppercase">Membros</div>
          {groupedForCell && datasUnic &&
            datasUnic.map((dataCulto, dataCultoIndex) => (
              <div className='p-2 font-bold ' key={dataCultoIndex}>
                <div className='mx-4 text-center text-white'>
                  <p className='text-center'>{`${dayjs(dataCulto).format('ddd').toUpperCase()}`}</p>
                  <p className='text-center'>{`${dayjs(dataCulto).format('DD/MM')}`}</p>
                </div>
              </div>
            ))
          }
        </div> */}

          {/* BODY TABLE */}
          {/* NAME CELL */}
          {/* <div className="grid grid-rows-10">
            {groupedForCell && numberOfRowsCell && numberOfRowsCell.length === Object.keys(groupedForCell).length &&
              Object.keys(groupedForCell).map((cellName, cellIndex) => (
                <div key={cellName + cellIndex} className={twMerge(`${newCorSupervisao} p-2`, `row-span-${numberOfRowsCell[cellIndex]}`)}>
                  <div className="p-2 font-bold uppercase border-b bg-gray-50 border-slate-600">
                    <div className='px-4 '>
                      <p className='text-base font-medium text-black'>{cellName}</p>
                      <p className='text-sm text-slate-600'>
                        Membros: <span>{groupedForCell[cellName].length}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div> */}



          {/* NAME MEBERS */}
          {/* <div>
          {groupedForCell && numberOfRowsCell &&
            Object.keys(groupedForCell).map((cellName, cellIndex) => (
              groupedForCell[cellName].map((member) => (
              <div key={cellName + cellIndex}>
                <div className="p-2 px-4 font-bold text-black uppercase">
                  {member.first_name}
                </div>
              </div>
              ))
            ))}
          </div> */}

          {/* PRESENCES */}

          {/* {groupedForCell && idCultos &&
            Object.keys(groupedForCell).map((cellName, cellIndex) => (
              groupedForCell[cellName].map((member) => (
              <div className="p-2 font-bold uppercase border-b border-slate-600">
                <div className='px-4 bg-gray-50'>
                {member.first_name}
                </div>
          </div>
              ))
          ))} */}

      {/* </div>
    } */}

      <div className='w-full'>
        <div className="px-3 mt-2 mb-3">
          <button
            type="submit"
            onClick={handleFunctions}
            className="px-2 py-1 text-white rounded-md hover:gb-sky-500 bg-sky-600"
          >
            Relat. Mensal Supervisão
          </button>
        </div>
        <div >
        <div className={twMerge(`w-full p-2 text-center text-white`, newCorSupervisao)}>
                <div className='p-2'>
                  <h1 className='p-2 font-bold uppercase'>SUPERVISÃO - {corSupervisao}</h1>
                </div>
              </div>
          <table className='text-sm text-left text-gray-500 auto-table dark:text-gray-400'>
            {/* Cabeçalho da tabela */}
            <thead className='p-2 text-center'>
              <>
              <tr className={twMerge(`mx-4 mb-4 p-2`, newCorSupervisao)}>
                <th className={twMerge(`p-2 mb-4`, '')}>
                  <h1 className='p-2 font-bold text-center text-white uppercase'>CÉLULA</h1>
                </th>
              <th className={twMerge(`p-2 mb-4`, '')}>
                <h1 className='font-bold text-center uppercase text-whitep-2'>MEMBROS</h1>
              </th>
              {groupedForCell && datasUnic &&
                datasUnic.map((dataCulto, dataCultoIndex) => (
                  <th className='flex-col items-center justify-center w-24 h-24 p-2 mb-4 text-white' key={dataCultoIndex}>
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
                          {member.first_name}
                        </tr>
                      ))}
                    </td>

                      {/* Colunas dinâmicas para presenças */}
                        {idCultos.map((cultoId, indexCulto) => (
                          <td className='mx-4 mb-4 text-center' key={cultoId + indexCulto}>
                            {groupedForCell[cellName].map((member, indexMember) => {

                              const presenceCulto = member.presencas_cultos.find(p => p.cultoIndividualId === cultoId);

                              return (
                                <div className='flex flex-col justify-center w-24 h-24' key={cultoId + indexMember}>
                                  {presenceCulto ? (
                                    <>
                                      <p className='text-center text-black'>{`${dayjs(presenceCulto.presenca_culto.data_inicio_culto).format('ddd').toUpperCase()}`}</p>
                                      {presenceCulto.status === true && (
                                        <>
                                          <p className='text-green-600'>{`${dayjs(presenceCulto.presenca_culto.data_inicio_culto).format('DD/MM')}`}</p>
                                          <p className='text-green-600'>P</p>
                                          {/* <p>{member.first_name.slice(0, 10)}</p> */}

                                        </>
                                      )}
                                      {presenceCulto.status === false && (
                                        <>
                                          <p className='text-red-600'>{`${dayjs(presenceCulto.presenca_culto.data_inicio_culto).format('DD/MM')}`}</p>
                                          <p className='text-red-600'>F</p>
                                          {/* <p>{member.first_name.slice(0, 10)}</p> */}
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <p key={indexMember}>
                                      <>
                                        <p className='text-slate-600'>S.L</p>
                                        <p className='text-slate-600'>N/A</p>
                                        <p className='text-slate-600'>{`${dayjs().format('DD/MM')}`}</p>
                                      </>
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
