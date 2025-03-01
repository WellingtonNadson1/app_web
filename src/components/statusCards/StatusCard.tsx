'use client';
import {
  useAlmasAnoPassadoStore,
  useAlmasAnoStore,
  useAlmasMesPassadoStore,
  useAlmasMesStore,
} from '@/store/AlmasStorage';
import { ChartLineUp, Confetti, HandsPraying } from '@phosphor-icons/react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback, useMemo } from 'react';

export default function StatsCard() {
  const { data } = useSession();
  const token = data?.user.token;

  const axiosAuth = useMemo(
    () =>
      axios.create({
        baseURL: 'https://back-ibb.vercel.app',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
    [token],
  );

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axiosAuth.get('/users/all');
      return data;
    } catch (error) {
      console.error(axios.isAxiosError(error) ? error.response?.data : error);
      return null;
    }
  }, [axiosAuth]);

  const [isHydrated, setIsHydrated] = useState(false);
  const { almasGanhasNoMes, setAlmasGanhasNoMes } = useAlmasMesStore();
  const { almasGanhasNoMesPassado, setAlmasGanhasNoMesPassado } =
    useAlmasMesPassadoStore();
  const { almasGanhasNoAno, setAlmasGanhasNoAno } = useAlmasAnoStore();
  const { almasGanhasNoAnoPassado, setAlmasGanhasNoAnoPassado } =
    useAlmasAnoPassadoStore();

  useEffect(() => {
    fetchData().then((data) => {
      if (data) {
        setAlmasGanhasNoMes(data.almasGanhasNoMes);
        setAlmasGanhasNoAno(data.almasGanhasNoAno);
        setAlmasGanhasNoAnoPassado(data.almasGanhasNoAnoPassado);
        setAlmasGanhasNoMesPassado(data.almasGanhasNoMesPassado);
      }
      setIsHydrated(true);
    });
  }, [
    fetchData,
    setAlmasGanhasNoMes,
    setAlmasGanhasNoAno,
    setAlmasGanhasNoAnoPassado,
    setAlmasGanhasNoMesPassado,
  ]);

  if (!isHydrated) return <div>Carregando...</div>;

  const porcentagemAlmasGanhasMesPassado = useMemo(
    () =>
      almasGanhasNoMesPassado
        ? (almasGanhasNoMes * 100) / almasGanhasNoMesPassado
        : 0,
    [almasGanhasNoMes, almasGanhasNoMesPassado],
  );

  const statusIbb = useMemo(
    () => [
      {
        title: 'Conversões nas Células',
        porcentagem: `${porcentagemAlmasGanhasMesPassado.toFixed(2)}%`,
        total: almasGanhasNoMes ?? 'Carregando...',
        referenciaAnterior: `${almasGanhasNoMesPassado} almas`,
        icon: HandsPraying,
        color: 'bg-[#6074E1]',
        destaq: 'mês passado: ',
      },
      {
        title: 'Conversões Células/Ano',
        porcentagem: '--.--%',
        total: almasGanhasNoAno ?? 'Carregando...',
        referenciaAnterior: `${almasGanhasNoAnoPassado} almas`,
        icon: Confetti,
        color: 'bg-[#F55343]',
        destaq: ' o último ano ',
      },
      {
        title: 'Frequência',
        porcentagem: '--.--%',
        total: '---',
        referenciaAnterior: ' o último culto',
        icon: ChartLineUp,
        color: 'bg-[#5fe2c2]',
        destaq: '',
      },
    ],
    [
      porcentagemAlmasGanhasMesPassado,
      almasGanhasNoMes,
      almasGanhasNoMesPassado,
      almasGanhasNoAno,
      almasGanhasNoAnoPassado,
    ],
  );

  return (
    <div className="relative z-10 mx-auto flex w-full flex-wrap items-center justify-between gap-4 p-2 md:flex-nowrap">
      {statusIbb.map(
        (
          { title, icon: Icon, color, total, referenciaAnterior, destaq },
          index,
        ) => (
          <Card
            key={index}
            className="relative w-full cursor-pointer flex-col rounded-lg border-black/5 bg-white p-4 transition hover:shadow-md"
          >
            <div className="flex w-full items-center justify-between">
              <div className="mb-0 font-sans text-sm font-semibold uppercase leading-normal">
                {title}
              </div>
              <div className={`rounded-full ${color} p-2 drop-shadow-md`}>
                <Icon width={24} height={24} color="#fff" />
              </div>
            </div>
            <div className="flex items-center">
              <span
                className={cn('text-lg font-bold', {
                  'text-red-500': almasGanhasNoMes < almasGanhasNoMesPassado,
                  'text-emerald-500':
                    almasGanhasNoMes >= almasGanhasNoMesPassado,
                })}
              >
                {total}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-2 text-sm font-bold leading-normal text-gray-500">
                {destaq}
              </span>
              <span className="text-sm font-bold leading-normal text-emerald-500">
                {referenciaAnterior}
              </span>
            </div>
          </Card>
        ),
      )}
    </div>
  );
}
