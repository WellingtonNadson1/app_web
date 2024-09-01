"use client";
import { useAlmasAnoStore, useAlmasStore } from "@/store/AlmasStorage";
import { ChartLineUp, Confetti, HandsPraying } from "@phosphor-icons/react";
import { Card } from "../ui/card";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function StatsCard() {
  const { data } = useSession();
  const token = data?.user.token;
  const DataCombineteded = async () => {
    const axiosAuth = axios.create({
      baseURL: "https://back-ibb.vercel.app",
      // baseURL: "http://0.0.0.0:8080",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    try {
      const { data } = await axiosAuth.get("/users/all");
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
      } else {
        console.error(error);
      }
      return null;
    }
  };

  // Estado local para controlar a hidratação da store
  const [isHydrated, setIsHydrated] = useState(false);

  // Acessa e atualiza o estado de almas ganhas no Zustand
  const { almasGanhasNoMes, setAlmasGanhasNoMes } = useAlmasStore();
  const { almasGanhasNoAno, setAlmasGanhasNoAno } = useAlmasAnoStore();

  // Função para buscar dados da API e atualizar o estado
  async function fetchAndUpdateAlmasGanhas() {
    const data = await DataCombineteded();
    if (data) {
      setAlmasGanhasNoMes(data.almasGanhasNoMes);
      setAlmasGanhasNoAno(data.almasGanhasNoAno);
    }
  }

  // useEffect para carregar os dados ao montar o componente
  useEffect(() => {
    fetchAndUpdateAlmasGanhas().then(() => {
      setIsHydrated(true); // Apenas define como true após carregar os dados
    });
  }, []);


  if (!isHydrated) {
    return <div>Carregando...</div>;
  }

  const statusIbb = [
    {
      title: "Conversões Células/Mês",
      porcentagem: "--.--%",
      total: almasGanhasNoMes !== undefined ? almasGanhasNoMes : "Carregando...",
      status: "up",
      icon: HandsPraying,
      color: "bg-[#6074E1]",
      destaq: " o último mês",
    },
    {
      title: "Conversões/Ano",
      porcentagem: "--.--%",
      total: almasGanhasNoAno !== undefined ? almasGanhasNoAno : "Carregando...",
      status: "up",
      icon: Confetti,
      color: "bg-[#F55343]",
      destaq: " o último ano",
    },
    {
      title: "Frequência",
      porcentagem: "--.--%",
      total: "---",
      status: "up",
      icon: ChartLineUp,
      color: "bg-[#5fe2c2]",
      destaq: " o último culto",
    },
  ];

  return (
    <div className="relative z-10 mx-auto mt-3 flex w-full flex-wrap items-center justify-between gap-4 p-2 md:flex-nowrap">
      {statusIbb.map((stat) => (
        <Card
          key={stat.title}
          className="flex-warp relative w-full cursor-pointer flex-col rounded-lg border-black/5 bg-white p-4 transition hover:shadow-md"
        >
          <div className="flex w-full items-center justify-between">
            <div className="mb-0 font-sans text-sm font-semibold uppercase leading-normal">
              {stat.title}
            </div>
            <div className={`rounded-full ${stat.color} p-2 drop-shadow-md`}>
              <stat.icon width={24} height={24} color="#fff" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-semibold">{stat.total}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-bold leading-normal text-emerald-500">
              {stat.porcentagem}
            </span>
            <span className="ml-2 text-sm font-bold leading-normal text-gray-500">
              desde {stat.destaq}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
