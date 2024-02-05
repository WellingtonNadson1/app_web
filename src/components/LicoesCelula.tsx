'use client'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { FilePdf } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import SpinnerButton from './spinners/SpinnerButton'
import { useUserDataStore } from '@/store/UserDataStore'


const ResponseSchema = z.string().array()

type ApiResponse = z.infer<typeof ResponseSchema>

export default function LicoesCelula() {
  const URLLicoesCelula = `${BASE_URL}/licoescelulas`
  const { token } = useUserDataStore.getState().state

  const axiosAuth = useAxiosAuthToken(token)

  const LicoesCelulaData = async () => {
    const { data } = await axiosAuth.get(URLLicoesCelula)
    console.log('licoes', data)
    return data
  }
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['licoesCelula'],
    queryFn: LicoesCelulaData
  })
  if (isLoading) return <SpinnerButton message={''} />
  if (isError) {
    return <div>Atualize a página para carregar os dados.</div>
  }
  console.log('data', data)
  const temaMesCelula = 'Aviva-nos'
  const subTemaMesCelula = 'Ouvi, Senhor, a tua palavra, e temi; aviva, ó Senhor, a tua obra no meio dos anos, no meio dos anos faze-a conhecida; na tua ira lembra-te da misericórdia. Hc 3.2'

  const statusLicoes = [
    {
      id: 1,
      title: 'O que é avivamento',
      periodo: '04 a 10 de Fev/2024',
      status: 'pendente',
      icon: FilePdf,
      versiculo: 'Tg 4: 8-10',
    },
    {
      id: 2,
      title: 'Jejum vs Despertar Espiritual',
      periodo: '11 a 17 de Fev/2024',
      status: 'pendente',
      icon: FilePdf,
      versiculo: 'Jl 2:12',
    },
    {
      id: 3,
      title: 'Avivamento vs Palavra de Deus',
      periodo: '18 a 24 de Fev/2024',
      status: 'pendente',
      icon: FilePdf,
      versiculo: 'Ne 8:1-3',
    },
    {
      id: 4,
      title: 'Tempo de Arrempendimento',
      periodo: '25 de Fev a 02 de Mar/2024',
      status: 'pendente',
      icon: FilePdf,
      versiculo: 'Jn 3:1-10',
    },
    // {
    //   id: 5,
    //   title: 'O Cuidado de Deus',
    //   periodo: '29 de Out a 04 de Fev/2024',
    //   status: 'pendente',
    //   icon: FilePdf,
    //   versiculo: 'Ez 34:11-12',
    // },
  ]

  return (
    <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
      <div className="relative flex-col w-full p-4 bg-white rounded-lg shadow-md flex-warp hover:bg-white/95">
        <div className="flex flex-col items-start justify-start mb-3">
          <h1 className="mb-3 text-lg font-semibold leading-7">Lições</h1>
          <div className='flex flex-col items-start justify-start px-3 py-2 mb-3 rounded-md bg-gray-50'>
            <span className='mb-1 text-base'>
              <span className="font-semibold">Tema: </span>{temaMesCelula}
            </span>
            <span className="mb-3 text-base italic">{subTemaMesCelula}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 px-2 py-1 mb-3 sm:grid-cols-2">
          {statusLicoes.map((stat, index) => (
            data ? (
              <a
                href={`${data?.[index]}`}
                target="_blank"
                key={stat.id}
                className="rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100/80"
              >
                <div className="p-2 sm:col-span-1">
                  <div className="flex items-center justify-between w-full gap-4">
                    <div>
                      <div className="mb-0 font-sans text-base font-semibold leading-normal text-gray-900 uppercase">
                        {stat.id}ª - {stat.title}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-normal leading-6 text-gray-700">
                            {stat.versiculo}
                          </span>
                        </div>
                        <div className="flex items-center mt-3">
                          {stat.status === 'pendente' ? (
                            <span className="text-sm font-normal leading-6 text-red-500">
                              {stat.status}
                            </span>
                          ) : (
                            <span className="text-sm font-normal leading-6 text-emerald-500">
                              {stat.status}
                            </span>
                          )}

                          <span className="ml-2 text-sm leading-6 text-gray-500">
                            {stat.periodo}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Imagem PDF */}
                    <div
                      className={`h-[4.5rem] rounded-md bg-gray-900 p-2 drop-shadow-md`}
                    >
                      <stat.icon width={24} height={24} color="#fff" />
                    </div>
                  </div>
                </div>
              </a>

            ) : (
              // Handle the case where data or data[index] is not valid
              <div key={stat.id}>Invalid Data</div>
            )))}
        </div>
      </div>
    </div>
  )
}
