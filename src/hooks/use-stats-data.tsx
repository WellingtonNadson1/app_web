'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

// Tipo para os dados de estatísticas
export interface StatsData {
  almasGanhasNoMes: number;
  almasGanhasNoMesPassado: number;
  almasGanhasNoAno: number;
  almasGanhasNoAnoPassado: number;
}

// Hook personalizado para buscar e gerenciar os dados de estatísticas
export function useStatsData() {
  const { data: session } = useSession();
  const token = session?.user.token;

  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Criamos o cliente axios fora do ciclo de renderização
  const fetchData = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);

    const axiosClient = axios.create({
      baseURL: 'https://back-ibb.vercel.app',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    try {
      const response = await axiosClient.get('/users/all');
      setData(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
        setError(
          new Error(error.response.data.message || 'Erro ao buscar dados'),
        );
      } else {
        console.error(error);
        setError(new Error('Erro desconhecido ao buscar dados'));
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Buscar dados quando o token estiver disponível
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  // Função para calcular a porcentagem de crescimento
  const calculateGrowthPercentage = (
    current: number,
    previous: number,
  ): number => {
    if (previous === 0) return 100; // Evitar divisão por zero
    return (current * 100) / previous;
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    calculateGrowthPercentage,
  };
}
