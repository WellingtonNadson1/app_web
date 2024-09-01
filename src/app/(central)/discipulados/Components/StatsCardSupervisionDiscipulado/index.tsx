// 'use client'
import { useSupervisaoContext } from "@/contexts/supervisao/supervisao";
import { UsersFour } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { SupervisaoDataType } from "./schema";

export default function StatsCardSupervisionDiscipulado({
  idSupervisao,
  cor,
  nome,
  supervisor,
}: SupervisaoDataType) {
  const router = useRouter();
  const contextParamsSupervisaoId = useSupervisaoContext();
  console.log("idSupervisao", idSupervisao);

  const handleClickDiscipuladoSUpervisor = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    const idSupervisao = event.currentTarget.id;
    router.push(
      `/discipulados/${contextParamsSupervisaoId}/supervisor/${idSupervisao}`,
    );
  };
  return (
    <>
      <div className="relative z-10 w-full py-2 mx-auto">
        <div className="relative z-10 grid flex-wrap items-center justify-between w-full grid-cols-1 gap-4 p-2 mx-auto mt-3 sm:grid-cols-2 md:flex-nowrap">
          <div
            className={`flex-warp relative w-full flex-col rounded-lg bg-white p-4 shadow-md hover:bg-white/95`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="mb-0 font-sans text-sm font-semibold leading-normal uppercase">
                {nome}
              </div>
              <div
                className={twMerge(
                  `rounded-full p-2 drop-shadow-md`,
                  `bg-${cor}`,
                )}
              >
                <UsersFour width={24} height={24} color="#fff" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-semibold">
                {supervisor?.first_name}
              </span>
            </div>
            <div className="flex items-center gap-2 py-2">
              <span className="text-sm font-bold leading-normal text-emerald-500">
                Discipulados
              </span>
              <button
                onClick={handleClickDiscipuladoSUpervisor}
                id={idSupervisao}
                className="px-4 py-2 text-sm font-medium text-white transition-all bg-green-500 rounded-md cursor-pointer hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
