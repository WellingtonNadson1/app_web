'use client';
import axios from 'axios';
import ClientDashboard from './ClientDashboard';
import { useSession } from 'next-auth/react';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';

// Função que roda no servidor para obter os dados
async function fetchServerData() {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth(session?.user?.token as string);
  const DataCombinetedt = async () => {
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

  const result = await DataCombinetedt();

  if (!result) {
    return {
      error: 'Failed to fetch data',
    };
  }

  return {
    session,
    result,
  };
}

export default async function DashboardPage() {
  const { session, result, error } = await fetchServerData();
  if (error) {
    return <div>Error fetching data: {error}</div>;
  }
  // @ts-ignore
  return <ClientDashboard session={session} result={result} />;
}
