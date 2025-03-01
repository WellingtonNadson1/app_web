'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useData } from '@/providers/providers';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { BASE_URL } from '@/lib/axios';
import { RelatorioForm } from './relatorio-form';
import type { FormRelatorioSchema, TSupervisionData } from './schema';
import TabelRelatorio from './tabela-relatorio';
import Link from 'next/link';
import BackButton from '@/components/back-button';

export default function RelatoriosPresencaCelula() {
  const { data: session } = useSession();
  const token = session?.user?.token as string;
  const axiosAuth = useAxiosAuth(token);
  const URLPresencaReuniaoCelula = `${BASE_URL}/relatorio/presencacelula`;
  const [relatorioData, setRelatorioData] = useState<TSupervisionData>();
  const [isLoading, setIsLoading] = useState(false);

  const { data: dataAllCtx } = useData();
  const supervisoes = dataAllCtx?.combinedData[0] || [];

  const handleRelatorio = async (formData: FormRelatorioSchema) => {
    try {
      setIsLoading(true);
      const response = await axiosAuth.post(URLPresencaReuniaoCelula, formData);
      setRelatorioData(response.data);
    } catch (error) {
      console.error(error);
      // TODO: Add error handling, e.g., show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-40 p-2 bg-white rounded-sm">
      <div className="px-3 mt-2 mb-3">
        <div className="p-3">
          <div className="flex items-center justify-start gap-4">
            <Link href="/central/dashboard">
              <Image
                className="cursor-pointer"
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
                Relatório de Presença nas Reuniões de Células
              </h2>
            </div>
          </div>

          <div className="flex items-center justify-start gap-4">
            <BackButton label="Voltar" className="my-6" />
          </div>

          <RelatorioForm
            onSubmit={handleRelatorio}
            // @ts-ignore
            supervisoes={supervisoes}
            isLoading={isLoading}
          />
        </div>
      </div>

      {relatorioData?.supervisionData?.celulas?.map((celula) => (
        <div key={celula.id} className="flex flex-col gap-1">
          <TabelRelatorio celula={celula} supervisionData={relatorioData} />
        </div>
      ))}
    </div>
  );
}
