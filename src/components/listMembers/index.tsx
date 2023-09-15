'use client'
import AddNewMember from '@/app/(authenticed)/novo-membro/AddNewMember'
import DeleteMember from '@/app/(authenticed)/novo-membro/DeleteMember'
import UpdateMember from '@/app/(authenticed)/novo-membro/UpdateMember'
import { ReturnMembers } from '@/app/(authenticed)/novo-membro/schema'
import { UserFocus } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import Pagination from '../Pagination'
// import { useEffect, useState } from 'react'

interface ListMembersProps {
  members: ReturnMembers[];
}

export default function ListMembers({ members }: ListMembersProps) {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const [memberAtivo, setMemberAtivo] = useState<ReturnMembers[]>()
  const [memberNormal, setMemberNormal] = useState<ReturnMembers[]>()

  useEffect(() => {
    setMemberAtivo(
      members.filter((user) => user?.situacao_no_reino?.nome === 'Ativo')
    )
  }, [members])

  useEffect(() => {
    setMemberNormal(
      members.filter((user) => user?.situacao_no_reino?.nome === 'Normal')
    )
  }, [members])

  // Pagination
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedMembers = members?.slice(startIndex, endIndex)

    return (
    <>
      <div className="relative mx-auto w-full rounded-xl bg-white px-4 py-2 shadow-lg">
        <div className="w-full px-2 py-2 ">
          <div className="w-full rounded-md px-1 py-2">
            <div className="flex items-center justify-between w-full gap-3">
              <div className='flex items-center justify-between sm:justify-start gap-3 w-full'>
                <h2 className="line-clamp-1 text-lg py-6 font-semibold leading-7 text-gray-800">
                  Lista de Membros IBB
                </h2>
                <div className='hidden items-center justify-center rounded-md px-2 py-1 text-center text-xs font-medium ring-1 ring-inset bg-blue-50  text-sky-700 ring-blue-600/20 sm:block'>
                  <p className='flex items-center justify-between'>Total <span className='text-white ml-2 rounded-md px-1 py-1 bg-sky-700'>{members?.length}</span></p>
                </div>
                <div className='hidden items-center justify-center rounded-md px-2 py-1 text-center text-xs font-medium ring-1 ring-inset bg-green-50  text-sky-700 ring-blue-600/20 sm:block'>
                  <p className='flex items-center justify-between'>Ativos <span className='text-white ml-2 rounded-md px-1 py-1 bg-green-700'>{memberAtivo?.length}</span></p>
                </div>
                <div className='hidden items-center justify-center rounded-md px-2 py-1 text-center text-xs font-medium ring-1 ring-inset bg-sky-50  text-sky-700 ring-blue-600/20 md:block'>
                  <p className='flex items-center justify-between'>Normal <span className='text-white ml-2 rounded-md px-1 py-1 bg-sky-700'>{memberNormal?.length}</span></p>
                </div>
                </div>
              <div className='sm:w-2/5 w-full'>
                <AddNewMember />              
              </div>
            </div>
            <table className="w-full table-auto border-separate border-spacing-y-3">
              <thead>
                <tr className="text-base font-bold ">
                  <th className="border-b-2 border-blue-300 py-2 text-start text-gray-800">
                    Nome
                  </th>
                  <th className="hidden border-b-2 border-orange-300 py-2 text-start text-gray-800 sm:table-cell">
                    Status
                  </th>
                  <th className="hidden border-b-2 border-indigo-300 py-2 text-start text-gray-800 sm:table-cell">
                    Cargo
                  </th>
                  <th className="hidden border-b-2 border-blue-300 py-2 text-start text-gray-800 sm:table-cell">
                    Supervisão
                  </th>
                  <th className="hidden border-b-2 border-indigo-300 py-2 text-start text-gray-800 sm:table-cell">
                    Célula
                  </th>
                  <th className="border-b-2 border-red-300 py-2 text-center text-gray-800">
                    Opções
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-700">
                {members ? (
                  displayedMembers?.map((user, index) => (
                    <tr
                      className="border-b border-gray-200 py-8 hover:bg-gray-100/90"
                      key={user.id}
                    >
                      <td>
                        <div className="flex items-center justify-start gap-3">
                          <UserFocus size={24} />
                          <h2 className="ml-4">{user.first_name}</h2>
                        </div>
                      </td>
                      <td className="hidden text-center sm:table-cell">
                        <span
                          className={`hidden w-full items-center justify-center rounded-md px-2 py-1 text-center text-xs font-medium ring-1 ring-inset sm:table-cell ${
                            user.situacao_no_reino?.nome === 'Ativo'
                              ? 'bg-green-100  text-green-700 ring-green-600/20'
                              : user.situacao_no_reino?.nome === 'Normal'
                              ? 'bg-blue-100  text-blue-700 ring-blue-600/20'
                              : user.situacao_no_reino?.nome === 'Frio'
                              ? 'bg-orange-100  text-orange-700 ring-orange-600/20'
                              : 'bg-red-100  text-red-700 ring-red-600/20'
                          }`}
                        >
                          {user.situacao_no_reino?.nome}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell text-center">
                        <span className="hidden items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20 sm:table-cell">
                          {user.cargo_de_lideranca?.nome}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell text-center">
                        <span className="hidden items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20 sm:table-cell">
                          {user.supervisao_pertence?.nome}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell text-center">
                        <span className="hidden items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20 sm:table-cell">
                          {user.celula?.nome}
                        </span>
                      </td>

                      <td className="flex items-center justify-center gap-2 text-center">
                        <DeleteMember
                          member={user.id}
                          memberName={user.first_name}
                        />
                        <div onClick={() => setShouldFetch(true)}>
                          {members && (
                            <UpdateMember
                              shouldFetch={shouldFetch}
                              memberId={user.id}
                            />
                          )}
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
              totalPages={Math.ceil((members?.length || 0) / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}
