'use client'
import { UserFocus } from '@phosphor-icons/react'
import { useState } from 'react'
import { ListMembersCelulaProps, dataSchemaGetDiscipuladoAllCell, dataSchemaReturnExistDiscipuladoAllCell } from './schema'
import FormFirstDiscipulado from './FormFirstDiscipulado'
import FormSecondDiscipulado from './FormSecondDiscipulado'
import { useQuery } from '@tanstack/react-query'
import { BASE_URL, BASE_URL_LOCAL } from '@/functions/functions'
import { useUserDataStore } from '@/store/UserDataStore'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import Pagination from '@/components/Pagination'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import Scheleton from './scheleton'

export default function ListMembersCelulaDiscipulado({ data }: ListMembersCelulaProps) {
  // console.log('data', data)
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }
  // Pagination
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const { token } = useUserDataStore.getState()
  const axiosAuth = useAxiosAuthToken(token)
  const URLDiscipuladosExist = `${BASE_URL_LOCAL}/discipulados/allmemberscell/existing-register`

  const GetAllRegisterDiscipuladoCell = async (dataForm: dataSchemaGetDiscipuladoAllCell) => {
    const result: dataSchemaReturnExistDiscipuladoAllCell = await axiosAuth.post(URLDiscipuladosExist, dataForm)
    return result
  }
  const cell_id = data.id
  const data_ocorreu = new Date()

  const { data: registerDiscipuladosCell, isLoading } = useQuery({
    queryKey: ['dataRegisterAllDiscipuladoCell', cell_id],
    queryFn: async () => GetAllRegisterDiscipuladoCell({
      cell_id
      , data_ocorreu
    }),
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const membersSort = registerDiscipuladosCell?.data[0]?.membros.sort((a, b) => a.first_name.localeCompare(b.first_name))
  // console.log('membersSort', membersSort)
  const displayedMembers = membersSort?.slice(startIndex, endIndex)

  return (
    <>
      <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
        <div className="w-full px-2 py-2 ">
          <div className="w-full px-1 py-2 rounded-md">
            <div className="flex items-center justify-between mb-7">
              <div className='flex flex-col items-start gap-2'>
                <h2 className="text-lg font-semibold leading-6 text-gray-600">
                  Registro de Discipulados
                </h2>
              </div>
            </div>
            <table className="w-full border-separate table-auto">
              <thead className='bg-[#F8FAFC]'>
                <tr>
                  <th className="px-2 w-full py-3 font-medium text-[#6D8396] border-b-2 border-blue-300 text-start">
                    <div className='flex items-center justify-between w-full gap-3 sm:justify-start'>
                      <h2 className="py-2">
                        Membros
                      </h2>
                      <div className='items-center justify-center px-2 py-1 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-blue-50 text-sky-700 ring-blue-600/20 sm:block'>
                        <p className='flex items-center justify-between'>Total <span className='px-1 py-1 ml-2 text-white rounded-md bg-sky-700'>{membersSort?.length}</span></p>
                      </div>
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
                  displayedMembers?.map((user, index) => (
                    <tr
                      className="py-8 border-b border-gray-200 rounded-lg hover:bg-gray-50/90"
                      key={user.id}
                    >
                      <td className='py-3 border-b border-gray-200 sm:py-3'>
                        <div className="relative w-full px-2 py-2 mx-auto bg-white shadow-md rounded-xl">
                          <div className="w-full px-2 py-2 ">
                            <div className="w-full px-1 py-2 rounded-md">
                              <div className="flex items-center justify-start gap-1 mb-6 sm:mb-4">
                                <UserFocus size={24} />
                                <h2 className="ml-3">{user.first_name}</h2>
                              </div>
                              <div className='flex flex-col gap-4 mb-4 sm:mb-3 sm:flex sm:flex-row sm:items-start sm:justify-between'>
                                {/* 1º Discipulado */}
                                <div className='sm:w-full sm:gap-2 sm:flex sm:flex-col sm:items-center sm:justify-between'>
                                  <FormFirstDiscipulado key={user.id} membro={user} />
                                </div>

                                {/* 2º Discipulado */}
                                <div className='sm:w-full sm:gap-2 sm:flex sm:flex-col sm:items-center sm:justify-between'>
                                  <FormSecondDiscipulado key={user.cargo_de_lideranca.id} membro={user} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
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
  )
}
