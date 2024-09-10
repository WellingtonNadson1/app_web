"use client";
import { BASE_URL } from "@/functions/functions";
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken";
import { cn } from "@/lib/utils";
import { useUserDataStore } from "@/store/UserDataStore";
import { FilePdf } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { z } from "zod";
import SpinnerButton from "./spinners/SpinnerButton";
import { Card } from "./ui/card";
dayjs().locale();

const ResponseSchema = z.string().array();

type ApiResponse = z.infer<typeof ResponseSchema>;

export default function LicoesCelula() {
  const URLLicoesCelula = `${BASE_URL}/licoescelulas`;
  const { token } = useUserDataStore.getState();

  const axiosAuth = useAxiosAuthToken(token);

  const LicoesCelulaData = async () => {
    const { data } = await axiosAuth.get(URLLicoesCelula);
    return data;
  };
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["licoesCelula"],
    queryFn: LicoesCelulaData,
  });
  if (isLoading) return <SpinnerButton message={""} />;
  if (isError) {
    return <div>Atualize a página para carregar os dados.</div>;
  }

  // Pegamos o mês e ano atual
  const month = dayjs().month();
  // const year = dayjs().year();
  const toDay = dayjs();

  // Definimos a primeira data do mês
  let startDate = dayjs().set("month", month).set("date", 1);

  // Criamos um array para armazenar as semanas
  const weeks: { start: dayjs.Dayjs; end: dayjs.Dayjs }[] = [];
  const weeksDate: { start: string; end: string }[] = [];

  // Loop para iterar pelas semanas do mês
  while (startDate.month() === month) {
    // Pegamos o dia da semana da data atual (0 = domingo, 6 = sábado)
    // const dayOfWeek = startDate.day();

    // Ajustamos a data para o início da semana (domingo)
    const weekStart = startDate.startOf("week");

    // Ajustamos a data para o fim da semana (sábado)
    const weekEnd = weekStart.add(6, "day");

    // Ajustamos a data de início e fim da semana para garantir que estejam dentro do mês atual
    const validWeekStart = weekStart.month() === month ? weekStart : startDate;
    const validWeekEnd =
      weekEnd.month() === month ? weekEnd : startDate.endOf("month");

    // Ajustamos a data para o início da semana (domingo) caso o mes inicie no domingo
    // const weekStart = startDate.subtract(dayOfWeek, "day");

    // Ajustamos a data para o início da semana (segunda-feira, no caso de 1 de julho de 2024)
    // const weekStart = startDate.subtract(
    //   dayOfWeek === 0 ? 6 : dayOfWeek - 1,
    //   "day",
    // );

    // Adicionamos a semana ao array
    // weeks.push({
    //   start: weekStart,
    //   end: weekEnd,
    // });

    // Adicionamos a semana ao array
    weeks.push({
      start: validWeekStart,
      end: validWeekEnd,
    });

    // weeksDate.push({
    //   start: weekStart.format("DD/MM"),
    //   end: weekEnd.format("DD/MM"),
    // });
    //
    weeksDate.push({
      start: validWeekStart.format("DD/MM"),
      end: validWeekEnd.format("DD/MM"),
    });

    // Incrementamos a data para o início da próxima semana
    startDate = weekEnd.add(1, "day");
  }

  const temaMesCelula = "Visão";
  const subTemaMesCelula =
    "Ganhar - Consolidar - Discipular - Enviar";

  const statusLicoes = [
    {
      id: 1,
      title: "CHAMADOS PARA CUIDAR",
      periodo: weeks,
      icon: FilePdf,
      versiculo: "I Co 12:25",
    },
    {
      id: 2,
      title: "A IMPORTÂNCIA DO TREINAMENTO",
      periodo: weeks,
      icon: FilePdf,
      versiculo: "At 18:18",
    },
    {
      id: 3,
      title: "PESCADORES DE HOMENS",
      periodo: weeks,
      icon: FilePdf,
      versiculo: "Mc 1:17-18",
    },
    {
      id: 4,
      title: "QUAL A SUA VISÃO?",
      periodo: weeks,
      icon: FilePdf,
      versiculo: "II Co 4:18",
      lancando: true,
    },
    // {
    //   id: 5,
    //   title: "Jesus serviu a humanidade com sua vida",
    //   periodo: weeks,
    //   icon: FilePdf,
    //   versiculo: "Mc 10:45",
    // },
  ];

  return (
    <Card className="bg-white relative w-full px-2 mx-auto mb-4">
      <div className="relative z-10 flex flex-wrap items-center justify-between w-full mx-auto md:flex-nowrap">
        <div className="relative flex-col w-full p-4 bg-white rounded-lg flex-warp hover:bg-white/95">
          <div className="flex flex-col items-start justify-start mb-3">
            <h1 className="p-2 mb-3 text-lg font-semibold leading-7">Lições</h1>
            <div className="flex flex-col items-start justify-start px-3 py-2 mb-3 rounded-md bg-gray-50">
              <span className="mb-1 text-base">
                <span className="font-semibold">Tema: </span>
                {temaMesCelula}
              </span>
              <span className="mb-3 text-base italic">{subTemaMesCelula}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 px-2 py-1 mb-3 sm:grid-cols-2">
            {statusLicoes.map((stat, index) =>
              data ? (
                <a
                  href={`${data?.[index]}`}
                  target="_blank"
                  key={stat.id}
                  className={cn(
                    "rounded-md p-1 cursor-pointer bg-gray-50 hover:bg-gray-100/80",
                    stat.lancando && "bg-blue-50 hover:bg-blue-100/75",
                  )} rel="noreferrer"
                >
                  <div className="p-2 sm:col-span-1">
                    <div className="flex items-center justify-between w-full gap-4">
                      <div>
                        <div className="mb-0 font-sans text-base font-semibold leading-normal text-gray-900 uppercase">
                          {stat.id}ª - {stat.title}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-normal leading-6 text-gray-700">
                              {stat.versiculo}
                            </span>
                          </div>
                          <div className="mt-2 text-sm">
                            Período:
                            <span className="ml-2 text-sm leading-6 text-gray-500">
                              {/*adiciono ou subtraio um dia para regular os dias */}
                              {/* {weeksDate[index + 1]?.start} à */}
                              {weeksDate[index]?.start} à
                            </span>
                            <span className="ml-1 text-sm leading-6 text-gray-500">
                              {weeksDate[index]?.end}
                            </span>
                          </div>
                          <div className="flex items-center mt-3">
                            {stat.periodo[index]?.end.isAfter(toDay) ? (
                              <span className="text-sm font-normal leading-6 text-red-500">
                                pendente
                              </span>
                            ) : (
                              <span className="text-sm font-normal leading-6 text-emerald-500">
                                ministrada
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Imagem PDF */}
                      <div
                        className={`h-[4.5rem] rounded-md bg-gray-900 p-2 drop-shadow-md`}
                      >
                        <stat.icon width={24} height={24} color="#fff" />
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                // Handle the case where data or data[index] is not valid
                <div key={stat.id}>Invalid Data</div>
              ),
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
