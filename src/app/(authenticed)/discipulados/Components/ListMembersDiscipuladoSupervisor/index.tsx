'use client'
import { User } from '@phosphor-icons/react'
import { useState } from 'react'
import { SupervisaoData } from './schema'
import UpdateSupervisorDisicipulado from '@/app/(authenticed)/discipulados/[dicipuladosupervisaoId]/supervisor/[supervisorId]/UpdateSupervisorDiscipulado'
import Pagination from '@/components/Pagination'

export default function ListMembersDiscipuladoSupervisor(SupervisaoData: SupervisaoData) {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }
  // Pagination
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  console.log('data', SupervisaoData)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const membersSort = SupervisaoData?.supervisor?.discipulador_usuario_discipulador_usuario_discipulador_idTouser?.sort((a, b) => a?.user_discipulador_usuario_usuario_idTouser?.first_name.localeCompare(b?.user_discipulador_usuario_usuario_idTouser?.first_name))
  console.log('membersSort', membersSort)
  const displayedMembers = membersSort?.slice(startIndex, endIndex)
  console.log('displayedMembers', displayedMembers)

  return (
    <>
      <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
        <div className="w-full px-2 py-2 ">
          <div className="w-full px-1 py-2 rounded-md">
            <div className="flex flex-col items-start justify-between gap-1 mb-4">
              <h2 className="text-lg font-semibold leading-6 text-gray-700">
                Discipulados do(a) Supervisor(a)
              </h2>
              <h2 className="text-lg font-normal leading-7 text-gray-600 uppercase">
                {SupervisaoData?.supervisor?.first_name}
              </h2>
            </div>
            <table className="w-full border-separate table-auto">
              <thead className='bg-[#F8FAFC]'>
                <tr>
                  <th className="px-2 py-3 font-medium text-[#6D8396] border-b-2 border-blue-300 text-start">
                    Membro
                  </th>
                  {/* <th className="hidden py-2 font-medium text-[#6D8396] border-b-2 border-orange-300 text-start sm:table-cell">
                    Status
                  </th> */}
                  {/* <th className="hidden py-2 font-medium text-[#6D8396] border-b-2 border-indigo-300 text-start sm:table-cell">
                    Discipulador(a)
                  </th> */}
                  <th className="py-2 font-medium text-center text-[#6D8396] border-b-2 border-red-300">
                    Opções
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-700">
                {SupervisaoData ? (
                  displayedMembers?.map((user, index) => (
                    <tr
                      className="hover:bg-gray-50/90"
                      key={user.user_discipulador_usuario_usuario_idTouser.id}
                    >
                      <td className='px-2 py-1 border-b border-gray-200'>
                        <div className="flex items-center justify-start gap-2">
                          <div className='p-1 border rounded-full bg-slate-50 border-[#1F70B6]'>
                            <User size={22} color='#6D8396' />
                          </div>
                          <h2 className="ml-4">{user.user_discipulador_usuario_usuario_idTouser.first_name}</h2>
                        </div>
                      </td>
                      {/* <td className="px-2 py-1 text-center border-b border-gray-200"> */}
                      {/* <span
                          className={`hidden w-full items-center justify-center rounded-md px-2 py-1 text-center text-xs font-medium ring-1 ring-inset sm:table-cell ${user.situacao_no_reino?.nome === 'Ativo'
                            ? 'bg-green-100  text-green-700 ring-green-600/20'
                            : user.situacao_no_reino?.nome === 'Normal'
                              ? 'bg-blue-100  text-blue-700 ring-blue-600/20'
                              : user.situacao_no_reino?.nome === 'Frio'
                                ? 'bg-orange-100  text-orange-700 ring-orange-600/20'
                                : 'bg-red-100  text-red-700 ring-red-600/20'
                            }`}
                        >
                          {user.situacao_no_reino?.nome}
                        </span> */}
                      {/* </td> */}
                      {/* <td className="px-2 py-1 text-center border-b border-gray-200">
                        <span className="items-center hidden px-2 py-1 text-xs font-medium text-gray-700 rounded-md bg-gray-50 ring-1 ring-inset ring-gray-600/20 sm:table-cell">
                          {user?.user_discipulador_usuario_usuario_idTouser?.first_name}
                        </span>
                      </td> */}
                      <td className="px-2 py-1 text-center border-b border-gray-200">
                        <div className='flex items-center justify-center' onClick={() => setShouldFetch(true)}>
                          <UpdateSupervisorDisicipulado
                            member={membersSort[0]} // Pass the member object
                            key={membersSort[0].user_discipulador_usuario_usuario_idTouser.id}
                            supervisor={SupervisaoData?.supervisor} // Pass the supervisor object
                          />
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
              totalPages={Math.ceil((membersSort?.length || 0) / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}
