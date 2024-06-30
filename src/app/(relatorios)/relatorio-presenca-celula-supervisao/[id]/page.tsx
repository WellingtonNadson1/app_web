"use client";
import { BASE_URL, BASE_URL_LOCAL } from "@/functions/functions";
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useState } from "react";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ptBr from "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { FormRelatorioSchema, TSupervisionData } from "./schema";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import { useCombinedStore } from "@/store/DataCombineted";
import Link from "next/link";
import TabelRelatorio from "./FormRelatorio";
import { useData } from "@/providers/providers";
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);
dayjs.tz.setDefault("America/Sao_Paulo");

export default function RelatoriosPresencaCelula() {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuthToken(session?.user.token as string);
  const URLPresencaReuniaoCelula = `${BASE_URL}/relatorio/presencacelula`;
  const [RelatorioData, setRelatorioData] = useState<TSupervisionData>();
  const { register, handleSubmit } = useForm<FormRelatorioSchema>();
  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>();
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false);

  // @ts-ignore
  const { data, error, isLoading } = useData();
  const supervisoes = data?.combinedData[0];

  const handleRelatorio: SubmitHandler<FormRelatorioSchema> = async ({
    startDate,
    endDate,
    superVisionId,
  }) => {
    try {
      setIsLoadingSubmitForm(true);
      dayjs(startDate).tz("America/Sao_Paulo").toISOString();
      dayjs(endDate).tz("America/Sao_Paulo").toISOString();

      const response = await axiosAuth.post(URLPresencaReuniaoCelula, {
        superVisionId,
        startDate,
        endDate,
      });

      const result = await response.data;
      setRelatorioData(result);
      setIsLoadingSubmitForm(false);
      console.log("data", result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("RelatorioData", RelatorioData); // Mostrar o estado atualizado
  }, [RelatorioData]);

  const handleSupervisaoSelecionada = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSupervisaoSelecionada(event.target.value);
  };

  return (
    <Fragment>
      <div className="relative z-40 p-2 bg-white rounded-sm">
        <div className="px-3 mt-2 mb-3">
          <Fragment>
            <form onSubmit={handleSubmit(handleRelatorio)}>
              <div className="p-3">
                <div className="flex items-center justify-start gap-4">
                  <Link href={"/dashboard"}>
                    <Image
                      src="/images/logo-ibb-1.svg"
                      width={62}
                      height={64}
                      alt="Logo IBB"
                    />
                  </Link>
                  <div>
                    <h1 className="text-base leading-normal text-gray-600 uppercase">
                      Igreja Batista Betânia - Lugar do derramar de Deus
                    </h1>
                    <h2 className="text-sm leading-normal text-gray-400 uppercase">
                      Relatório de Presença nas Reuniões de Células
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-9">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium leading-6 text-slate-700"
                    >
                      Dt. Início
                    </label>
                    <div className="mt-3">
                      <input
                        {...register("startDate", { required: true })}
                        type="datetime-local"
                        name="startDate"
                        id="startDate"
                        className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium leading-6 text-slate-700"
                    >
                      Dt. Final
                    </label>
                    <div className="mt-3">
                      <input
                        {...register("endDate", { required: true })}
                        type="datetime-local"
                        name="endDate"
                        id="endDate"
                        className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* INFORMAÇÕES DO REINO */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="superVisionId"
                      className="block text-sm font-medium leading-6 text-slate-700"
                    >
                      Supervisão
                    </label>
                    <div className="mt-3">
                      <select
                        {...register("superVisionId", { required: true })}
                        id="superVisionId"
                        name="superVisionId"
                        className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        onChange={handleSupervisaoSelecionada}
                      >
                        {!supervisoes ? (
                          <option value="">Carregando supervisões...</option>
                        ) : (
                          <option value="">Selecione</option>
                        )}
                        {supervisoes &&
                          // @ts-ignore
                          supervisoes?.map((supervisao) => (
                            <option key={supervisao.id} value={supervisao.id}>
                              {supervisao.nome}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  {/* Botões para submeter Forms */}
                  <div className="flex flex-col justify-end sm:col-span-2">
                    <div className="">
                      {isLoadingSubmitForm ? (
                        <button
                          type="submit"
                          // disabled={isLoadingSubmitForm}
                          className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        >
                          <svg
                            className="w-5 h-5 mr-3 text-white animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Gerando Relat...</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="px-3 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                        >
                          <span>Gerar Relatório</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Fragment>
        </div>
        {/* Inicio Relatorio */}
        {RelatorioData &&
          RelatorioData?.supervisionData?.celulas?.map((celula) => (
            <>
              <div className="flex flex-col gap-1">
                <TabelRelatorio
                  celula={celula}
                  supervisionData={RelatorioData}
                  key={celula.id}
                />
              </div>
            </>
          ))}
      </div>
    </Fragment>
  );
}
