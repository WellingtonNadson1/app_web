'use client'
import { UserFocus } from '@phosphor-icons/react'
import { useState } from 'react'
import { Supervisor, dataSchemaGetDiscipuladoAllSupervisor, dataSchemaReturnExistDiscipuladoAllCell } from './schema'
import FormFirstDiscipuladoSupervisor from './FormFirstDiscipuladoSupervisor'
import FormSecondDiscipuladoSupervisor from './FormSecondDiscipuladoSupervisor'
import { useQuery } from '@tanstack/react-query'
import { BASE_URL, BASE_URL_LOCAL } from '@/functions/functions'
import { useUserDataStore } from '@/store/UserDataStore'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import Pagination from '@/components/Pagination'
import SpinnerButton from '@/components/spinners/SpinnerButton'

export default function ListMembersSupervisorDiscipulado({ data }: Supervisor) {
  // console.log('data', data)
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }
  // Pagination
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const { token } = useUserDataStore.getState()
  const axiosAuth = useAxiosAuthToken(token)
  const URLDiscipuladosExist = `${BASE_URL}/discipulados/allmemberssupervisor/existing-register`

  const GetAllRegisterDiscipuladoCell = async (dataForm: dataSchemaGetDiscipuladoAllSupervisor) => {
    const result: dataSchemaReturnExistDiscipuladoAllCell = await axiosAuth.post(URLDiscipuladosExist, dataForm)
    return result
  }
  const supervisor_id = data.id
  const data_ocorreu = new Date()

  const { data: registerDiscipuladosSupervisor, isLoading, isSuccess } = useQuery({
    queryKey: ['dataRegisterAllDiscipuladoCell', supervisor_id],
    queryFn: async () => GetAllRegisterDiscipuladoCell({
      supervisor_id
      , data_ocorreu
    }),
  })

  !isSuccess && <SpinnerButton message='' />

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const membersSort = registerDiscipuladosSupervisor?.data[0]?.discipulador_usuario_discipulador_usuario_discipulador_idTouser.sort((a, b) => a.user_discipulador_usuario_usuario_idTouser.first_name.localeCompare(b.user_discipulador_usuario_usuario_idTouser.first_name))
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
                        Discípulos
                      </h2>
                      <div className='items-center justify-center px-2 py-1 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-blue-50 text-sky-700 ring-blue-600/20 sm:block'>
                        <p className='flex items-center justify-between'>Total <span className='px-1 py-1 ml-2 text-white rounded-md bg-sky-700'>{membersSort?.length}</span></p>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-700">
                {data.discipulador_usuario_discipulador_usuario_discipulador_idTouser ? (
                  displayedMembers?.map((user) => (
                    <tr
                      className="py-8 border-b border-gray-200 rounded-lg hover:bg-gray-50/90"
                      key={user.user_discipulador_usuario_usuario_idTouser.id}
                    >
                      <td className='py-3 border-b border-gray-200 sm:py-3'>
                        <div className="relative w-full px-2 py-2 mx-auto bg-white shadow-md rounded-xl">
                          <div className="w-full px-2 py-2 ">
                            <div className="w-full px-1 py-2 rounded-md">
                              <div className="flex items-center justify-start gap-1 mb-6 sm:mb-4">
                                <UserFocus size={24} />
                                <h2 className="ml-3">{user.user_discipulador_usuario_usuario_idTouser.first_name}</h2>
                              </div>
                              <div className='flex flex-col gap-4 mb-4 sm:mb-3 sm:flex sm:flex-row sm:items-start sm:justify-between'>
                                {/* 1º Discipulado */}
                                <div className='sm:w-full sm:gap-2 sm:flex sm:flex-col sm:items-center sm:justify-between'>
                                  {isSuccess && <FormFirstDiscipuladoSupervisor key={user.user_discipulador_usuario_usuario_idTouser.id} discipulador_name={registerDiscipuladosSupervisor.data[0].first_name} supervisor_id={registerDiscipuladosSupervisor.data[0].id} membro={user} />}
                                </div>

                                {/* 2º Discipulado */}
                                <div className='sm:w-full sm:gap-2 sm:flex sm:flex-col sm:items-center sm:justify-between'>
                                  {isSuccess && <FormSecondDiscipuladoSupervisor key={user.user_discipulador_usuario_usuario_idTouser.id} discipulador_name={registerDiscipuladosSupervisor.data[0].first_name} supervisor_id={registerDiscipuladosSupervisor.data[0].id} membro={user} />}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>
                      <div className='flex items-center justify-start p-2 mt-3'>
                        <SpinnerButton message='' />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Use the Pagination component */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((data.discipulador_usuario_discipulador_usuario_discipulador_idTouser?.length || 0) / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}
