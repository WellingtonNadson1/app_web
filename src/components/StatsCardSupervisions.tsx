'use client'
import { UsersFour } from '@phosphor-icons/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'

export interface SupervisaoDataCard {
  id: string
  nome: string
  cor: string
  supervisor: {
    id: string
    first_name: string
  }
}

export default function StatsCardSupervisions() {
  const { data: session } = useSession()
  const router = useRouter()

  const hostname = 'app-ibb.onrender.com'
  const URL = `https://${hostname}/supervisoes`

  function fetchWithToken(url: string, token: string) {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data
      })
  }

  const {
    data: supervisoes,
    error,
    isValidating,
    isLoading,
  } = useSWR<SupervisaoDataCard[]>(
    [URL, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, token),
  )

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

  const handleSupervisaoSelecionada = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    const id = event.currentTarget.id
    console.log('Esta aqui o ID clicado', id)
    router.push(`/supervisoes/${id}`)
  }

  console.log('Supervisoes Component:', supervisoes)
  console.log('Token in Component:', session?.user.token)

  return (
    <>
      <div className="relative z-10 mx-auto w-full py-2">
        <div className="relative z-10 mx-auto mt-3 grid w-full grid-cols-1 flex-wrap items-center justify-between gap-4 p-2 sm:grid-cols-2 md:flex-nowrap">
          {supervisoes?.map((supervisao) => (
            <div
              onClick={handleSupervisaoSelecionada}
              key={supervisao.id}
              id={supervisao.id}
              className={`flex-warp relative w-full cursor-pointer flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95`}
            >
              <div className="flex w-full items-center justify-between">
                <div className="mb-0 font-sans text-sm font-semibold uppercase leading-normal">
                  {supervisao.nome}
                </div>
                <div
                  className={`rounded-full ${supervisao.cor} p-2 drop-shadow-md`}
                >
                  <UsersFour width={24} height={24} color="#fff" />
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-semibold">
                  {supervisao.supervisor?.first_name}
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
