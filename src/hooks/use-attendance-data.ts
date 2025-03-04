'use client';

import { auth } from '@/auth';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

type CultoData = {
  nome: string;
  data: string;
  presentes: number;
  capacidade: number;
  comparativo: number;
};

type CultoTipo = 'edificacao' | 'cpd' | 'celebracao-manha' | 'celebracao-tarde';

type AttendanceData = Record<CultoTipo, CultoData[]>;

export function useAttendanceData() {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: dataSession } = useSession();
  const token = dataSession?.user.token as string;
  const axiosAuth = useAxiosAuth(token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosAuth('/cultosindividuais/attendance');
        const result = await response.data;
        setData(result);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Erro desconhecido ao buscar dados'),
        );
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
