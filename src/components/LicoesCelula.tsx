"use client";
import { cn } from "@/lib/utils";
import { useUserDataStore } from "@/store/UserDataStore";
import { FilePdf } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Card } from "./ui/card";
dayjs().locale();

const ResponseSchema = z.string().array();

type ApiResponse = z.infer<typeof ResponseSchema>;

interface TemaData {
  id: string;
  status: boolean;
  tema: string,
  versiculo_chave: string;
  data_inicio: string | Date;
  data_termino: string | Date;
}

interface LessonData {
  id: string;
  status: boolean;
  titulo: string,
  versiculo_chave: string;
  licao_lancando_redes: boolean;
  data_inicio: string | Date;
  data_termino: string | Date;
  link_objeto_aws?: string;
}

export default function LicoesCelula() {
  const URLLicoesCelula = `/api/licoes-celula/create-lesson-celula`;
  const URLTemaMonth = `/api/licoes-celula/tema-of-month`;
  const [id, setIdTema] = useState<string | null>(null); // Use null as initial value

  const { token } = useUserDataStore.getState();

  const GetIdTema = async () => {
    const { data } = await axios.get(URLTemaMonth);
    return data;
  };

  const getLicoesCelula = async () => {
    const { data } = await axios.get(URLLicoesCelula, {
      params: { id },
    });
    console.log('data lesson get: ', data)
    return data;
  };

  const { data: dataTema } = useQuery<TemaData[]>({
    queryKey: ["idTemaMonth"],
    queryFn: GetIdTema,
  });

  // useEffect to update idTema when query is successful
  useEffect(() => {
    if (dataTema && !id) {
      setIdTema(dataTema[0]?.id || ""); // Ensure there's a valid id
      console.log("Updated idTema: ", dataTema[0]?.id);
    }
  }, [dataTema, id]);

  const {
    data: licoesCelula,
    error,
  } = useQuery<LessonData[]>({
    queryKey: ["licoesCelulasIbb", id],
    queryFn: getLicoesCelula,
    enabled: !!id
  });

  if (licoesCelula) {
    console.log('licoesCelula test', licoesCelula)
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

  const temaMesCelula = "Tome a sua Cruz e Siga-Me";
  const subTemaMesCelula =
    "Se alguém quer ser um dos meus seguidores, negue-se a si mesmo, tome a sua cruz e siga-me (Mt 16:24)";

  const statusLicoes = [
    {
      id: 1,
      title: "O PREÇO DA CRUCIFICAÇÃO",
      periodo: weeks,
      icon: FilePdf,
      versiculo: "Gl 3:13",
    },
    {
      id: 2,
      title: "MANTENDO OS OLHOS EM JESUS",
      periodo: weeks,
      icon: FilePdf,
      versiculo: "Hb 12:2",
    },
    {
      id: 3,
      title: "TOMAR A CRUZ",
      periodo: weeks,
      icon: FilePdf,
      versiculo: "Mc 16:24-25",
    },
    {
      id: 4,
      title: "CRUCIFICAR A CARNE",
      periodo: weeks,
      icon: FilePdf,
      versiculo: "Gn 4:7",
    },
    {
      id: 5,
      title: "POR ELE FOMOS CURADOS",
      periodo: weeks,
      icon: FilePdf,
      versiculo: "Is 53:4-5",
      lancando: true,
    },
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
                {dataTema && dataTema[0]?.tema}
              </span>
              <span className="mb-3 text-base italic">{dataTema && dataTema[0]?.versiculo_chave}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 px-2 py-1 mb-3 sm:grid-cols-2">
            {licoesCelula?.map((stat, index) =>
              dataTema ? (
                <a
                  href={`${stat.link_objeto_aws}`}
                  target="_blank"
                  key={stat.id}
                  className={cn(
                    "rounded-md p-1 cursor-pointer bg-gray-50 hover:bg-gray-100/80",
                    stat.licao_lancando_redes && "bg-blue-50 hover:bg-blue-100/75",
                  )} rel="noreferrer"
                >
                  <div className="p-2 sm:col-span-1">
                    <div className="flex items-center justify-between w-full gap-4">
                      <div>
                        <div className="mb-0 font-sans text-base font-semibold leading-normal text-gray-900 uppercase">
                          {stat.titulo}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-normal leading-6 text-gray-700">
                              {stat.versiculo_chave}
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
                            {new Date(stat.data_inicio) ? (
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
                        <FilePdf width={24} height={24} color="#fff" />
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
