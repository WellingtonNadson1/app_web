"use client";
import { useData } from "@/providers/providers";
import { useParams } from "next/navigation";
import ListMembersDiscipuladoSupervisor from "../../../Components/ListMembersDiscipuladoSupervisor";

export default function ControleDiscipuladoSupervisior({
  params: { supervisorId },
}: {
  params: { supervisorId: string };
}) {
  const { data, error, isLoading } = useData();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Ocorreu um erro ao carregar os dados.</p>;
  }

  const supervisoes = data?.combinedData[0];

  const id = useParams();

  // @ts-ignore
  const supervisao = supervisoes?.filter(
    // @ts-ignore
    (supervisao) => supervisao.id === id.supervisorId,
  );

  return (
    <div className="relative w-full px-2 py-2 mx-auto">
      <div className="relative w-full mx-auto"></div>
      <div className="relative w-full px-2 mx-auto mt-3 mb-4">
        {supervisao && (
          <ListMembersDiscipuladoSupervisor
            //@ts-ignore
            supervisor={supervisao[0]?.supervisor}
          />
        )}
      </div>
    </div>
  );
}
