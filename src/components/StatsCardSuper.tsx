'use client'
import { BASE_URL } from '@/lib/axios'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { useUserDataStore } from '@/store/UserDataStore'
import { UsersFour } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface SupervisaoDataCard {
  id: string
  nome: string
  cor: string
  supervisor: {
    id: string
    first_name: string
  }
}

export default function StatsCardSuper() {
  const { data: session } = useSession()
  const token = session?.user?.token as string
  const axiosAuth = useAxiosAuth(token)

  const router = useRouter()

  const URL = `${BASE_URL}/supervisoes`

  // async function fetchWithToken(url: string, token: string) {
  //   const response = await fetch(url, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   const data = await response.json();
  //   return data;
  // }

  const {
    data: supervisoes,
    isError: error,
    isLoading,
  } = useQuery<SupervisaoDataCard[]>({
    queryKey: ['supervisoes'],
    queryFn: async () => {
      const response = await axiosAuth.get(URL)
      return await response.data
    },
  })

  if (error) {
    return (
      <div className="w-full px-2 py-2 mx-auto">
        <div className="w-full mx-auto">
          <div>failed to load</div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full px-2 py-2 mx-auto">
        <div className="flex items-center w-full gap-2 mx-auto">
          <div className="text-white">carregando...</div>
        </div>
      </div>
    )
  }

  const handleSupervisaoSelecionada = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    const id = event.currentTarget.id
    console.log('Esta aqui o ID clicado', id)
    router.push(`/supervisoes/${id}`)
  }

  return (
    <>
      <div className="relative z-10 w-full py-2 mx-auto">
        <div className="relative z-10 grid flex-wrap items-center justify-between w-full grid-cols-1 gap-4 p-2 mx-auto mt-3 sm:grid-cols-2 md:flex-nowrap">
          {supervisoes &&
            supervisoes?.map((supervisao) => (
              <div
                onClick={handleSupervisaoSelecionada}
                key={supervisao.id}
                id={supervisao.id}
                className={twMerge(
                  `flex-warp relative w-full cursor-pointer flex-col rounded-lg p-4 shadow-md `,
                  `bg-white hover:bg-${supervisao.cor}-95`,
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-lg font-semibold uppercase">
                    {supervisao.nome}
                  </div>
                  <div
                    className={twMerge(
                      `rounded-full p-2 drop-shadow-md`,
                      `bg-${supervisao.cor}`,
                    )}
                  >
                    <UsersFour width={24} height={24} color="#fff" />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold">
                    {/* {supervisao.nome} */}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold leading-normal text-emerald-500">
                    {/* {supervisao.nivel} */}
                  </span>
                  <span className="ml-2 text-sm font-bold leading-normal text-gray-500">
                    {/* {supervisao.nivel} */}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}
