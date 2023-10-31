'use client'
import {
  Heart,
  UserGear,
  Users,
  UsersFour,
} from '@phosphor-icons/react'
import Link from 'next/link'

export default function StatsCardRelatorios() {

  const escolasIbb = [
    {
      title: 'Presenças',
      supervisor: 'Supervisões',
      icon: UsersFour,
      color: 'bg-blue-950',
    },
    {
      title: 'Presenças',
      supervisor: 'Células',
      icon: Users,
      color: 'bg-blue-950',
    },
    {
      title: 'Presenças',
      supervisor: 'Supervisores',
      icon: UserGear,
      color: 'bg-blue-950',
    },
    {
      title: 'Presenças',
      supervisor: 'Discipulados',
      icon: Heart,
      color: 'bg-blue-950',
    },
  ]
  return (
    <>
      <div className="relative z-10 w-full py-2 mx-auto">
        <div className="relative z-10 grid flex-wrap items-center justify-between w-full grid-cols-1 gap-4 p-2 mx-auto mt-3 sm:grid-cols-2 md:flex-nowrap">
          {escolasIbb.map((stat, i) => (
            <Link key={stat.title + i} href="/supervisoes/celulas">
              <div
                className={`flex-warp relative w-full cursor-pointer flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="mb-0 font-sans text-sm font-semibold leading-normal uppercase">
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
