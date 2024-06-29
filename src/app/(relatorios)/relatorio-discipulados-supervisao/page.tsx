"use client";
import { BASE_URL, BASE_URL_LOCAL } from "@/functions/functions";
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken";
import dayjs from "dayjs";
import React, { useState, Fragment } from "react";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ptBr from "dayjs/locale/pt-br";
import {
  FormRelatorioSchema,
  MemberDataDiscipulado,
  MembersDataDiscipulado,
} from "./schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { CorSupervision, ListSupervisores } from "@/contexts/ListSupervisores";
import Image from "next/image";
import { useCombinedStore } from "@/store/DataCombineted";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserDataStore } from "@/store/UserDataStore";
import SpinnerButton from "@/components/spinners/SpinnerButton";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);
dayjs.tz.setDefault("America/Sao_Paulo");

export default function DiscipuladosRelatoriosSupervisoes() {
  const { token } = useUserDataStore.getState();

  const axiosAuth = useAxiosAuthToken(token);
  const URLPresencaGeralCultos = `${BASE_URL}/presencacultos/relatorios/supervisores`;
  const URLDiscipuladosSupervisoes = `${BASE_URL}/discipuladosibb/supervisao/relatorio`;

  const [discipuladoForCell, setDiscipuladoForCellForCell] =
    useState<Record<string, MemberDataDiscipulado[]>>();
  const [corSupervisao, setCorSupervisao] = useState("");
  const { register, handleSubmit, reset } = useForm<FormRelatorioSchema>();
  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>();
  const queryClient = useQueryClient();

  const { supervisoes, cargoLideranca } = useCombinedStore.getState().state;

  const DiscipuladosSupervisoes = async ({
    startDate,
    endDate,
    superVisionId,
  }: {
    startDate: string;
    endDate: string;
    superVisionId: string;
  }): Promise<MembersDataDiscipulado[]> => {
    const { data } = await axiosAuth.post(URLDiscipuladosSupervisoes, {
      startDate,
      endDate,
      superVisionId,
    });
    return data as MembersDataDiscipulado[];
  };

  const {
    data: DiscipuladosSupervisao,
    mutateAsync: DiscipuladosSupervisoesFn,
    isPending,
    isSuccess,
  } = useMutation({
    mutationKey: ["getDiscipuladosSupervisao"],
    mutationFn: DiscipuladosSupervisoes,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDiscipuladosSupervisao"],
      });
    },
  });

  // Função para agrupar os discipulados por célula
  async function groupDiscipuladoByCell(
    relatorio: MembersDataDiscipulado,
  ): Promise<Record<string, MemberDataDiscipulado[]>> {
    const celula: Record<string, MemberDataDiscipulado[]> = {};

    relatorio.membros.forEach((membro) => {
      const cellName = membro?.celula?.nome;

      if (cellName) {
        if (!celula[cellName]) {
          celula[cellName] = [];
        }
        celula[cellName].push(membro);
      }
    });
    return Promise.resolve(celula);
  }

  const handleRelatorio: SubmitHandler<FormRelatorioSchema> = async ({
    startDate,
    endDate,
    superVisionId,
  }) => {
    DiscipuladosSupervisoesFn({
      startDate,
      endDate,
      superVisionId,
    });

    if (!isPending && DiscipuladosSupervisao) {
      const dataGroupedForCell = await groupDiscipuladoByCell(
        DiscipuladosSupervisao[0],
      );
      setDiscipuladoForCellForCell(dataGroupedForCell);
      setCorSupervisao(
        DiscipuladosSupervisao[0]?.membros[0]?.supervisao_pertence?.nome,
      );
    }
  };

  const newCorSupervisao = CorSupervision(corSupervisao);
  const Supervisor = ListSupervisores(corSupervisao);

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
              <div className="flex flex-col gap-4 p-3">
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
                      Relatório Discipulados Supervisões
                    </h2>
                  </div>
                </div>

                <div className="flex items-end mt-4 gap-x-4">
                  <div className="p-3">
                    <div className="flex items-center gap-x-5">
                      <div>
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

                      <div>
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

                      {/* SUPERVISÕES */}
                      <div>
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
                              <option value="">
                                Carregando supervisões...
                              </option>
                            ) : (
                              <option value="">Selecione</option>
                            )}
                            {supervisoes &&
                              supervisoes?.map((supervisao) => (
                                <option
                                  key={supervisao.id}
                                  value={supervisao.id}
                                >
                                  {supervisao.nome}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botões para submeter Forms */}
                  <div className="flex items-end justify-end p-3 sm:col-span-2">
                    <div className="">
                      {isPending ? (
                        <button
                          type="submit"
                          disabled={isPending}
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

        {/* TABELA DE REGISTRO DE DISCIPULADOS DA SUPERVISÃO */}
        {isPending ? (
          <p className="flex items-center justify-center gap-2 text-center">
            {" "}
            <SpinnerButton message="" /> Carregando dados...
          </p>
        ) : discipuladoForCell ? (
          <Fragment>
            {/* Inicio Relatorio */}
            <div
              className={cn(
                `text-center text-white bg-yellow-400 dark:bg-yellow-400`,
                newCorSupervisao,
              )}
            >
              <div className="pt-2 pb-0">
                {corSupervisao ? (
                  <h1 className="py-1 font-bold uppercase">
                    RELATÓRIO DE DISCIPUALDOS - SUPERVISÃO {corSupervisao}
                  </h1>
                ) : (
                  <h1 className="py-1 font-bold uppercase">
                    RELATÓRIO - SUPERVISÃO - Sem Dados
                  </h1>
                )}
              </div>
              {isSuccess ? (
                <div className="pb-2 pl-2">
                  <p className="p-2 text-base font-medium uppercase text-start">
                    SUPERVISOR(ES):{" "}
                    <span className="font-normal ">{Supervisor}</span>
                  </p>
                </div>
              ) : (
                <div className="pb-2 pl-2">
                  <p className="p-2 text-base font-medium uppercase text-start">
                    SUPERVISOR(ES):{" "}
                    <span className="font-normal ">Sem Dados</span>
                  </p>
                </div>
              )}
            </div>
            <table className="text-sm text-left text-gray-500 auto-table dark:text-gray-400">
              {/* Cabeçalho da tabela */}
              <thead
                className={cn(
                  `text-center text-white bg-yellow-400 dark:bg-yellow-400 p-2`,
                  newCorSupervisao,
                )}
              >
                <Fragment>
                  <tr className={`mx-4 p-2`}>
                    <th>
                      <h1 className="p-2 font-bold text-center text-white uppercase">
                        CÉLULA
                      </h1>
                    </th>
                    <th>
                      <h1 className="p-2 font-bold text-center text-white uppercase">
                        MEMBROS
                      </h1>
                    </th>
                    <th>
                      <h1 className="p-2 font-bold text-center text-white uppercase">
                        DISCIPULADOR(A)
                      </h1>
                    </th>
                    <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                      <div>
                        <h1 className="font-bold text-center uppercase">
                          % DISCIP. TOTAL
                        </h1>
                      </div>
                    </th>

                    <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                      <div className="text-center">
                        <h1 className="font-bold text-center uppercase">1º</h1>
                        <h1 className="font-bold text-center uppercase">
                          DISCIPULADO
                        </h1>
                      </div>
                    </th>
                    <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                      <div className="text-center">
                        <h1 className="font-bold text-center uppercase">2º</h1>
                        <h1 className="font-bold text-center uppercase">
                          DISCIPULADO
                        </h1>
                      </div>
                    </th>
                  </tr>
                </Fragment>
              </thead>
              <tbody>
                {discipuladoForCell &&
                  Object.keys(discipuladoForCell).map((cellName, cellIndex) => (
                    <tr key={cellName + cellIndex}>
                      {/* Coluna para as células */}
                      <td className="px-4 border border-b bg-gray-50 border-zinc-300">
                        <p className="text-base font-medium text-black">
                          {cellName}
                        </p>
                        <p className="text-sm text-slate-600">
                          Líder:{" "}
                          <span className="capitalize">
                            {
                              discipuladoForCell[cellName][0].celula.lider
                                .first_name
                            }
                          </span>
                        </p>
                        <p className="text-sm text-slate-600">
                          Membros:{" "}
                          <span>{discipuladoForCell[cellName].length}</span>
                        </p>
                      </td>
                      {/* Coluna para membros */}
                      <td>
                        {discipuladoForCell[cellName].map((member) => (
                          <tr
                            className="border border-zinc-200"
                            key={member.id}
                          >
                            {member.first_name ===
                            discipuladoForCell[cellName][0].celula.lider
                              .first_name ? (
                              <div className="flex flex-col justify-center w-40 h-24 px-4 py-4 font-semibold text-gray-500 capitalize">
                                {member.first_name}
                              </div>
                            ) : (
                              <div className="flex flex-col justify-center w-40 h-24 px-4 py-4 capitalize">
                                {member.first_name}
                              </div>
                            )}
                          </tr>
                        ))}
                      </td>
                      {/* Coluna para discipuladores */}
                      <td>
                        {discipuladoForCell[cellName].map((member) => (
                          <tr
                            className="border border-zinc-200"
                            key={member.id}
                          >
                            <div className="flex flex-col justify-center w-40 h-24 px-4 py-4 capitalize">
                              {
                                member
                                  ?.discipulador_usuario_discipulador_usuario_usuario_idTouser[0]
                                  ?.user_discipulador_usuario_discipulador_idTouser
                                  ?.first_name
                              }
                            </div>
                          </tr>
                        ))}
                      </td>

                      {/* Colunas dinâmicas para porcentagem */}
                      <td
                        className="mx-4 text-center"
                        key={cellName + cellIndex}
                      >
                        {discipuladoForCell[cellName].map(
                          (member, indexMember) => {
                            const totalDiscipulado =
                              member
                                ?.discipulador_usuario_discipulador_usuario_usuario_idTouser[0]
                                ?.discipulado.length;
                            return (
                              <tr
                                className="border border-zinc-200"
                                key={member.id}
                              >
                                <div
                                  className="flex flex-col justify-center h-24 font-bold w-36"
                                  key={indexMember}
                                >
                                  {totalDiscipulado ? (
                                    <Fragment>
                                      {totalDiscipulado === 1 ? (
                                        <p className="text-sky-600">{"50%"}</p>
                                      ) : (
                                        <p className="text-green-600">
                                          {"100%"}
                                        </p>
                                      )}
                                    </Fragment>
                                  ) : (
                                    <p
                                      className="text-red-600"
                                      key={indexMember}
                                    >
                                      {"00%"}
                                    </p>
                                  )}
                                </div>
                              </tr>
                            );
                          },
                        )}
                      </td>
                      {/* // 1º Discipulado */}
                      <td className="mx-4 text-center" key={cellName}>
                        {discipuladoForCell[cellName].map(
                          (member, indexMember) => {
                            const discipulado1 =
                              member
                                ?.discipulador_usuario_discipulador_usuario_usuario_idTouser[0]
                                ?.discipulado[0]?.data_ocorreu;
                            return (
                              <tr
                                className="border border-zinc-200"
                                key={member.id}
                              >
                                <div
                                  className="flex flex-col justify-center h-24 font-bold w-36"
                                  key={indexMember}
                                >
                                  {discipulado1 ? (
                                    <Fragment>
                                      {/* tive que aumentar 3h por causa do fuso q foi gravado a data no DB */}
                                      <p className="text-green-600">{`${dayjs(discipulado1).utcOffset("+03:00").format("DD/MM")}`}</p>
                                    </Fragment>
                                  ) : (
                                    <p key={indexMember}>
                                      <p className="font-normal text-slate-600">
                                        -
                                      </p>
                                    </p>
                                  )}
                                </div>
                              </tr>
                            );
                          },
                        )}
                      </td>
                      {/* // 2º Discipulado */}
                      <td className="mx-4 text-center " key={cellIndex}>
                        {discipuladoForCell[cellName].map(
                          (member, indexMember) => {
                            const discipulado2 =
                              member
                                ?.discipulador_usuario_discipulador_usuario_usuario_idTouser[0]
                                ?.discipulado[1]?.data_ocorreu;
                            return (
                              <tr
                                className="border border-zinc-200"
                                key={member.id}
                              >
                                <div
                                  className="flex flex-col justify-center h-24 font-bold w-36"
                                  key={indexMember}
                                >
                                  {discipulado2 ? (
                                    <Fragment>
                                      {/* tive que aumentar 3h por causa do fuso q foi gravado a data no DB */}
                                      <p className="text-green-600">{`${dayjs(discipulado2).utcOffset("+03:00").format("DD/MM")}`}</p>
                                    </Fragment>
                                  ) : (
                                    <p key={indexMember}>
                                      <p className="font-normal text-slate-600">
                                        -
                                      </p>
                                    </p>
                                  )}
                                </div>
                              </tr>
                            );
                          },
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Fragment>
        ) : (
          <span></span>
        )}
      </div>
    </Fragment>
  );
}
