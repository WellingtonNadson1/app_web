'use client'
<<<<<<< HEAD
=======
import { GroupedForCulto, PresencaForDate } from '@/app/(relatorios)/relatorio-culto-supervisao/[id]/schema'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
>>>>>>> relatorio_presence_supervision
import {
  Heart,
  UserGear,
  Users,
  UsersFour,
} from '@phosphor-icons/react'
<<<<<<< HEAD
=======
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
>>>>>>> relatorio_presence_supervision
import Link from 'next/link'
import { useEffect, useState } from 'react'

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

export default function StatsCardRelatorios() {
<<<<<<< HEAD

  const escolasIbb = [
    {
      title: 'Presenças',
      supervisor: 'Supervisões',
      icon: UsersFour,
      color: 'bg-blue-950',
    },
    {
      title: 'Presenças',
      supervisor: 'Células',
      icon: Users,
      color: 'bg-blue-950',
    },
    {
      title: 'Presenças',
      supervisor: 'Supervisores',
      icon: UserGear,
      color: 'bg-blue-950',
    },
    {
      title: 'Presenças',
      supervisor: 'Discipulados',
      icon: Heart,
      color: 'bg-blue-950',
=======
  const { data: session } = useSession()
  // eslint-disable-next-line no-unused-vars
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)
  const URLRelatorioSupervision = `${BASE_URL}/relatorio/presencacultos`
  const URLRelatorioPresenceCulto = `${BASE_URL}/cultosindividuais/fordate`
  const [celula, setCelula] = useState<GroupedForCulto | null>(null);
  const [dateCultoData, setDateCultoData] = useState<GroupedForCulto | null>(null);




  const [groupedData, setGroupedData] = useState<GroupedData | null>(null); // Estado para os dados agrupados
  const [celulas, setCelulas] = useState<GroupedData>(); // Estado para os dados agrupados

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

      setCelula(dataGroupedForCulto)

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

  useEffect(() => {
    handleRelatorio();
    handlePresenceCulto();
  }, []);

  const handleRelatorio = async () => {
    try {
    handlePresenceCulto();

      const response = await axiosAuth.get(URLRelatorioSupervision);
      const relatorio: MemberData[] = response.data;

      if (!relatorio) {
        console.log('Erro na resposta da API:', response.statusText);
        return;
      }

      const dataGrouped: GroupedData = groupDataByCell(relatorio);
      setGroupedData(dataGrouped);
      console.log('dataGrouped', dataGrouped)
    } catch (error) {
      console.log('Erro ao buscar o relatório:', error);
    }
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

  const escolasIbb = [
    {
      title: 'Presença1',
      supervisor: 'Células',
      icon: Footprints,
      color: 'bg-[#F55343]',
    },
    {
      title: 'Presença',
      supervisor: 'Supervisões',
      icon: FishSimple,
      color: 'bg-[#43a2f5]',
    },
    {
      title: 'Supervisores',
      icon: UsersFour,
      color: 'bg-[#e2de5f]',
    },
    {
      title: 'Discipulados',
      supervisor: '',
      icon: HandsPraying,
      color: 'bg-[#f58224]',
>>>>>>> relatorio_presence_supervision
    },
  ]
  return (
    <>
      <div className="relative z-10 w-full py-2 mx-auto">
        <div className="relative z-10 grid flex-wrap items-center justify-between w-full grid-cols-1 gap-4 p-2 mx-auto mt-3 sm:grid-cols-2 md:flex-nowrap">
<<<<<<< HEAD
          {escolasIbb.map((stat, i) => (
            <Link key={stat.title + i} href="/supervisoes/celulas">
=======
          {escolasIbb.map((stat) => (
            <Link key={stat.title} href="/supervisoes/celulas">
>>>>>>> relatorio_presence_supervision
              <div
                className={`flex-warp relative w-full cursor-pointer flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="mb-0 font-sans text-sm font-semibold leading-normal uppercase">
                    {stat.title}
                  </div>
                  <div
                    className={`rounded-full ${stat.color} p-2 drop-shadow-md`}
                  >
                    <stat.icon width={24} height={24} color="#fff" />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold">
                    {stat.supervisor}
                  </span>
                </div>
              </div>
            </Link>
          ))}
<<<<<<< HEAD
=======

          <div className="mt-2">
            <button
              type="submit"
              onClick={handleRelatorio}
              className="px-2 py-1 text-white rounded-md hover:gb-sky-500 bg-sky-600"
            >
              Relat. Mensal Supervisão
            </button>
          </div>

>>>>>>> relatorio_presence_supervision
        </div>
      </div>
      <div className='rounded-sm shadow-md max-auto sm:rounded-lg'>
        <table className='w-full text-sm text-left text-gray-500 auto-table dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300'>
            <tr>
              <th className="px-6 py-3">Célula</th>
              <th className="px-6 py-3">Membros</th>

              {/* data do culto */}
              {/* {groupedData &&
                Object.keys(groupedData).map((cellName, cellIndex) => (
                  <th key={cellName + cellIndex} className='bg-white border-b '>
                    {Array.from({ length: groupedData[cellName].length }, (_, i) => (
                      <th key={i}>
                        {groupedData[cellName].length > 0 &&
                          groupedData[cellName].map((member, index) => (
                            <div className='mx-auto font-semibold text-center'>
                              {member.presencas_cultos[i] ? (
                                typeof member.presencas_cultos[i] === 'object' &&
                                  member.presencas_cultos[i].hasOwnProperty('status') ? (
                                  member.presencas_cultos[i].date_create ? (
                                    <th className='text-green-600'>{member.presencas_cultos[i].date_create}</th>
                                  ) : (
                                    <th className='text-red-600'>F</th>
                                  )
                                ) : (
                                  'N/A'
                                )
                              ) : (
                                'N/A'
                              )}
                            </div>
                          ))}
                      </th>
                    ))}
                  </th>
                ))} */}

                {/* Colunas dinâmicas para cada culto */}
              {dateCultoData &&
                Object.keys(dateCultoData).map((cellDateCulto, cellDateIndex) => (
                  dateCultoData[cellDateCulto].length > 0 && (
                    <th key={cellDateCulto + cellDateIndex} className="px-6 py-3 mx-auto">
                      <div className='flex flex-col items-center justify-center gap-2'>
                        <p>{dayjs(`${cellDateCulto}`).format('ddd')}</p>
                        <p>{dayjs(`${cellDateCulto}`).format('DD')}</p>
                        <p>{dateCultoData[cellDateCulto][0].id}</p>
                      </div>
                    </th>
                  )
                ))}

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
                    <td key={i}>
                      {groupedData[cellName].length > 0 &&
                        groupedData[cellName].map((member, index) => (
                          <div className='mx-auto font-semibold text-center'>
                            {member.presencas_cultos[i] ? (
                              typeof member.presencas_cultos[i] === 'object' &&
                                member.presencas_cultos[i].hasOwnProperty('status') ? (
                                member.presencas_cultos[i].status === true ? (
                                <>
                                  <p className='text-green-600'>{member.presencas_cultos[i].cultoIndividualId} P</p>
                                </>
                                ) : (
                                  <p className='text-red-600'>{member.presencas_cultos[i].cultoIndividualId} F</p>
                                )
                              ) : (
                                'N/A'
                              )
                            ) : (
                              'N/A'
                            )}
                          </div>
                        ))}
                    </td>
                  ))}
                </tr>
              ))}

          </tbody>

        </table>
      </div>
    </>
  )
}
