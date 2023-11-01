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
  const {data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['licoesCelula'],
    queryFn: () =>
    axiosAuth.get(URLLicoesCelula),
  })
  if(isLoading) return <SpinnerButton message={''}/>
  if (isError) {
    return <div>Erro ao carregar os dados.</div>
  }

  const temaMesCelula = 'Cuidar'
  const statusLicoes = [
    {
      id: 1,
      title: 'Cuidar de si Mesmo',
      periodo: '01 a 07 de Out/2023',
      status: 'ok',
      icon: FilePdf,
      versiculo: '1Te 5:23',
    },
    {
      id: 2,
      title: 'Cuidar da Doutrina',
      periodo: '08 a 14 de Out/2023',
      status: 'ok',
      icon: FilePdf,
      versiculo: 'Sl 119:11',
    },
    {
      id: 3,
      title: 'Cuidado com a Família',
      periodo: '15 a 21 de Out/2023',
      status: 'ok',
      icon: FilePdf,
      versiculo: '1Tm 5:8',
    },
    {
      id: 4,
      title: 'Cuidar da casa do SENHOR',
      periodo: '22 a 28 de Out/2023',
      status: 'pendente',
      icon: FilePdf,
      versiculo: 'Sl 69:9',
    },
    {
      id: 5,
      title: 'O Cuidado de Deus',
      periodo: '29 de Out a 04 de Nov/2023',
      status: 'pendente',
      icon: FilePdf,
      versiculo: 'Ez 34:11-12',
    },
  ]

  return (
    <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
      <div className="relative flex-col w-full p-4 bg-white rounded-lg shadow-md flex-warp hover:bg-white/95">
        <div className="flex flex-col items-start justify-start mb-3">
          <h1 className="mb-3 text-lg font-semibold leading-7">Lições</h1>
          <span className="mb-3 text-base">Tema: {temaMesCelula}</span>
        </div>
        <div className="grid grid-cols-1 gap-4 px-2 py-1 mb-3 sm:grid-cols-2">
          {statusLicoes.map((stat, index) => (
            data ?  (
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
