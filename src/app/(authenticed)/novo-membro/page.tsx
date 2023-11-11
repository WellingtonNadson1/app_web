'use client'
import ListMembers from '@/components/listMembers'
import { ReturnMembers } from './schema'
import { useSession } from 'next-auth/react'
import { BASE_URL } from '@/functions/functions'
import { UserFocus } from '@phosphor-icons/react'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { useQuery } from '@tanstack/react-query'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'


export default function NovoMembro() {
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  const URL = `${BASE_URL}/users`

  const { data: members, isError: error, isLoading } = useQuery<ReturnMembers[]>({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await axiosAuth.get(URL)
      return response.data
    },
  })

  if (error) {
    return (
      <div className="w-full px-2 py-2 mx-auto">
        <div className="w-full mx-auto">
          <div>
            Falha ao carregar, por favor, saia e entre no App novamente.
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <>
        <div className="relative w-full px-6 py-2 mx-auto mt-8 bg-white shadow-lg rounded-xl">
          <div className="w-full px-2 py-2 ">
            <div className="w-full px-1 py-2 rounded-md">
              <div className="flex items-center justify-between">
                {/* ... Outros elementos do cabeçalho ... */}
                <div className='flex items-center justify-between gap-3 sm:justify-start'>
                  <h2 className="py-6 text-lg font-semibold leading-7 text-gray-800">
                    Lista de Membros IBB
                  </h2>
                  <div className='items-center justify-center hidden px-3 py-2 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-blue-50 text-sky-700 ring-blue-600/20 sm:block'>
                    <p className='h-4 w-200 animate-pulse'>Total <span className='px-2 py-1 ml-2 text-white rounded-md bg-sky-700'></span></p>
                  </div>
                  <div className='items-center justify-center hidden px-3 py-2 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-green-50 text-sky-700 ring-blue-600/20 sm:block'>
                    <p className='h-4 w-200 animate-pulse'>Ativos <span className='px-2 py-1 ml-2 text-white bg-green-700 rounded-md'></span></p>
                  </div>
                  <div className='items-center justify-center hidden px-3 py-2 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-sky-50 text-sky-700 ring-blue-600/20 md:block'>
                    <p className='h-4 w-200 animate-pulse'>Normal <span className='px-2 py-1 ml-2 text-white rounded-md bg-sky-700'></span></p>
                  </div>
                </div>
                <button className='h-4 w-35 animate-pulse'></button>
              </div>
            </div>
            <table className="w-full border-separate table-auto border-spacing-y-3">
              {/* ... Cabeçalho da tabela ... */}
              <thead>
                <tr className="text-base font-bold ">
                  <th className="py-2 text-gray-800 border-b-2 border-blue-300 text-start">
                    Nome
                  </th>
                  <th className="hidden py-2 text-gray-800 border-b-2 border-orange-300 text-start sm:table-cell">
                    Status
                  </th>
                  <th className="hidden py-2 text-gray-800 border-b-2 border-indigo-300 text-start sm:table-cell">
                    Cargo
                  </th>
                  <th className="hidden py-2 text-gray-800 border-b-2 border-blue-300 text-start sm:table-cell">
                    Supervisão
                  </th>
                  <th className="hidden py-2 text-gray-800 border-b-2 border-indigo-300 text-start sm:table-cell">
                    Célula
                  </th>
                  <th className="py-2 text-center text-gray-800 border-b-2 border-red-300">
                    Opções
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-700">
                {isLoading ? ( // Verificando se está em estado de carregamento
                  // Renderizar o esqueleto de carregamento
                  Array.from({ length: 5 }).map((_, index) => ( // Suponhamos que você queira renderizar 5 linhas de esqueleto
                <tr key={index} className="py-8 border-b border-gray-200">
                  <td>
                    <div className="flex items-center gap-3">
                      <UserFocus size={24} />
                      <div className="w-20 h-4 bg-gray-300 animate-pulse"></div>
                    </div>
                  </td>
                  {/* ... Outras células de esqueleto ... */}
                </tr>
              ))
                ) : (
                  // Renderizar a lista de membros
                  <SpinnerButton message={'Carregando'}/>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="relative w-full px-2 mx-auto mt-4 mb-4">
        {members &&
          <ListMembers members={members} />
        }
      </div>
    </>
  )
}
