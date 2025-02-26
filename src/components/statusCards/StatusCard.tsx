'use client';
import {
  useAlmasAnoStore,
  useAlmasMesPassadoStore,
  useAlmasMesStore,
} from '@/store/AlmasStorage';
import { ChartLineUp, Confetti, HandsPraying } from '@phosphor-icons/react';
import { Card } from '../ui/card';

import { cn } from '@/lib/utils';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';

export default function StatsCard() {
  const { data: session, status } = useSession();
  const axiosAuth = useAxiosAuth(session?.user?.token as string);
  const DataCombineteded = async () => {
    try {
      const { data } = await axiosAuth.get('/users/all');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
      } else {
        console.error(error);
      }
      return null;
    }
  };

  // Estado local para controlar a hidratação da store
  const [isHydrated, setIsHydrated] = useState(false);

  // Acessa e atualiza o estado de almas ganhas no Zustand
  const { almasGanhasNoMes, setAlmasGanhasNoMes } = useAlmasMesStore();
  const { almasGanhasNoMesPassado, setAlmasGanhasNoMesPassado } =
    useAlmasMesPassadoStore();
  const { almasGanhasNoAno, setAlmasGanhasNoAno } = useAlmasAnoStore();

  // Função para buscar dados da API e atualizar o estado
  async function fetchAndUpdateAlmasGanhas() {
    const data = await DataCombineteded();
    if (data) {
      setAlmasGanhasNoMes(data.almasGanhasNoMes);
      setAlmasGanhasNoAno(data.almasGanhasNoAno);
      setAlmasGanhasNoMesPassado(data.almasGanhasNoMesPassado);
    }
  }

  // useEffect para carregar os dados ao montar o componente
  useEffect(() => {
    fetchAndUpdateAlmasGanhas().then(() => {
      setIsHydrated(true); // Apenas define como true após carregar os dados
    });
  }, []);

  if (!isHydrated) {
    return <div>Carregando...</div>;
  }

  const porcentagemAlmasGanhasMesPassado =
    (almasGanhasNoMes * 100) / almasGanhasNoMesPassado;

  const statusIbb = [
    {
      title: 'Conversões nas Células',
      porcentagem: `${porcentagemAlmasGanhasMesPassado.toFixed(2)}%`,
      total:
        almasGanhasNoMes !== undefined
          ? `este mês: ${almasGanhasNoMes} almas`
          : 'Carregando...',
      status: 'up',
      referenciaAnterior: `${almasGanhasNoMesPassado} almas`,
      icon: HandsPraying,
      color: 'bg-[#6074E1]',
      destaq: `mês passado: `,
    },
    {
      title: 'Conversões/Ano',
      porcentagem: '--.--%',
      total:
        almasGanhasNoAno !== undefined ? almasGanhasNoAno : 'Carregando...',
      status: 'up',
      icon: Confetti,
      color: 'bg-[#F55343]',
      destaq: ' o último ano',
    },
    {
      title: 'Frequência',
      porcentagem: '--.--%',
      total: '---',
      status: 'up',
      icon: ChartLineUp,
      color: 'bg-[#5fe2c2]',
      destaq: ' o último culto',
    },
  ];

  return (
    <div className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-between gap-4 p-2 md:flex-nowrap">
      {statusIbb.map((stat) => (
        <Card
          key={stat.title}
          className="flex-warp relative w-full cursor-pointer flex-col rounded-lg border-black/5 bg-white p-4 transition hover:shadow-md"
        >
          <div className="flex w-full items-center justify-between">
            <div className="mb-0 font-sans text-sm font-semibold uppercase leading-normal">
              {stat.title}
            </div>
            <div className={`rounded-full ${stat.color} p-2 drop-shadow-md`}>
              <stat.icon width={24} height={24} color="#fff" />
            </div>
          </div>
          <div className="flex items-center">
            <span
              className={cn('text-lg font-bold', {
                'text-red-500': almasGanhasNoMes < almasGanhasNoMesPassado,
                'text-emerald-500': almasGanhasNoMes >= almasGanhasNoMesPassado,
              })}
            >
              {stat.total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="ml-2 text-sm font-bold leading-normal text-gray-500">
              {stat.destaq}
            </span>
            <span
              className={'text-sm font-bold leading-normal text-emerald-500'}
            >
              {stat?.referenciaAnterior}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
