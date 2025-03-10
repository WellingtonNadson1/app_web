'use client'
import { cn } from '@/lib/utils'
import { FilePdf } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import LicoesCelulaSkeleton from './Skeleton-Licoes-Celula'
import { Card } from './ui/card'
import { useSession } from 'next-auth/react'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import axios from 'axios'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale(ptBr)

interface TemaData {
  id: string
  status: boolean
  tema: string
  versiculo_chave: string
  data_inicio: string | Date
  data_termino: string | Date
}

interface LessonData {
  id: string
  status: boolean
  titulo: string
  versiculo_chave: string
  licao_lancando_redes: boolean
  data_inicio: string | Date
  data_termino: string | Date
  link_objeto_aws?: string
}


export default function LicoesCelula() {
  const [id, setIdTema] = useState<string | null>(null) // Use null as initial value
  const URLLicoesCelula = `/api/licoes-celula/${id}`
  const URLTemaMonth = `/api/licoes-celula/tema-of-month`
  const { data: session, status } = useSession()
  const axiosAuth = useAxiosAuth(session?.user?.token as string)

  const GetIdTema = async () => {
    const { data } = await axiosAuth.get(URLTemaMonth)
    return data
  }

  const getLicoesCelula = async () => {
    const { data } = await axiosAuth.get(URLLicoesCelula, {
      params: { id },
    })
    console.log('data lesson get: ', data)
    return data
  }

  const { data: dataTema } = useQuery<TemaData[]>({
    queryKey: ['idTemaMonth'],
    queryFn: GetIdTema,
    enabled: status === 'authenticated',
  })

  // useEffect to update idTema when query is successful
  useEffect(() => {
    if (dataTema && !id) {
      setIdTema(dataTema[0]?.id || null) // Ensure there's a valid id
    }
  }, [dataTema, id])

  const { data: licoesCelula, isLoading, error } = useQuery<LessonData[]>({
    queryKey: ['licoesCelulasIbb', id],
    queryFn: getLicoesCelula,
    enabled: status === 'authenticated' && !!id,
    refetchOnWindowFocus: true,
  })

  if (error) {
    console.error('Erro ao buscar lições:', error);
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Dados do erro:', error.response?.data);
      }
  }

  if (status === 'loading') {
    return <div>Carregando sessão...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Usuário não autenticado. Faça login.</div>;
  }

  const licoesCelulaOrdenadas = licoesCelula?.sort((a, b) => {
    return dayjs(a.data_inicio).valueOf() - dayjs(b.data_inicio).valueOf()
  })

  return (
    <>
      {isLoading ?
        <div className="w-full mx-auto mb-4">
          <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
            <LicoesCelulaSkeleton />
          </div>
        </div>
        : dataTema?.length === 0 ?
          <Card className="bg-white relative w-full px-2 mx-auto mb-4">
            <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
              <div className="relative flex-col w-full p-4 bg-white rounded-lg flex-warp hover:bg-white/95">
                <div className="flex flex-col items-start justify-start mb-3">
                  <h1 className="p-2 mb-3 text-lg font-semibold leading-7">Lições</h1>
                  <div className="flex flex-col items-start justify-start px-3 py-2 mb-3 rounded-md bg-gray-50">
                    <span className="text-base">
                      <span className="font-semibold">Sem Lições para o Mês! </span>

                    </span>
                    <span className="mb-3 text-base italic">
                      {dataTema && dataTema[0]?.versiculo_chave}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          :
          <Card className="bg-white relative w-full px-2 mx-auto mb-4">
            <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
              <div className="relative flex-col w-full p-4 bg-white rounded-lg flex-warp hover:bg-white/95">
                <div className="flex flex-col items-start justify-start mb-3">
                  <h1 className="p-2 mb-3 text-lg font-semibold leading-7">Lições</h1>
                  <div className="flex flex-col items-start justify-start px-3 py-2 mb-3 rounded-md bg-gray-50">
                    <span className="mb-1 text-base">
                      <span className="font-semibold">Tema: </span>
                      {dataTema && dataTema[0]?.tema}
                    </span>
                    <span className="mb-3 text-base italic">
                      {dataTema && dataTema[0]?.versiculo_chave}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 px-2 py-1 mb-3 sm:grid-cols-2">
                  {licoesCelulaOrdenadas?.map((stat, index) => {
                    const toDay = dayjs().tz('America/Sao_Paulo')
                    const licaoMinistrada = dayjs(stat.data_termino).isAfter(toDay)

                    return (
                      <Link
                        href={`${stat.link_objeto_aws}`}
                        target="_blank"
                        key={stat.id}
                        className={cn(
                          'rounded-md p-1 cursor-pointer bg-gray-50 hover:bg-gray-100/80',
                          stat.licao_lancando_redes &&
                          'bg-blue-50 hover:bg-blue-100/75',
                        )}
                        rel="noreferrer"
                      >
                        <div className="p-2 sm:col-span-1">
                          <div className="flex items-center justify-between w-full gap-4">
                            <div>
                              <div className="mb-0 font-sans text-base font-semibold leading-normal text-gray-900 uppercase">
                                {index + 1}ª - {stat.titulo}
                              </div>
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-normal leading-6 text-gray-700">
                                    {stat.versiculo_chave}
                                  </span>
                                </div>
                                <div className="mt-2 text-sm">
                                  Período:
                                  <span className="ml-2 text-sm leading-6 text-gray-500">
                                    {dayjs(stat.data_inicio).format('DD/MM')} à
                                  </span>
                                  <span className="ml-1 text-sm leading-6 text-gray-500">
                                    {dayjs(stat.data_termino).format('DD/MM')}
                                  </span>
                                </div>
                                <div className="flex items-center mt-3">
                                  {licaoMinistrada ? (
                                    <span className="text-sm font-normal leading-6 text-red-500">
                                      pendente
                                    </span>
                                  ) : (
                                    <span className="text-sm font-normal leading-6 text-emerald-500">
                                      ministrada
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Imagem PDF */}
                            <div
                              className={`h-[4.5rem] rounded-md bg-gray-900 p-2 drop-shadow-md`}
                            >
                              <FilePdf width={24} height={24} color="#fff" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>
      }
    </>
  )
}
