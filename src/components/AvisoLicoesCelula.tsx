'use client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import SpinnerButton from './spinners/SpinnerButton'
import { BASE_URL } from '@/lib/axios'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'

const ResponseSchema = z.object({
  data: z.string().array(),
})

type ApiResponse = z.infer<typeof ResponseSchema>

export default function AvisoLicoesCelula() {
  const URLLicoesCelula = `${BASE_URL}/licoescelulas`
  const { data: session } = useSession()
  const token = session?.user?.token as string
  const axiosAuth = useAxiosAuth(token)
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['licoesCelula'],
    queryFn: () => axiosAuth.get(URLLicoesCelula),
  })
  if (isLoading) return <SpinnerButton message={''} />
  if (isError) {
    return <div>Erro ao carregar os dados.</div>
  }

  const temaMesCelula = 'Neste mês Não Haverá Lições de Célula'
  const subTemaMesCelula = `As células serão focadas em buscar as ovelhas pedidas. Seguem as Programações Semanais`
  const statusLicoes = [
    {
      id: 1,
      title: 'Célula (Levar Afastados)',
      periodo: '01 a 06 de Abr/2024',
      status: 'pendente',
      // icon: FilePdf,
      // versiculo: 'Sl 90:12',
    },
    {
      id: 2,
      title: 'Célula (Levar Afastados)',
      periodo: '08 a 13 de Abr/2024',
      status: 'pendente',
      // icon: FilePdf,
      // versiculo: 'Is 64:04',
    },
    {
      id: 3,
      title: 'Setor ou Área (Levar Afastados)',
      periodo: '15 a 20 de Abr/2024',
      status: 'pendente',
      // icon: FilePdf,
      // versiculo: 'Fp 3:13-14',
    },
    {
      id: 4,
      title: 'Toda Supervisão (Levar Afastados)',
      periodo: '22 a 27 de Abr/2024',
      status: 'pendente',
      // icon: FilePdf,
      // versiculo: 'Hb 9:27',
    },
    // {
    //   id: 5,
    //   title: 'O Cuidado de Deus',
    //   periodo: '29 de Out a 04 de Nov/2023',
    //   status: 'ok',
    //   icon: FilePdf,
    //   versiculo: 'Ez 34:11-12',
    // },
  ]

  return (
    <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
      <div className="relative flex-col w-full p-4 bg-white rounded-lg shadow-md flex-warp hover:bg-white/95">
        <div className="flex flex-col items-start justify-start mb-3">
          <h1 className="mb-3 text-lg font-semibold leading-7">Lições</h1>
          <div className="flex flex-col items-start justify-start px-3 py-2 mb-3 rounded-md bg-gray-50">
            <span className="mb-1 text-base">
              <span className="font-semibold">Aviso: </span>
              {temaMesCelula}
            </span>
            <span className="mb-3 text-base italic">{subTemaMesCelula}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 px-2 py-1 mb-3 sm:grid-cols-2">
          {statusLicoes.map((stat, index) =>
            data ? (
              //   <a
              //   href={`${data.data[index]}`}
              //   target="_blank"
              //   key={stat.id}
              //   className="rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100/80"
              // >
              <div key={stat.id} className="p-2 sm:col-span-1">
                <div className="flex items-center justify-between w-full gap-4">
                  <div>
                    <div className="mb-0 font-sans text-base font-semibold leading-normal text-gray-900 uppercase">
                      {stat.id}ª - {stat.title}
                    </div>
                    <div>
                      {/* <div className="flex items-center gap-3">
                        <span className="text-sm font-normal leading-6 text-gray-700">
                        {stat.versiculo}
                        </span>
                      </div> */}
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
                  {/* <div
                    className={`h-[4.5rem] rounded-md bg-gray-900 p-2 drop-shadow-md`}
                  >
                    <stat.icon width={24} height={24} color="#fff" />
                  </div> */}
                </div>
              </div>
            ) : (
              // Handle the case where data or data[index] is not valid
              <div key={stat.id}>Invalid Data</div>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
