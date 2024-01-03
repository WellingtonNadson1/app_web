import { ISupervisaoData } from '@/app/(authenticed)/supervisoes/[supervisaoId]/page'
import { UsersFour } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

interface ISupervisaoProps {
  supervisao?: ISupervisaoData
}

export default function StatsCardSupervision({ supervisao }: ISupervisaoProps) {
  return (
    <>
      {supervisao && (
        <div className="relative z-10 w-full py-2 mx-auto">
          <div className="relative z-10 grid flex-wrap items-center justify-between w-full grid-cols-1 gap-4 p-2 mx-auto mt-3 sm:grid-cols-2 md:flex-nowrap">
            <div
              className={`flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="mb-0 font-sans text-sm font-semibold leading-normal uppercase">
                  {supervisao.nome}
                </div>
                <div
                  className={twMerge(`rounded-full p-2 drop-shadow-md`, `bg-${supervisao.cor}`)}
                >
                  <UsersFour width={24} height={24} color="#fff" />
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-semibold">
                  {supervisao?.supervisor?.first_name}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold leading-normal text-emerald-500">
                  {supervisao.nivel}
                </span>
                <span className="ml-2 text-sm font-bold leading-normal text-gray-500">
                  {supervisao.nivel}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
