"use client";
import { ICelula } from "@/components/ListCelulas";
import ListCelulasSupervision from "@/components/ListCelulasSupervision";
import StatsCardSupervision from "@/components/StatsCardSupervision";
import { useData } from "@/providers/providers";

interface IUser {
  id: string;
  first_name: string;
}

interface ISupervisor {
  id: string;
  first_name: string;
}

export interface ISupervisaoData {
  id: string;
  nome: string;
  cor: string;
  supervisor: ISupervisor;
  nivel: string;
  User: IUser[];
  celulas: ICelula[];
}

export default function Supervisao({
  params: { supervisaoId },
}: {
  params: { supervisaoId: string };
}) {
  // @ts-ignore
  const { data: dataAllCtx } = useData();
  const supervisoes = dataAllCtx?.combinedData[0];
  //@ts-ignore
  const supervisao = supervisoes?.filter(
    // @ts-ignore
    (supervisao) => supervisao.id === supervisaoId,
  );

  return (
    <div className="w-full px-2 py-2 mx-auto">
      <div className="w-full mx-auto"></div>
      <StatsCardSupervision
        nome={supervisao[0].nome}
        cor={supervisao[0].cor}
        supervisor={supervisao[0].supervisor}
      />
      {supervisao && <ListCelulasSupervision data={supervisao[0].celulas} />}
    </div>
  );
}
