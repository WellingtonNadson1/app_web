'use client'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { FilePdf } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import SpinnerButton from './spinners/SpinnerButton'


const ResponseSchema = z.object({
  data: z.string().array()
})

type ApiResponse = z.infer<typeof ResponseSchema>

export default function LicoesCelula() {
  const URLLicoesCelula = `${BASE_URL}/licoescelulas`
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['licoesCelula'],
    queryFn: () =>
      axiosAuth.get(URLLicoesCelula),
  })
  if (isLoading) return <SpinnerButton message={''} />
  if (isError) {
    return <div>Erro ao carregar os dados.</div>
  }

  const temaMesCelula = 'Tempo'
  const subTemaMesCelula = 'Ensina-nos a contar os nossos dias... Salmos 90.12'
  const statusLicoes = [
    {
      id: 1,
      title: 'Sacrifício Vivo',
      periodo: '07 a 13 de Jan/2024',
      status: 'pendente',
      icon: FilePdf,
      versiculo: 'Rm 12:01',
    },
    {
      id: 2,
      title: 'Sacrifício de Louvor',
      periodo: '14 a 20 de Jan/2024',
      status: 'pendente',
      icon: FilePdf,
      versiculo: 'Hb 13:15',
    },
    {
      id: 3,
      title: 'A Oferta de Abel',
      periodo: '21 a 27 de Jan/2024',
      status: 'pendente',
      icon: FilePdf,
      versiculo: 'Gn 4:3-4',
    },
    {
      id: 4,
      title: 'O que move o Coração de Deus',
      periodo: '28 de Jan a 03 de Fev/2024',
      status: 'pendente',
      icon: FilePdf,
      versiculo: 'Sl 51:17',
    },
    // {
    //   id: 5,
    //   title: 'O Cuidado de Deus',
    //   periodo: '29 de Out a 04 de Jan/2024',
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
                href={`${data.data[index]}`}
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
