'use client'
import Scheleton from '@/app/(discipuladosregisterliderelula)/components/listMembersCelulaDiscipulado/scheleton'
import Pagination from '@/components/Pagination'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useUserDataStore } from '@/store/UserDataStore'
import { UserCircleDashed } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import FormFirstDiscipuladoSupervisor from './FormFirstDiscipuladoSupervisor'
import FormSecondDiscipuladoSupervisor from './FormSecondDiscipuladoSupervisor'
import {
  Supervisor,
  dataSchemaGetDiscipuladoAllSupervisor,
  dataSchemaReturnExistDiscipuladoAllCell,
} from './schema'
import { useSession } from 'next-auth/react'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { BASE_URL } from '@/lib/axios'

export default function ListMembersSupervisorDiscipulado({ data }: Supervisor) {
  // console.log('data', data)
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }
  // Pagination
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const { data: session } = useSession()
  const token = session?.user?.token as string
  const axiosAuth = useAxiosAuth(token)
  const URLDiscipuladosExist = `${BASE_URL}/discipuladosibb/allmemberssupervisor/existing-register`

  const GetAllRegisterDiscipuladoCell = async (
    dataForm: dataSchemaGetDiscipuladoAllSupervisor,
  ) => {
    const result: dataSchemaReturnExistDiscipuladoAllCell =
      await axiosAuth.post(URLDiscipuladosExist, dataForm)
    return result
  }
  const supervisor_id = data.id
  const data_ocorreu = new Date()

  const {
    data: registerDiscipuladosSupervisor,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['dataRegisterAllDiscipuladoCell', supervisor_id],
    queryFn: async () =>
      GetAllRegisterDiscipuladoCell({
        supervisor_id,
        data_ocorreu,
      }),
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const membersSort = registerDiscipuladosSupervisor?.data[0]?.discipulos.sort(
    (a, b) =>
      a.user_discipulos.first_name.localeCompare(b.user_discipulos.first_name),
  )
  // console.log('membersSort', membersSort)
  const displayedMembers = membersSort?.slice(startIndex, endIndex)

  return (
    <>
      <Card className="relative w-full mt-2 px-4 py-2 mx-auto bg-white rounded-xl">
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
              <Card className="bg-[#F8FAFC] border-b-2 border-blue-300 text-start w-full">
                <thead className="flex justify-between w-full">
                  <tr className="w-full">
                    <th className="px-2 w-full py-3 font-medium text-[#6D8396] ">
                      <div className="flex items-center justify-between w-full gap-3 sm:justify-start">
                        <h2 className="py-2">Discípulos</h2>
                        <Badge className="items-center justify-center px-2 py-1 text-xs hover:bg-blue-100 font-medium text-center rounded-md ring-1 ring-inset bg-blue-50 text-sky-700 sm:block">
                          <p className="flex items-center justify-between">
                            Total{' '}
                            <span className="px-1 py-1 ml-2 text-white rounded-md bg-sky-700">
                              {membersSort?.length}
                            </span>
                          </p>
                        </Badge>
                      </div>
                    </th>
                  </tr>
                </thead>
              </Card>
              <tbody className="text-sm font-normal text-gray-700">
                {!isLoading ? (
                  displayedMembers?.map((user) => (
                    <Card
                      key={user.user_discipulos.id}
                      className="my-2 flex items-start content-start"
                    >
                      <tr className="w-full flex items-start justify-between">
                        <td className="py-3 w-full sm:py-3">
                          <div className="relative w-full px-2 py-2 mx-auto bg-white rounded-xl">
                            <div className="w-full px-2 py-2 ">
                              <div className="w-full px-1 py-2 rounded-md">
                                <div className="flex items-center justify-start gap-1 mb-6 sm:mb-4">
                                  <UserCircleDashed size={24} />
                                  <h2 className="ml-3">
                                    {user.user_discipulos.first_name}
                                  </h2>
                                </div>
                                <div className="flex flex-col gap-4 mb-4 sm:mb-3 sm:flex sm:flex-row sm:justify-between sm:items-start">
                                  {/* 1º Discipulado */}
                                  <div className="sm:w-full sm:gap-2 sm:flex sm:flex-col sm:items-center sm:justify-between">
                                    {isSuccess && (
                                      <FormFirstDiscipuladoSupervisor
                                        key={user.user_discipulos.id}
                                        discipulador_name={
                                          registerDiscipuladosSupervisor.data[0]
                                            .first_name
                                        }
                                        supervisor_id={
                                          registerDiscipuladosSupervisor.data[0]
                                            .id
                                        }
                                        membro={user}
                                      />
                                    )}
                                  </div>

                                  {/* 2º Discipulado */}
                                  <div className="sm:w-full sm:gap-2 sm:flex sm:flex-col sm:items-center sm:justify-between">
                                    {isSuccess && (
                                      <FormSecondDiscipuladoSupervisor
                                        key={user.user_discipulos.id}
                                        discipulador_name={
                                          registerDiscipuladosSupervisor.data[0]
                                            .first_name
                                        }
                                        supervisor_id={
                                          registerDiscipuladosSupervisor.data[0]
                                            .id
                                        }
                                        membro={user}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Card>
                  ))
                ) : (
                  <tr>
                    <td>
                      <div className="flex items-center justify-start p-2 mt-3">
                        <Scheleton />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Use the Pagination component */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(
                (data.discipulos?.length || 0) / itemsPerPage,
              )}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </Card>
    </>
  )
}
