'use client'
import {
  FishSimple,
  Footprints,
  HandsPraying,
  UsersFour,
} from '@phosphor-icons/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function StatsCardRelatorios() {
  const { data: session } = useSession()
  // eslint-disable-next-line no-unused-vars
  const hostname = 'app-ibb.onrender.com'
  const URLRelatorioSupervision = `https://${hostname}/relatorio/presencacultos`

  const handleRelatorio = async () => {
    try {
      const response = await fetch(URLRelatorioSupervision, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
          Authorization: `Bearer ${session?.user.token}`,
        },
      })

      if (!response.ok) {
        // Lidar com erros de resposta, se necessário
        console.log('Erro na resposta da API:', response.statusText)
        return
      }

      const buffer = await response.arrayBuffer()
      const blob = new Blob([buffer], { type: 'application/pdf' })

      // Cria um objeto URL para o blob
      const url = window.URL.createObjectURL(blob)

      // Abre o PDF em uma nova aba ao invés de baixá-lo
      window.open(url)
    } catch (error) {
      console.log('Erro ao buscar o relatório:', error)
    }
  }

  const escolasIbb = [
    {
      title: 'Presença1',
      supervisor: 'Células',
      // total: '234',
      // status: 'up',
      icon: Footprints,
      color: 'bg-[#F55343]',
      // nivel: '',
    },
    {
      title: 'Presença',
      supervisor: 'Supervisões',
      // total: '334',
      // status: 'up',
      icon: FishSimple,
      color: 'bg-[#43a2f5]',
      // nivel: '',
    },
    {
      title: 'Supervisores',
      // supervisor: '',
      // total: '234',
      // status: 'up',
      icon: UsersFour,
      color: 'bg-[#e2de5f]',
      // nivel: '',
    },
    {
      title: 'Discipulados',
      supervisor: '',
      // total: '234',
      // status: 'up',
      icon: HandsPraying,
      color: 'bg-[#f58224]',
      // nivel: '',
    },
  ]
  return (
    <>
      <div className="relative z-10 mx-auto w-full py-2">
        <div className="relative z-10 mx-auto mt-3 grid w-full grid-cols-1 flex-wrap items-center justify-between gap-4 p-2 sm:grid-cols-2 md:flex-nowrap">
          {escolasIbb.map((stat) => (
            <Link key={stat.title} href="/supervisoes/celulas">
              <div
                className={`flex-warp relative w-full cursor-pointer flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="mb-0 font-sans text-sm font-semibold uppercase leading-normal">
                    {stat.title}
                  </div>
                  <div
                    className={`rounded-full ${stat.color} p-2 drop-shadow-md`}
                  >
                    <stat.icon width={24} height={24} color="#fff" />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold">
                    {stat.supervisor}
                  </span>
                </div>
                {/* <div className="flex items-center">
                  <span className="text-sm font-bold leading-normal text-emerald-500">
                    {stat?.status}
                  </span>
                  <span className="ml-2 text-sm font-bold leading-normal text-gray-500">
                    {stat?.nivel}
                  </span>
                </div> */}
              </div>
            </Link>
          ))}

          <div className="mt-2">
            <button
              type="submit"
              onClick={handleRelatorio}
              className="hover:gb-sky-500 rounded-md bg-sky-600 px-2 py-1 text-white"
            >
              Relatorio
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
