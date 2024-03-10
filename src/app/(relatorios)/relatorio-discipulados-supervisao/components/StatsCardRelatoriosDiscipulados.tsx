'use client'
import { cn } from '@/lib/utils'
import {
  HandHeart,
} from '@phosphor-icons/react'
import Link from 'next/link'

export default function StatsCardRelatoriosDiscipulados() {

  const escolasIbb = [
    {
      title: 'Discipulados de Células',
      supervisor: 'Supervisões',
      icon: HandHeart,
      color: 'bg-black',
      href: "/relatorio-discipulados-supervisao"
    },
    {
      title: 'Discipulados',
      supervisor: 'Supervisores',
      icon: HandHeart,
      color: 'bg-indigo-800',
      href: "/relatorio-discipulados/f425-4865-supervisores"
    },
    // {
    //   title: 'Presença nas Reuniões',
    //   supervisor: 'Células',
    //   icon: Users,
    //   color: 'bg-sky-800',
    //   href: "/relatorio-culto-supervisao/5e392d1b-f425-4865-a730-5191bc0821cd"
    // },
    // {
    //   title: 'Registro',
    //   supervisor: 'Discipulados Realizados',
    //   icon: HandHeart,
    //   color: 'bg-sky-800',
    //   href: "/relatorio-discipulados/f425-4865-a730-5191bc0821cd"
    // },
  ]
  return (
    <div className="relative z-10 w-full py-2 mx-auto">
      <div className="relative z-10 grid flex-wrap items-center justify-between w-full grid-cols-1 gap-4 p-2 mx-auto mt-3 sm:grid-cols-2 md:flex-nowrap">
        {escolasIbb.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <div
              className={`flex-warp relative w-full cursor-pointer flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="mb-0 font-sans text-sm font-semibold leading-normal uppercase">
                  {stat.title}
                </div>
                <div
                  className={cn(`rounded-full p-2 drop-shadow-md`, `${stat.color}`)}
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
  )
}
