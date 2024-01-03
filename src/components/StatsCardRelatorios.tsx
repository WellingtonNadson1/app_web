'use client'
import { GroupedForCulto, PresencaForDate } from '@/app/(relatorios)/relatorio-culto-supervisao/[id]/schema'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import {
  GraduationCap,
  HandHeart,
  Users,
  UsersFour,
} from '@phosphor-icons/react'
import { useSession } from 'next-auth/react'
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
      title: 'Presença nos Cultos',
      supervisor: 'Supervisões',
      icon: UsersFour,
      color: 'bg-[#1e3a8a]',
      href: "/relatorio-culto-supervisao/5e392d1b-f425-4865-a730-5191bc0821cd"
    },
    {
      title: 'Presença nos Cultos',
      supervisor: 'Células',
      icon: Users,
      color: 'bg-[#1e3a8a]',
      href: "/relatorio-culto-supervisao/5e392d1b-f425-4865-a730-5191bc0821cd"
    },
    {
      title: 'Presença nos Cultos',
      supervisor: 'Supervisores',
      icon: GraduationCap,
      color: 'bg-[#1e3a8a]',
      href: "/relatorio-culto-supervisor"
    },
    {
      title: 'Registro',
      supervisor: 'Discipulados Realizados',
      icon: HandHeart,
      color: 'bg-[#1e3a8a]',
      href: "/relatorio-culto-supervisao/5e392d1b-f425-4865-a730-5191bc0821cd"
    },
  ]
  return (
      <div className="relative z-10 w-full py-2 mx-auto">
        <div className="relative z-10 grid flex-wrap items-center justify-between w-full grid-cols-1 gap-4 p-2 mx-auto mt-3 sm:grid-cols-2 md:flex-nowrap">
          {escolasIbb.map((stat) => (
            <Link key={stat.title} href={stat.href}>
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
          </div>
        </div>
  )
}
