'use client';
import Pagination from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { User } from '@phosphor-icons/react';
import { useState } from 'react';
import UpdateSupervisorDisicipulado from '../../[dicipuladosupervisaoId]/supervisor/[supervisorId]/UpdateSupervisorDiscipulado';
import { SupervisaoData } from './schema';

export default function ListMembersDiscipuladoSupervisor(
  SupervisaoData: SupervisaoData,
) {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const membersSort = SupervisaoData?.supervisor?.discipulos?.sort((a, b) =>
    a?.user_discipulos?.first_name.localeCompare(
      b?.user_discipulos?.first_name,
    ),
  );

  const displayedMembers = membersSort?.slice(startIndex, endIndex);

  return (
    <>
      <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
        <div className="w-full px-2 py-2 ">
          <div className="w-full px-1 py-2 rounded-md">
            <div className="flex items-start justify-start gap-3 mb-4">
              <h2 className="text-lg font-semibold leading-6 text-gray-700">
                Discipulados do(a) Supervisor(a):
              </h2>
              <Badge>{SupervisaoData?.supervisor?.first_name}</Badge>
            </div>
            <table className="w-full border-separate table-auto">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-2 py-3 font-medium text-[#6D8396] border-b-2 border-blue-300 text-start">
                    Membro
                  </th>
                  <th className="py-2 font-medium text-center text-[#6D8396] border-b-2 border-red-300">
                    Opções
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-700">
                {displayedMembers.map((member) => (
                  <>
                    <tr
                      className="hover:bg-gray-50/90"
                      key={member?.user_discipulos?.id}
                    >
                      <td className="px-2 py-1 border-b border-gray-200">
                        <div className="flex items-center justify-start gap-2">
                          <div className="p-1 border rounded-full bg-slate-50 border-[#1F70B6]">
                            <User size={22} color="#6D8396" />
                          </div>
                          <h2 className="ml-4">
                            {member?.user_discipulos?.first_name}
                          </h2>
                        </div>
                      </td>
                      <td className="px-2 py-1 text-center border-b border-gray-200">
                        <div
                          className="flex items-center justify-center"
                          onClick={() => setShouldFetch(true)}
                        >
                          <UpdateSupervisorDisicipulado
                            member={member} // Pass the member object
                            key={membersSort[0]?.user_discipulos?.id}
                            supervisor={SupervisaoData?.supervisor} // Pass the supervisor object
                          />
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            {/* Use the Pagination component */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((membersSort?.length || 0) / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
