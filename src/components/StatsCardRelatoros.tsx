'use client'
import {
  FishSimple,
  Footprints,
  HandsPraying,
  UsersFour,
} from '@phosphor-icons/react'
import Link from 'next/link'

export default function StatsCardRelatorios() {
  const escolasIbb = [
    {
      title: 'Presença',
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
        </div>
      </div>
    </>
  )
}
