'use client';
import { Disclosure } from '@headlessui/react';
import { UserFocus } from '@phosphor-icons/react';
import { ChevronUpIcon } from 'lucide-react';
import { Fragment, useState } from 'react';
import Pagination from '../Pagination';

interface Membro {
  id: string;
  first_name: string;
  cargo_de_lideranca: {
    id: string;
    nome: string;
  };
  discipulador_usuario_discipulador_usuario_usuario_idTouser: {
    user_discipulador_usuario_discipulador_idTouser: {
      id: string;
      first_name: string;
    };
  }[];
  discipulador_usuario_discipulador_usuario_discipulador_idTouser: {
    user_discipulador_usuario_usuario_idTouser: {
      id: string;
      first_name: string;
    };
  }[];
  user: {
    id: string;
    first_name: string;
  };
  situacao_no_reino: {
    id: string;
    nome: string;
  };
}

export interface CelulaData {
  id: string;
  nome: string;
  membros: Membro[];
  lider: {
    id: string;
    first_name: string;
  };
  supervisao: {
    id: string;
    nome: string;
  };
  date_que_ocorre: boolean;
}

export interface ListMembersCelulaProps {
  data: CelulaData;
}

export default function ListMembersCelulaDiscipulado({
  data,
}: ListMembersCelulaProps) {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const membersSort = data?.membros?.sort((a, b) =>
    a?.first_name.localeCompare(b?.first_name),
  );
  const displayedMembers = membersSort?.slice(startIndex, endIndex);

  return (
    <>
      <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
        <div className="w-full px-2 py-2 ">
          <div className="w-full px-1 py-2 rounded-md">
            <div className="flex items-center justify-between mb-7">
              <div className="flex flex-col items-start gap-2">
                <h2 className="text-lg font-semibold leading-6 text-gray-600">
                  Registro de Discipulados
                </h2>
              </div>
            </div>
            <table className="w-full border-separate table-auto">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-2 w-full py-3 font-medium text-[#6D8396] border-b-2 border-blue-300 text-start">
                    Nome
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-700">
                {data.membros ? (
                  displayedMembers?.map((user, index) => (
                    <tr
                      className="py-8 border-b border-gray-200 rounded-lg hover:bg-gray-50/90"
                      key={user.id}
                    >
                      <td className="px-2 py-1 border-b border-gray-200 sm:py-2">
                        <div className="flex items-center justify-start gap-2 my-3">
                          <UserFocus size={24} />
                          <h2 className="ml-4">{user.first_name}</h2>
                        </div>
                        <div className="gap-3 sm:mb-3 sm:flex sm:items-start sm:justify-between">
                          {/* 1º Discipulado */}
                          <div className="sm:w-full sm:gap-2 sm:flex sm:flex-col sm:items-center sm:justify-between">
                            <Disclosure>
                              {({ open }) => (
                                <Fragment>
                                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg bg-red-50 ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                                    <span>1º Discipulado do Mês</span>
                                    <ChevronUpIcon
                                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                                    />
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="w-full px-2 pt-4 pb-2 text-sm text-gray-500 sm:flex sm:flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                      <h2>Discipulador(a):</h2>
                                      <div className="flex items-center justify-start">
                                        <h2 className="ml-4">
                                          {user
                                            ?.discipulador_usuario_discipulador_usuario_usuario_idTouser[0]
                                            ?.user_discipulador_usuario_discipulador_idTouser
                                            ?.first_name || 'Sem Registro'}
                                        </h2>
                                      </div>
                                    </div>
                                    <form action="" method="post">
                                      <input
                                        type="date"
                                        id="first_discipulado"
                                        className="block w-full rounded-md border-0 py-1.5 mb-2 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                      />
                                      <button
                                        className="mx-auto flex w-full items-center justify-center rounded-md bg-[#014874] px-3 py-1.5 mb-6 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                                        type="submit"
                                      >
                                        Registrar
                                      </button>
                                    </form>
                                  </Disclosure.Panel>
                                </Fragment>
                              )}
                            </Disclosure>
                          </div>

                          {/* 2º Discipulado */}
                          <div className="sm:w-full sm:gap-2 sm:flex sm:flex-col sm:items-center sm:justify-between">
                            <Disclosure>
                              {({ open }) => (
                                <>
                                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 mt-2 mb-6 text-sm font-medium text-left text-blue-900 rounded-lg sm:mt-0 sm:mb-2 bg-red-50 ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75">
                                    <span>2º Discipulado do Mês</span>
                                    <ChevronUpIcon
                                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
                                    />
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="w-full px-2 pb-2 text-sm text-gray-500 sm:pt-2">
                                    <div className="flex items-center justify-between mb-3">
                                      <h2>Discipulador(a):</h2>
                                      <div className="flex items-center justify-start">
                                        <h2 className="ml-4">
                                          {user
                                            ?.discipulador_usuario_discipulador_usuario_usuario_idTouser[0]
                                            ?.user_discipulador_usuario_discipulador_idTouser
                                            ?.first_name || 'Sem Registro'}
                                        </h2>
                                      </div>
                                    </div>
                                    <form action="" method="post">
                                      <input
                                        type="date"
                                        id="second_discipulado"
                                        className="block w-full rounded-md border-0 py-1.5 mb-2 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                      />
                                      <button
                                        className="mx-auto flex w-full items-center justify-center rounded-md bg-[#014874] px-3 py-1.5 mb-6 sm:mb-2 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                                        type="submit"
                                      >
                                        Registrar
                                      </button>
                                    </form>
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure>
                          </div>
                        </div>
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
              totalPages={Math.ceil((data.membros?.length || 0) / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
