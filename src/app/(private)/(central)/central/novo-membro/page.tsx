'use client';
import { BASE_URL, BASE_URL_LOCAL } from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { columns } from './table-users/columns';
import { DataTableUsers } from './table-users/data-table-users';
import { userSchemaTable } from './table-users/schema';
import SkeletonTableNovoMembro from './skeleton-table-novo-membro';
import { Toaster } from 'sonner';

export default function NovoMembro() {
  const { data: session } = useSession();
  const token = session?.user.token as string;
  const axiosAuth = useAxiosAuth(token);

  const URL = `${BASE_URL_LOCAL}/users`;

  const Members = async () => {
    try {
      const { data } = await axiosAuth.get(URL);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  const {
    data: members,
    isError: error,
    isLoading,
    isSuccess,
  } = useQuery<z.infer<typeof userSchemaTable>>({
    queryKey: ['members'],
    queryFn: Members,
    enabled: !!token,
  });

  if (error) {
    return (
      <div className="w-full px-2 py-2 mx-auto">
        <div className="w-full mx-auto z-20">
          <div>
            Falha ao carregar os dados, por favor saia e entre no App novamente.
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <SkeletonTableNovoMembro isLoading />;
  }

  return (
    <>
      <Toaster />
      {isSuccess && (
        <div className="relative w-full px-2 rounded-xl mx-auto mt-4 mb-4">
          <DataTableUsers columns={columns} data={members as any} />
        </div>
      )}
    </>
  );
}
