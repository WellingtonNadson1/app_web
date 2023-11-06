'use client'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import utc from 'dayjs/plugin/utc'
import timezone from "dayjs/plugin/timezone"
import ptBr from "dayjs/locale/pt-br"
import { twMerge } from 'tailwind-merge'

import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);

type PresencaForDate = {
  id: string;
  data_inicio_culto: string;
  presencas_culto: {
    id: string;
    status: boolean;
    membro: {
      id: string
      first_name: string
      presencas_cultos: {
        status: boolean;
        cultoIndividualId: string;
        presenca_culto: {
            id: string;
            status: string;
        }
      }
      supervisao_pertence: {
        id: string
        nome: string
      }
      celula: {
        id: string
        nome: string
      }
    }
  }[];
  culto_semana: {
    nome: string;
  };
};

type MemberData = {
  id: string;
  first_name: string;
  last_name: string;
  presencas_cultos: {
    status: boolean;
    cultoIndividualId: string;
    date_create: string;
    presenca_culto: {
      status: boolean;
      id: string;
    }
  }[];
  celula: {
    nome: string;
  };
};

type GroupedData = Record<string, MemberData[]>;
type GroupedForCulto = Record<string, PresencaForDate[]>;

export default function StatsCardRelatorios() {
  const { data: session } = useSession()
  // eslint-disable-next-line no-unused-vars
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)
  const URLRelatorioSupervision = `${BASE_URL}/relatorio/presencacultos`
  const URLRelatorioPresenceCulto = `${BASE_URL}/cultosindividuais/fordate`

  const [groupedData, setGroupedData] = useState<GroupedData | null>(null);
  const [celulas, setCelulas] = useState<GroupedForCulto | null>(null);
  const [celulas2, setCelulas2] = useState<PresencaForDate[] | null>(null);
  const [dateCultoData, setDateCultoData] = useState<GroupedForCulto | null>(null);
  const [dataCulto, setDataCulto] = useState<string | null>(null);
  const [corSupervisao, setCorSupervisao] = useState<string | null>(null);
  const [relatorioData, setRelatorioData] = useState<PresencaForDate[]>();

  useEffect(() => {
    handleRelatorio();
    handlePresenceCulto();
  }, []);

  const handleFunctions = () => {
    handleRelatorio();
    handlePresenceCulto();
  }

  const handleRelatorio = async () => {
    try {
      const response = await axiosAuth.get(URLRelatorioSupervision);
      const relatorio: MemberData[] = response.data;

      if (!relatorio) {
        console.log('Erro na resposta da API:', response.statusText);
        return;
      }

      const dataGrouped: GroupedData = groupDataByCell(relatorio);
      setGroupedData(dataGrouped);

      console.log('groupedData', groupedData)

      if (relatorio.length > 0 && !dataCulto) {
        relatorio.map((cultos, index) => {
          return setDataCulto(cultos.presencas_cultos[index].date_create)
        })
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

  const groupDataByCell = (relatorio: MemberData[]) => {
    const groupedData: GroupedData = {};

    relatorio.forEach(person => {
      const cellName = person.celula.nome;

      if (!groupedData[cellName]) {
        groupedData[cellName] = [];
      }

      groupedData[cellName].push(person);
    });

    return groupedData;
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
      <div className='px-2 rounded-sm shadow-md max-auto sm:rounded-lg'>
        <table className='text-sm text-left text-gray-500 auto-table dark:text-gray-400'>
          {/* Cabecalho da tabela */}
          <thead className={twMerge('text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300',
            newCorSupervisao
          )}>
            {/* Linha */}
            <tr className='mx-auto'>
              {/* Colunas */}
              <th className="px-6 py-3 mx-auto">Célula</th>
              <th className="px-6 py-3 mx-auto">Membros</th>
              {dateCultoData &&
                Object.keys(dateCultoData).map((cellDateCulto, cellDateIndex) => (
                  dateCultoData[cellDateCulto].length > 0 &&
                    dateCultoData[cellDateCulto].map((culto, index) => (
                  <th key={cellDateCulto + cellDateIndex} className="px-6 py-3 mx-auto">
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <p>
                        {dayjs(`${cellDateCulto}`).tz().format('ddd')}
                      </p>
                      <p>
                        {dayjs(`${cellDateCulto}`).tz().format('DD')}
                      </p>
                      <p>
                        {dayjs(culto.data_inicio_culto).format('YYYY-MM-DDTHH')}
                      </p>
                    </div>
                  </th>
                    ))
                ))}
            </tr>
          </thead>
          <tbody>
            {groupedData &&
              Object.keys(groupedData).map((cellName, cellIndex) => (
                // Linha Com dados da Celula
                <tr key={cellName + cellIndex} className='bg-white border-b'>
                  {/* NOME DA CELULA */}
                  <td className='px-2 mx-auto text-base font-semibold'>
                    {cellName}
                  </td>
                  {/* MEMBROS DA CELULA */}
                  <td>
                    {groupedData[cellName].length > 0 &&
                      groupedData[cellName].map((member, index) => (
                        <div className='ml-3 text-sm leading-8'>
                          <div className='w-full' key={member.id + index}>{member.first_name.slice(0,9)}</div>
                        </div>
                      ))}
                  </td>
                  {Array.from({ length: 12 }, (_, i) => (
                    <td key={i}>
                      {groupedData[cellName].length > 0 &&
                        groupedData[cellName].map((member, index) => (
                          dateCultoData &&
                Object.keys(dateCultoData).map((cellDateCulto, cellDateIndex) => (
                  dateCultoData[cellDateCulto].length > 0 &&
                    dateCultoData[cellDateCulto].map((culto, index) => (
                          <div key={member.id} className='mx-auto font-semibold leading-8 text-center'>
                            {member.presencas_cultos[index] ? (
                              typeof member.presencas_cultos[index] === 'object' &&
                                // member.presencas_cultos[index].hasOwnProperty('status') && 
                                culto.id === member.presencas_cultos[index].cultoIndividualId ? (
                                member.presencas_cultos[index].status === true ? (
                                  <p className='text-green-600'>{member.presencas_cultos[index].cultoIndividualId}P</p>
                                ) : (
                                  <p className='text-red-600'>{member.presencas_cultos[index].cultoIndividualId}F</p>
                                )
                              ) : (
                                'N/A'
                              )
                            ) : (
                              'N/A'
                            )}
                          </div>

                    ))))
                        ))}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}