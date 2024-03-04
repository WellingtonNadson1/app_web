'use client'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { FilePdf } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import SpinnerButton from './spinners/SpinnerButton'
import { useUserDataStore } from '@/store/UserDataStore'
import dayjs from 'dayjs'
dayjs().locale()


const ResponseSchema = z.string().array()

type ApiResponse = z.infer<typeof ResponseSchema>

export default function LicoesCelula() {
  const URLLicoesCelula = `${BASE_URL}/licoescelulas`
  const { token } = useUserDataStore.getState()

  const axiosAuth = useAxiosAuthToken(token)

  const LicoesCelulaData = async () => {
    const { data } = await axiosAuth.get(URLLicoesCelula)
    return data
  }
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['licoesCelula'],
    queryFn: LicoesCelulaData,
  })
  if (isLoading) return <SpinnerButton message={''} />
  if (isError) {
    return <div>Atualize a página para carregar os dados.</div>
  }

  // Pegamos o mês e ano atual
  const month = dayjs().month();
  const year = dayjs().year();
  const toDay = dayjs()

  // Definimos a primeira data do mês
  let startDate = dayjs().set('month', month).set('date', 1);

  // Criamos um array para armazenar as semanas
  const weeks: { start: dayjs.Dayjs; end: dayjs.Dayjs }[] = [];
  const weeksDate: { start: string; end: string }[] = [];

  // Loop para iterar pelas semanas do mês
  while (startDate.month() === month) {
    // Pegamos o dia da semana da data atual (0 = domingo, 6 = sábado)
    const dayOfWeek = startDate.day();

    // Ajustamos a data para o início da semana (domingo)
    const weekStart = startDate.subtract(dayOfWeek, 'day');

    // Ajustamos a data para o fim da semana (sábado)
    const weekEnd = weekStart.add(6, 'day');

    // Adicionamos a semana ao array
    weeks.push({
      start: weekStart,
      end: weekEnd,
    });

    weeksDate.push({
      start: weekStart.format('DD/MM'),
      end: weekEnd.format('DD/MM'),
    });

    // Incrementamos a data para o início da próxima semana
    startDate = weekEnd.add(1, 'day');
  }

  console.log('weeks', weeks[0].end.isBefore(toDay))

  const temaMesCelula = 'Espírito Santo'
  const subTemaMesCelula = 'O mundo não pode receber esse Espírito porque não o pode ver, nem conhecer. Mas vocês o conhecem porque ele está com vocês e viverá em vocês. Jo 14:17'

  const statusLicoes = [
    {
      id: 1,
      title: 'Quem é o Espírito Santo?',
      periodo: weeks,
      status: 'ok',
      icon: FilePdf,
      versiculo: 'Ez 36:27',
    },
    {
      id: 2,
      title: 'Uma questão de Governo',
      periodo: weeks,
      status: 'ok',
      icon: FilePdf,
      versiculo: 'Gl 5:16-17',
    },
    {
      id: 3,
      title: 'A poderosa ação do Espírito Santo',
      periodo: weeks,
      status: 'pendente',
      icon: FilePdf,
      versiculo: '1Co 2:11',
    },
    {
      id: 4,
      title: 'Como receber o Espírito Santo?',
      periodo: weeks,
      status: 'pendente',
      icon: FilePdf,
      versiculo: 'Jo 14:15-17',
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
          <h1 className="p-2 mb-3 text-lg font-semibold leading-7">Lições</h1>
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
                        <div className='mt-2 text-sm'>
                          Período:
                          <span className="ml-2 text-sm leading-6 text-gray-500">
                            {weeksDate[index + 1]?.start} à
                          </span>
                          <span className="ml-1 text-sm leading-6 text-gray-500">
                            {weeksDate[index + 1]?.end}
                          </span>
                        </div>
                        <div className="flex items-center mt-3">
                          {stat.periodo[index + 1]?.end.isAfter(toDay) ? (
                            <span className="text-sm font-normal leading-6 text-red-500">
                              pendente
                            </span>
                          ) : (
                            <span className="text-sm font-normal leading-6 text-emerald-500">
                              ok
                            </span>
                          )}
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
