import { ISupervisaoData } from '@/app/(authenticed)/supervisoes/[supervisaoId]/page'
import { UsersFour } from '@phosphor-icons/react'
import ListCelulas from './ListCelulas'

interface ISupervisaoProps {
  supervisao?: ISupervisaoData
}

export default function StatsCardSupervision({ supervisao }: ISupervisaoProps) {
  console.log({ supervisao })
  return (
    <>
      {supervisao && (
        <div className="relative z-10 mx-auto w-full py-2">
          <div className="relative z-10 mx-auto mt-3 grid w-full grid-cols-1 flex-wrap items-center justify-between gap-4 p-2 sm:grid-cols-2 md:flex-nowrap">
            <div
              className={`flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95`}
            >
              <div className="flex w-full items-center justify-between">
                <div className="mb-0 font-sans text-sm font-semibold uppercase leading-normal">
                  {supervisao.nome}
                </div>
                <div
                  className={`rounded-full ${supervisao.cor} p-2 drop-shadow-md`}
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
