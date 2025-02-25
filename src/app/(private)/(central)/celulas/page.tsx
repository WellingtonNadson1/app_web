'use client';
import { Toaster } from '@/components/ui/toaster';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { columns } from './table-celulas/columns';
import { DataTableCelulas } from './table-celulas/data-table-ucelulas';
import { BASE_URL } from '@/lib/axios';

export default function Celulas() {
  const { data: session, status } = useSession();
  const axiosAuth = useAxiosAuth(session?.user?.token as string);
  const URLCelulas = `${BASE_URL}/celulas`;

  const getCelulas = async () => {
    const { data } = await axiosAuth.get(URLCelulas);
    return data;
  };

  const {
    data: celulas,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['allCelulasIbb'],
    queryFn: getCelulas,
    enabled: status === 'authenticated',
    staleTime: 0,
  });

  return (
    <>
      <Toaster />
      {/* <AddNewCelula /> */}
      {isLoading && <div>carregando...</div>}
      {isSuccess && celulas && (
        <div className="relative z-10 px-2 mt-2">
          <DataTableCelulas columns={columns} data={celulas as any} />
        </div>
      )}
    </>
  );
}
