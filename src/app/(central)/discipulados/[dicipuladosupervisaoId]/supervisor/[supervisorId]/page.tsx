"use client";
import { useParams } from "next/navigation";
import ListMembersDiscipuladoSupervisor from "../../../Components/ListMembersDiscipuladoSupervisor";
import { useData } from "@/providers/providers";

export default function ControleDiscipuladoSupervisior({
  params: { supervisorId },
}: {
  params: { supervisorId: string };
}) {
  // @ts-ignore
  const { data, error, isLoading } = useData();
  const supervisoes = data?.combinedData[0];

  const id = useParams();

  const supervisao = supervisoes?.filter(
    // @ts-ignore
    (supervisao) => supervisao.id === id.supervisorId,
  );

  return (
    <div className="relative w-full px-2 py-2 mx-auto">
      <div className="relative w-full mx-auto"></div>
      <div className="relative w-full px-2 mx-auto mt-3 mb-4">
        {/* {isSuccess && */}
        <ListMembersDiscipuladoSupervisor
          supervisor={supervisao[0]?.supervisor}
        />
        {/* } */}
      </div>
    </div>
  );
}
