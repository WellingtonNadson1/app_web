import { useSupervisaoContext } from "@/contexts/supervisao/supervisao";
import { useRouter } from "next/navigation";
import React from "react";

export interface ICelula {
  id: string;
  nome: string;
  lider: {
    id: string;
    first_name: string;
  };
}

interface ListCelulasProps {
  data: ICelula[];
}

export default function ListCelulasSupervision({ data }: ListCelulasProps) {
  const router = useRouter();
  const contextParamsSupervisaoId = useSupervisaoContext();
  const dataSort = data.sort((a, b) => a.nome.localeCompare(b.nome));

  const handleClickCelula = (event: React.MouseEvent<HTMLElement>) => {
    const idCelula = event.currentTarget.id;
    router.push(
      `/supervisoes/${contextParamsSupervisaoId}/celulas/${idCelula}`,
    );
  };
  return (
    <div>
      <div className="relative w-full p-2 mx-auto mt-1">
        <div className="relative w-full py-2 mx-auto">
          <div className="w-full p-4 bg-white rounded-lg shadow-md">
            <h2 className="px-2 py-6 text-lg font-semibold leading-7 text-gray-700">
              Lista de Células
            </h2>
            <div className="p-2">
              <table className="w-full px-2 border-separate table-auto">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-2 py-3 font-medium text-[#6D8396] text-start">
                      Ord.
                    </th>
                    <th className="px-2 py-3 font-medium text-[#6D8396] text-start">
                      Célula
                    </th>
                    <th className="hidden px-2 py-3 font-medium text-[#6D8396] text-start sm:block">
                      Líder(es)
                    </th>
                    <th className="px-2 py-3 font-medium text-[#6D8396]">
                      Detalhes
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm font-normal text-gray-700">
                  {dataSort?.map((celula, index) => (
                    <tr
                      className="py-8 border-b border-gray-200 rounded-lg hover:bg-gray-50/90"
                      key={celula.id}
                    >
                      <td className="px-2 py-1 border-b border-gray-200">
                        <h2 className="pl-2">{index + 1}</h2>
                      </td>
                      <td className="px-2 py-1 border-b border-gray-200">
                        <h2 className="pl-2">{celula.nome}</h2>
                      </td>

                      <td className="hidden px-2 py-1 text-gray-700 border-b border-gray-200 text-start sm:table-cell">
                        {celula.lider?.first_name}
                      </td>
                      <td className="px-2 py-2 mx-auto border-b border-gray-200">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={handleClickCelula}
                            id={celula.id}
                            className="px-4 py-2 mx-auto text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                          >
                            Acessar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
