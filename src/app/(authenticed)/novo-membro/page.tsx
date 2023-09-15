'use client'
import ListMembers from '@/components/listMembers'
import useSWR from 'swr'
import { ReturnMembers } from './schema'
import { useSession } from 'next-auth/react'
import { fetchWithToken } from '@/functions/functions'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { UserFocus } from '@phosphor-icons/react'


export default function NovoMembro() {
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
    ([url, token]: [string, string]) => fetchWithToken(url, 'GET', token),
  )

  if (error) {
    return (
      <div className="mx-auto w-full px-2 py-2">
        <div className="mx-auto w-full">
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
        <div className="relative mt-8 mx-auto w-full rounded-xl bg-white px-6 py-2 shadow-lg">
          <div className="w-full px-2 py-2 ">
            <div className="w-full rounded-md px-1 py-2">
              <div className="flex items-center justify-between">
                {/* ... Outros elementos do cabeçalho ... */}
                <div className='flex items-center justify-between sm:justify-start gap-3'>
                  <h2 className="text-lg py-6 font-semibold leading-7 text-gray-800">
                    Lista de Membros IBB
                  </h2>
                  <div className='hidden items-center justify-center rounded-md px-3 py-2 text-center text-xs font-medium ring-1 ring-inset bg-blue-50  text-sky-700 ring-blue-600/20 sm:block'>
                    <p className='w-200 h-4 animate-pulse'>Total <span className='text-white ml-2 rounded-md px-2 py-1 bg-sky-700'></span></p>
                  </div>
                  <div className='hidden items-center justify-center rounded-md px-3 py-2 text-center text-xs font-medium ring-1 ring-inset bg-green-50  text-sky-700 ring-blue-600/20 sm:block'>
                    <p className='w-200 h-4 animate-pulse'>Ativos <span className='text-white ml-2 rounded-md px-2 py-1 bg-green-700'></span></p>
                  </div>
                  <div className='hidden items-center justify-center rounded-md px-3 py-2 text-center text-xs font-medium ring-1 ring-inset bg-sky-50  text-sky-700 ring-blue-600/20 md:block'>
                    <p className='w-200 h-4 animate-pulse'>Normal <span className='text-white ml-2 rounded-md px-2 py-1 bg-sky-700'></span></p>
                  </div>
                </div>
                <button className='w-35 h-4 animate-pulse'></button>
              </div>
            </div>
            <table className="w-full table-auto border-separate border-spacing-y-3">
              {/* ... Cabeçalho da tabela ... */}
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
                {isLoading ? ( // Verificando se está em estado de carregamento
                  // Renderizar o esqueleto de carregamento
                  Array.from({ length: 5 }).map((_, index) => ( // Suponhamos que você queira renderizar 5 linhas de esqueleto
      <tr key={index} className="border-b border-gray-200 py-8">
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
                  <p>CARREGANDO</p>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </>
    )
  }

  if (isValidating) {
    console.log('Is Validating', isValidating)
  }

  return (
    <>
      <div className="relative mx-auto mb-4 mt-4 w-full px-2">
        {members &&
          <ListMembers members={members} />
        }
      </div>
    </>
  )
}
