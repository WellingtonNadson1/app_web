'use client'
import AddNewMember from '@/app/(authenticed)/novo-membro/AddNewMember'
import DeleteMember from '@/app/(authenticed)/novo-membro/DeleteMember'
import UpdateMember from '@/app/(authenticed)/novo-membro/UpdateMember'
import { ReturnMembers } from '@/app/(authenticed)/novo-membro/schema'
import { fetchWithToken } from '@/functions/functions'
import { UserFocus } from '@phosphor-icons/react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useSWR from 'swr'
import SpinnerButton from '../spinners/SpinnerButton'
// import { useEffect, useState } from 'react'

export default function ListMembers() {
  const { data: session } = useSession()
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)

  const hostname = 'app-ibb.onrender.com'
  const URL = `https://${hostname}/users`

  const {
    data: members,
    error,
    isValidating,
    isLoading,
  } = useSWR<ReturnMembers[]>(
    [URL, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, 'GET', token),
  )

  console.log('Members dados: ', members)

  if (error) {
    return (
      <div className="mx-auto w-full px-2 py-2">
        <div className="mx-auto w-full">
          <div>failed to load</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full px-2 py-2">
        <div className="mx-auto flex w-full items-center gap-2">
          <div className="flex items-center gap-3 text-white">
            <SpinnerButton />
            <span className="text-gray-500">carregando...</span>
          </div>
        </div>
      </div>
    )
  }

  if (isValidating) {
    console.log('Is Validating', isValidating)
  }

  return (
    <>
      <div className="relative mx-auto w-full rounded-xl bg-white px-4 py-2 shadow-lg">
        <div className="w-full px-2 py-2 ">
          <div className="w-full rounded-md px-1 py-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold leading-7 text-gray-800">
                Lista de Membros IBB
              </h2>
              <AddNewMember />
            </div>
            <table className="w-full table-auto border-separate border-spacing-y-6">
              <thead>
                <tr className="text-base font-bold ">
                  <th className="border-b-2 border-blue-300 py-2 text-start text-gray-800">
                    Nome
                  </th>
                  <th className="invisible border-b-2 border-orange-300 py-2 text-gray-800 sm:visible">
                    Status
                  </th>
                  <th className="invisible border-b-2 border-indigo-300 py-2 text-gray-800 sm:visible">
                    Cargo
                  </th>
                  <th className="invisible border-b-2 border-blue-300 py-2 text-gray-800 sm:visible">
                    Supervisão
                  </th>
                  <th className="invisible border-b-2 border-indigo-300 py-2 text-gray-800 sm:visible">
                    Célula
                  </th>
                  <th className="border-b-2 border-red-300 py-2 text-gray-800"></th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-700">
                {!isLoading ? (
                  members?.map((user) => (
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
                      <td className="text-center">
                        <span
                          className={`inline-flex w-full items-center justify-center rounded-md px-2 py-1 text-center text-xs font-medium ring-1 ring-inset ${
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
                      <td className="hidden text-center sm:inline">
                        <span className="hidden items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20 sm:inline">
                          {user.cargo_de_lideranca?.nome}
                        </span>
                      </td>
                      <td className="hidden text-center sm:inline">
                        <span className="hidden items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20 sm:inline">
                          {user.supervisao_pertence?.nome}
                        </span>
                      </td>
                      <td className="hidden text-center sm:inline">
                        <span className="hidden items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20 sm:inline">
                          {user.celula?.nome}
                        </span>
                      </td>

                      <td className="flex items-center justify-center gap-2 text-center">
                        <DeleteMember
                          member={user.id}
                          memberName={user.first_name}
                        />
                        <div onClick={() => setShouldFetch(true)}>
                          {!isLoading && (
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
            {/* <button
              className="mx-auto w-full rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
              type="submit"
            >
              Registrar
            </button> */}
          </div>
        </div>
      </div>
    </>
  )
}
