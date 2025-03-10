'use client';
import SpinnerButton from '@/components/spinners/SpinnerButton';
import { Toaster } from '@/components/ui/toaster';
import { BASE_URL } from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { UserFocus } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Suspense } from 'react';
import { z } from 'zod';
import { columns } from './table-users/columns';
import { DataTableUsers } from './table-users/data-table-users';
import { userSchemaTable } from './table-users/schema';

export default function NovoMembro() {
  const { data: session, status } = useSession();
  const axiosAuth = useAxiosAuth(session?.user?.token as string);

  const URL = `${BASE_URL}/users`;

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
      throw error; // Re-throw para o useQuery tratar o erro
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
    enabled: status === 'authenticated',
  });

  // JSX principal com lógica condicional após todos os hooks
  return (
    <>
      <Toaster />
      {status === 'loading' || isLoading ? (
        <div className="bg-white relative w-full px-4 py-2 mx-auto mt-8 shadow-lg rounded-xl">
          <div className="w-full px-2 py-2">
            <div className="w-full px-1 py-2 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between gap-3 sm:justify-start">
                  <h2 className="py-6 text-lg font-semibold leading-7 text-gray-800">
                    Lista de Membros IBB
                  </h2>
                  <div className="items-center justify-center hidden px-3 py-2 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-blue-50 text-sky-700 ring-blue-600/20 sm:block">
                    <p className="h-4 w-200 animate-pulse">
                      Total{' '}
                      <span className="px-2 py-1 ml-2 text-white rounded-md bg-sky-700"></span>
                    </p>
                  </div>
                  <div className="items-center justify-center hidden px-3 py-2 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-green-50 text-sky-700 ring-blue-600/20 sm:block">
                    <p className="h-4 w-200 animate-pulse">
                      Ativos{' '}
                      <span className="px-2 py-1 ml-2 text-white bg-green-700 rounded-md"></span>
                    </p>
                  </div>
                  <div className="items-center justify-center hidden px-3 py-2 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-sky-50 text-sky-700 ring-blue-600/20 md:block">
                    <p className="h-4 w-200 animate-pulse">
                      Normal{' '}
                      <span className="px-2 py-1 ml-2 text-white rounded-md bg-sky-700"></span>
                    </p>
                  </div>
                </div>
                <button className="h-4 w-35 animate-pulse"></button>
              </div>
            </div>
            <table className="w-full border-separate table-auto">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-2 py-3 font-medium text-[#6D8396] border-b-2 border-blue-300 text-start">
                    Nome
                  </th>
                  <th className="hidden px-2 py-3 font-medium text-[#6D8396] border-b-2 border-orange-300 text-start sm:table-cell">
                    Status
                  </th>
                  <th className="hidden px-2 py-3 font-medium text-[#6D8396] border-b-2 border-indigo-300 text-start sm:table-cell">
                    Cargo
                  </th>
                  <th className="hidden px-2 py-3 font-medium text-[#6D8396] border-b-2 border-blue-300 text-start sm:table-cell">
                    Supervisão
                  </th>
                  <th className="hidden px-2 py-3 font-medium text-[#6D8396] border-b-2 border-indigo-300 text-start sm:table-cell">
                    Célula
                  </th>
                  <th className="px-2 py-3 font-medium text-[#6D8396] text-center border-b-2 border-red-300">
                    Opções
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-700">
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="py-8 border-b border-gray-200">
                    <td>
                      <div className="flex items-center gap-3">
                        <UserFocus size={24} />
                        <div className="w-20 h-4 bg-gray-300 animate-pulse"></div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                    </td>
                    <td>
                      <div className="w-16 h-4 mx-auto bg-gray-300 animate-pulse"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : error ? (
        <div className="w-full px-2 py-2 mx-auto">
          <div className="w-full mx-auto z-20">
            <div>
              Falha ao carregar, por favor, saia e entre no App novamente.
            </div>
          </div>
        </div>
      ) : (
        <Suspense fallback={<SpinnerButton message="Carregando..." />}>
          {isSuccess && members && (
            <div className="relative w-full px-2 rounded-xl mx-auto mt-4 mb-4">
              <DataTableUsers columns={columns} data={members as any} />
            </div>
          )}
        </Suspense>
      )}
    </>
  );
}
