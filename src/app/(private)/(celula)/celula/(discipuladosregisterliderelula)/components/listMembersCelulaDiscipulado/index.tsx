'use client';
import Pagination from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BASE_URL } from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { UserCircleDashed } from '@phosphor-icons/react/dist/ssr';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import FormFirstDiscipulado from './FormFirstDiscipulado';
import FormSecondDiscipulado from './FormSecondDiscipulado';
import Scheleton from './scheleton';
import {
  ListMembersCelulaProps,
  dataSchemaGetDiscipuladoAllCell,
  dataSchemaReturnExistDiscipuladoAllCell,
} from './schema';

export default function ListMembersCelulaDiscipulado({
  data,
}: ListMembersCelulaProps) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session, status } = useSession();
  const token = session?.user?.token as string;
  const axiosAuth = useAxiosAuth(token);

  const URLDiscipuladosExist = `${BASE_URL}/discipuladosibb/allmemberscell/existing-register`;

  const GetAllRegisterDiscipuladoCell = async (
    dataForm: dataSchemaGetDiscipuladoAllCell,
  ) => {
    const result: dataSchemaReturnExistDiscipuladoAllCell =
      await axiosAuth.post(URLDiscipuladosExist, dataForm);
    return result;
  };

  const cell_id = data.id;
  const data_ocorreu = new Date();

  const { data: registerDiscipuladosCell, isLoading } = useQuery({
    queryKey: ['dataRegisterAllDiscipuladoCell', cell_id],
    enabled: status === 'authenticated',
    queryFn: async () =>
      GetAllRegisterDiscipuladoCell({
        cell_id,
        data_ocorreu,
      }),
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const membersSort = registerDiscipuladosCell?.data[0]?.membros?.sort((a, b) =>
    a?.first_name.localeCompare(b?.first_name),
  );

  const displayedMembers = membersSort?.slice(startIndex, endIndex);

  return (
    <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
      <div className="w-full px-2 py-2">
        <div className="w-full px-1 py-2 rounded-md">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-lg font-semibold leading-6 text-gray-600">
              Registro de Discipulados
            </h2>
          </div>

          <table className="w-full border-separate table-auto">
            <thead>
              <tr>
                <th className="px-2 py-3 font-medium text-[#6D8396] bg-[#F8FAFC] border-b-2 border-blue-300 rounded-t-md">
                  <div className="flex items-center justify-between gap-3 sm:justify-start">
                    <h2 className="py-2">Discípulos</h2>
                    <Badge className="px-2 py-1 text-xs hover:bg-blue-100 font-medium rounded-md ring-1 ring-inset bg-blue-50 text-sky-700">
                      Total
                      <span className="px-1 py-1 ml-2 text-white rounded-md bg-sky-700">
                        {membersSort?.length || 0}
                      </span>
                    </Badge>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="text-sm font-normal text-gray-700">
              {isLoading ? (
                <tr>
                  <td>
                    <Scheleton />
                  </td>
                </tr>
              ) : (
                displayedMembers?.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3">
                      <Card className="my-2 flex items-start content-start">
                        <div className="relative w-full px-2 py-2 mx-auto bg-white rounded-xl">
                          <div className="w-full px-2 py-2">
                            <div className="w-full px-1 py-2 rounded-md">
                              <div className="flex items-center justify-start gap-1 mb-6 sm:mb-4">
                                <UserCircleDashed size={24} />
                                <h2 className="ml-3">{user.first_name}</h2>
                              </div>

                              <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="sm:w-full sm:flex sm:flex-col sm:items-center">
                                  <FormFirstDiscipulado membro={user} />
                                </div>

                                <div className="sm:w-full sm:flex sm:flex-col sm:items-center">
                                  <FormSecondDiscipulado membro={user} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil((membersSort?.length || 0) / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
