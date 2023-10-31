'use client'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import utc from 'dayjs/plugin/utc'
import timezone from "dayjs/plugin/timezone"
import ptBr from "dayjs/locale/pt-br"

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);

type PresencaForDate = {
  id: string;
  data_inicio_culto: string;
  presencas_culto: {
    status: boolean;
    membro: {
      id: string
      first_name: string
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

  const [groupedData, setGroupedData] = useState<GroupedData | null>(null); // Estado para os dados agrupados
  const [celulas, setCelulas] = useState<GroupedForCulto | null>(null); // Estado para os dados agrupados
  const [celulas2, setCelulas2] = useState<PresencaForDate[] | null>(null); // Estado para os dados agrupados
  const [dataCulto, setDataCulto] = useState<string | null>(null); // Estado para armazenar a data do culto
  const [dateCulto, setDateCulto] = useState<string[] | null>(null); // Estado para armazenar a data do culto

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

      let dateCultos: string[] = []

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
        startDate : "2023-10-01T00:00:00.000Z",
        endDate : "2023-10-19T00:00:00.000Z",
        superVisionId : "5e392d1b-f425-4865-a730-5191bc0821cd"
      });
      const relatorio: PresencaForDate[] = response.data;

      if (!relatorio) {
        console.log('Erro na resposta da API:', response.statusText);
        return;
      }

      const dataGroupedForCulto: GroupedForCulto = groupDataByCulto(relatorio);
      setCelulas(dataGroupedForCulto)
      setCelulas2(relatorio)

      console.log('Data dataGroupedForCulto: ', dataGroupedForCulto)
      console.log('Presence Culto for ID: ', celulas)


    } catch (error) {
      console.log('Erro ao buscar o relatório:', error);
    }
  };

  const groupDataByCulto = (relatorio: PresencaForDate[]) => {
    const groupedDataForCell: GroupedForCulto = {};
  
    relatorio.forEach(entry => {
      // const cultoId = entry.id;

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

  
  return (
    <>
      <div className="relative z-10 w-full py-2 mx-auto">
        
      </div>
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
        <table className='w-full text-sm text-left text-gray-500 auto-table dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300'>
            <tr>
              <th className="px-6 py-3">Célula</th>
              <th className="px-6 py-3">Membros</th>

              {celulas && 
                celulas2?.map((test, indexTest) => (
                  <th key={indexTest} className="px-6 py-3 mx-auto">
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <p>
                        {dayjs(`${test.data_inicio_culto}`).tz().format('ddd')}
                      </p>
                      <p>
                        {dayjs(`${test.data_inicio_culto}`).tz().format('DD')}
                      </p>
                    </div>
                  
               
                  </th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {groupedData &&
              Object.keys(groupedData).map((cellName, cellIndex) => (
                <tr key={cellName + cellIndex} className='bg-white border-b '>
                  <td>
                    {cellName}
                  </td>
                  <td>
                    {groupedData[cellName].length > 0 &&
                      groupedData[cellName].map((member, index) => (
                        <div key={member.id}>{member.first_name}</div>
                      ))}
                  </td>
                  {Array.from({ length: groupedData[cellName].length }, (_, i) => (
                    <div className='w-full mx-auto' key={i}>
                      {groupedData[cellName].length > 0 &&
                        groupedData[cellName].map((member, index) => (
                          <td className='w-full mx-auto font-semibold text-center'>
                            {member.presencas_cultos[i] ? (
                              typeof member.presencas_cultos[i] === 'object' &&
                                member.presencas_cultos[i].hasOwnProperty('status') ? (
                                member.presencas_cultos[i].status === true ? (
                                  <p className='text-green-600'>P</p>
                                ) : (
                                  <p className='text-red-600'>F</p>
                                )
                              ) : (
                                'N/A'
                              )
                            ) : (
                              'N/A'
                            )}
                          </td>
                        ))}
                    </div>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
