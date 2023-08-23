'use client'
import { ReturnMembers } from '@/app/(authenticed)/novo-membro/schema'
import { fetchWithToken } from '@/functions/functions'
import { UserFocus } from '@phosphor-icons/react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
// import { useEffect, useState } from 'react'

export default function ListMembers() {
  const { data: session } = useSession()

  const hostname = 'app-ibb.onrender.com'
  const URL = `https://${hostname}/users`

  const {
    data: members,
    error,
    isValidating,
    isLoading,
  } = useSWR<ReturnMembers[]>(
    [URL, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
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
          <div className="text-white">carregando...</div>
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
            <h2 className="text-lg font-semibold leading-7 text-gray-800">
              Lista de Presença
            </h2>
            <table className="w-full table-auto border-separate border-spacing-y-6">
              <thead>
                <tr className="text-base font-bold ">
                  <th className="border-b-2 border-blue-300 py-2 text-start text-gray-800">
                    Nome
                  </th>
                  <th className="border-b-2 border-orange-300 py-2 text-gray-800">
                    Status
                  </th>
                  <th className="hidden border-b-2 border-indigo-300 py-2 text-gray-800 sm:block">
                    Cargo
                  </th>
                  <th className="hidden border-b-2 border-indigo-300 py-2 text-gray-800 sm:block">
                    Supervisão
                  </th>
                  <th className="hidden border-b-2 border-indigo-300 py-2 text-gray-800 sm:block">
                    Célula
                  </th>
                  <th className="border-b-2 border-green-300 py-2 text-gray-800"></th>
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
                          className={`inline w-full rounded-md px-2 py-1 text-center ${
                            user.situacao_no_reino?.nome === 'Ativo'
                              ? 'border border-green-200 bg-green-100 ring-green-500'
                              : user.situacao_no_reino?.nome === 'Normal'
                              ? 'border border-blue-200 bg-blue-100 ring-blue-500'
                              : user.situacao_no_reino?.nome === 'Frio'
                              ? 'border border-orange-200 bg-orange-100 ring-orange-500'
                              : 'border border-red-200 bg-red-100 ring-red-500'
                          }`}
                        >
                          {user.situacao_no_reino?.nome}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="hidden w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-center ring-gray-500 sm:inline">
                          {user.cargo_de_lideranca?.nome}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="hidden w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-center ring-gray-500 sm:inline">
                          {user.supervisao_pertence?.nome}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="hidden w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-center ring-gray-500 sm:inline">
                          {user.celula?.nome}
                        </span>
                      </td>

                      <td className="ml-1 text-center">
                        <button
                          name={user.first_name}
                          value={user.id}
                          type="button"
                          className="h-4 w-4 cursor-pointer border-red-300 text-red-600 focus:ring-red-600"
                        >
                          Delete
                        </button>
                      </td>
                      <td className="mr-1 text-center">
                        <button
                          name={user.first_name}
                          value={user.id}
                          type="button"
                          className="h-4 w-4 cursor-pointer border-green-300 text-green-600 focus:ring-green-600"
                        >
                          Editar
                        </button>
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
            <button
              className="mx-auto w-full rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
              type="submit"
            >
              Registrar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
