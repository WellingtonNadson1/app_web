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

const MembroPresenca: React.FC<MembroPresencaProps> = ({ membro }) => {
  // Ordenar os cultos por data
  const presencasOrdenadas = membro.presencas_cultos.sort((a, b) =>
    new Date(a.date_create).getTime() - new Date(b.date_create).getTime()
  );
  return (
    <div key={membro.id}>
      <p>{`${membro.first_name} ${membro.last_name}:`}</p>
      <ul>
        {presencasOrdenadas.map((presenca, index) => (
          <li key={index}>
            {`Culto ID: ${presenca.cultoIndividualId}, Status: ${presenca.status ? 'Presente' : 'Ausente'
              }, Data: ${presenca.date_create}`}
          </li>
        ))}
      </ul>
    </div>
  );
};


// Componente para representar uma célula e seus membros
const Celula: React.FC<CelulaProps> = ({ celula, membros }) => {
  return (
    <div>
      <h2>{`Célula ${celula}`}</h2>
      {membros.map((membro) => (
        <MembroPresenca key={membro.id} membro={membro} />
      ))}
    </div>
  );
};

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

  useEffect(() => {
    handleRelatorio();
    handlePresenceCulto();
  }, []);

  const handleRelatorio = async () => {
    try {
      const response = await axiosAuth.get(URLPresencaGeralCultos);
      const presencaGeralCultos = response.data as Pessoa[];

      if (presencaGeralCultos) {
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
            new Date(a.date_create).getTime() - new Date(b.date_create).getTime()
          );
          presencasOrdenadas.map((t) => {
            ids.add(t.cultoIndividualId);
          })
        })
        setIdCultos(Array.from(ids));
      }

      console.log(idCultos);


    } catch (error) {
      console.log('Erro ao buscar o relatório:', error);
    }
  };

  const handlePresenceCulto = async () => {
    let startDate: string, endDate: string, superVisionId: string
    try {
      const response = await axiosAuth.post(URLRelatorioPresenceCulto, {
        startDate: "2023-10-01T00:00:00.000Z",
        endDate: "2023-10-19T00:00:00.000Z",
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

  return (
    <>
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
        <div className='p-2 rounded-md shadow-md max-auto sm:rounded-lg'>
          <table className='text-sm text-left text-gray-500 auto-table dark:text-gray-400'>
            {/* Cabeçalho da tabela */}
            <thead className={twMerge('text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300', newCorSupervisao)}>
              {/* Linha do cabeçalho */}
              <tr className='mx-auto'>
                {/* Coluna fixa */}
                <th className="px-6 py-3 mx-auto">Célula</th>
                <th className="px-6 py-3 mx-auto">Membros</th>
                <th className="px-6 py-3 mx-auto text-center">SUPERVISÃO - {corSupervisao}</th>

                {/* Colunas dinâmicas para cada culto */}
                {/* {dateCultoData &&
                  Object.keys(dateCultoData).map((cellDateCulto, cellDateIndex) => (
                    dateCultoData[cellDateCulto].length > 0 && (
                      <th key={cellDateCulto + cellDateIndex} className="px-6 py-3 mx-auto">
                        <div className='flex flex-col items-center justify-center gap-2'>
                          <p>{dayjs(`${cellDateCulto}`).tz().format('ddd')}</p>
                          <p>{dayjs(`${cellDateCulto}`).tz().format('DD')}</p>
                          <p>{dateCultoData[cellDateCulto][0].id}</p>
                        </div>
                      </th>
                    )
                  ))} */}
              </tr>
            </thead>

            <tbody>
              {groupedForCell && idCultos &&
                Object.keys(groupedForCell).map((cellName, cellIndex) => (

                  <tr className='border-b border-slate-600' key={cellName + cellIndex}>
                    {/* Coluna fixa */}
                    <td className='px-4 bg-gray-50'>
                      <p className='text-base font-medium text-black'>{cellName}</p>
                      <p className='text-sm text-slate-600'>
                        Membros: <span>{groupedForCell[cellName].length}</span>
                      </p>
                    </td>

                    {/* Coluna para membros */}
                    <div className='flex items-start justify-center gap-6'>
                      <div className='h-24 w-28'>
                        <div className='flex flex-col justify-center gap-y-10'>
                          {groupedForCell[cellName].map((member, index) => (
                            <div className='h-24 px-4' key={member.id}>
                              {member.first_name.slice(0, 10)}
                            </div>
                          ))}
                        </div>
                      </div>



                      {/* Colunas dinâmicas para presenças */}
                      <div className='flex items-start justify-between gap-4 px-4'>
                        {idCultos.map((cultoId, indexCulto) => (
                          <div className='mx-4 mb-4 text-center' key={cultoId}>
                            {groupedForCell[cellName].map((member, indexMember) => {
                              const presenceCulto = member.presencas_cultos.find(p => p.cultoIndividualId === cultoId);

                              return (
                                <div className='w-24 h-24'  key={cultoId + indexMember}>
                                  {presenceCulto ? (
                                    <>
                                      <p className='text-center text-black'>{`${dayjs(presenceCulto.date_create).format('ddd').toUpperCase()}`}</p>
                                      {presenceCulto.status === true && (
                                        <>
                                          <p className='text-green-600'>{`${dayjs(presenceCulto.date_create).format('DD/MM')}`}</p>
                                          <p className='text-green-600'>P</p>
                                          {/* <p>{member.first_name.slice(0, 10)}</p> */}

                                        </>
                                      )}
                                      {presenceCulto.status === false && (
                                        <>
                                          <p className='text-red-600'>{`${dayjs(presenceCulto.date_create).format('DD/MM')}`}</p>
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
                          </div>
                        ))}
                      </div>
                    </div>



                    {/* {groupedForCell[cellName].map((member, index) => (
                      <td key={member.id}>
                        {member.presencas_cultos.map((presenceCulto, indexPresence) => (
                          <div key={presenceCulto.cultoIndividualId}>
                            {presenceCulto.status === true && presenceCulto.cultoIndividualId === idCultos[indexPresence]
                              ? (<p className='text-green-600'>{member.first_name} {presenceCulto.cultoIndividualId} P</p>)
                              : presenceCulto.status === false && presenceCulto.cultoIndividualId === idCultos[indexPresence]
                                ? (<p className='text-red-600'>{member.first_name} {presenceCulto.cultoIndividualId} F</p>)
                                : (<p>N/A</p>)
                            }
                          </div>
                        ))}
                      </td>
                    ))} */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  )
}
