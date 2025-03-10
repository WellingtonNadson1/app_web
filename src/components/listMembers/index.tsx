'use client';
import AddNewMember from '@/app/(private)/(central)/novo-membro/AddNewMember';
import DeleteMember from '@/app/(private)/(central)/novo-membro/DeleteMember';
import { ReturnMembers } from '@/app/(private)/(central)/novo-membro/schema';
import UpdateMember from '@/app/(private)/(central)/novo-membro/UpdateMember';
import { UserFocus } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import Pagination from '../Pagination';
import { Badge } from '../ui/badge';

interface ListMembersProps {
  members: ReturnMembers[];
}

export default function ListMembers({ members }: ListMembersProps) {
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const [memberAtivo, setMemberAtivo] = useState<ReturnMembers[]>();
  const [memberNormal, setMemberNormal] = useState<ReturnMembers[]>();

  useEffect(() => {
    setMemberAtivo(
      members.filter((user) => user?.situacao_no_reino?.nome === 'Ativo'),
    );
  }, [members]);

  useEffect(() => {
    setMemberNormal(
      members.filter((user) => user?.situacao_no_reino?.nome === 'Normal'),
    );
  }, [members]);

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const membersSort = members?.sort((a, b) =>
    a.first_name.localeCompare(b.first_name),
  );
  const displayedMembers = membersSort?.slice(startIndex, endIndex);

  return (
    <>
      <div className="relative w-full py-2 mx-auto bg-white shadow-lg rounded-xl">
        <div className="w-full px-2 py-2 ">
          <div className="w-full px-1 py-2 rounded-md">
            <div className="flex items-center justify-between w-full gap-3">
              <div className="flex items-center justify-between w-full gap-3 mb-4 sm:justify-start">
                <h2 className="py-6 text-lg font-semibold leading-7 text-gray-700 line-clamp-1">
                  Lista de Membros IBB
                </h2>
                <div className="items-center justify-center hidden px-2 py-1 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-blue-50 text-sky-700 ring-blue-600/20 sm:block">
                  <p className="flex items-center justify-between">
                    Total{' '}
                    <span className="px-1 py-1 ml-2 text-white rounded-md bg-sky-700">
                      {members?.length}
                    </span>
                  </p>
                </div>
                <div className="items-center justify-center hidden px-2 py-1 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-green-50 text-sky-700 ring-blue-600/20 sm:block">
                  <p className="flex items-center justify-between">
                    Ativos{' '}
                    <span className="px-1 py-1 ml-2 text-white bg-green-700 rounded-md">
                      {memberAtivo?.length}
                    </span>
                  </p>
                </div>
                <div className="items-center justify-center hidden px-2 py-1 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-sky-50 text-sky-700 ring-blue-600/20 md:block">
                  <p className="flex items-center justify-between">
                    Normal{' '}
                    <span className="px-1 py-1 ml-2 text-white rounded-md bg-sky-700">
                      {memberNormal?.length}
                    </span>
                  </p>
                </div>
              </div>
              <div className="w-full mb-4 sm:w-2/5">
                <AddNewMember />
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
                {members ? (
                  displayedMembers?.map((user, index) => (
                    <tr
                      className="py-8 border-b border-gray-200 hover:bg-gray-50/90"
                      key={user.id}
                    >
                      <td className="px-2 py-1 border-b border-gray-200">
                        <div className="flex items-center justify-start gap-3">
                          <UserFocus size={24} />
                          <h2 className="ml-4">{user.first_name}</h2>
                        </div>
                      </td>
                      <td className="hidden px-2 py-1 text-center border-b border-gray-200 sm:table-cell">
                        <Badge
                          className={`hidden w-full items-center justify-center text-center text-xs font-medium sm:table-cell ${
                            user.situacao_no_reino?.nome === 'Ativo'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800'
                              : user.situacao_no_reino?.nome === 'Normal'
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800'
                                : user.situacao_no_reino?.nome === 'Frio'
                                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800'
                          }`}
                        >
                          {user.situacao_no_reino?.nome}
                        </Badge>
                      </td>
                      <td className="hidden px-2 py-1 text-center border-b border-gray-200 sm:table-cell">
                        <Badge className="items-center hidden text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 sm:table-cell">
                          {user.cargo_de_lideranca?.nome}
                        </Badge>
                      </td>
                      <td className="hidden px-2 py-1 text-center border-b border-gray-200 sm:table-cell">
                        <Badge className="items-center w-full hidden text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 sm:table-cell">
                          {user.supervisao_pertence?.nome}
                        </Badge>
                      </td>
                      <td className="hidden px-2 py-1 text-center border-b border-gray-200 sm:table-cell">
                        <Badge className="items-center hidden text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 sm:table-cell">
                          {user.celula?.nome}
                        </Badge>
                      </td>

                      <td className="flex items-center justify-center gap-2 px-2 py-1 text-center border-b border-gray-200">
                        <DeleteMember
                          memberId={user.id}
                          memberName={user.first_name}
                        />
                        <UpdateMember member={user} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>
                      <p>Carregando...</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Use the Pagination component */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((members?.length || 0) / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
