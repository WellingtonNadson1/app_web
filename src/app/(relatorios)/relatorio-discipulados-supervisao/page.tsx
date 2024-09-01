"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CorSupervision, ListSupervisores } from "@/contexts/ListSupervisores";
import { BASE_URL } from "@/functions/functions";
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken";
import { cn } from "@/lib/utils";
import { useData } from "@/providers/providers";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormRelatorioDataSchema,
  MemberDataDiscipulado,
  MembersDataDiscipulado,
} from "./schema";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);
dayjs.tz.setDefault("America/Sao_Paulo");

export default function DiscipuladosRelatoriosSupervisoes() {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuthToken(session?.user.token as string);
  const URLDiscipuladosSupervisoes = `${BASE_URL}/discipuladosibb/supervisao/relatorio`;

  const [discipuladoForCell, setDiscipuladoForCellForCell] =
    useState<Record<string, MemberDataDiscipulado[]>>();
  const [corSupervisao, setCorSupervisao] = useState("");
  const form = useForm<z.infer<typeof FormRelatorioDataSchema>>({
    resolver: zodResolver(FormRelatorioDataSchema),
  });
  const queryClient = useQueryClient();

  // @ts-ignore
  const { data: dataAllCtx } = useData();
  const supervisoes = dataAllCtx?.combinedData[0];

  const DiscipuladosSupervisoes = async ({
    startDate,
    endDate,
    superVisionId,
  }: {
    startDate: Date;
    endDate: Date;
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
    onSuccess: async (data) => {
      queryClient.invalidateQueries({
        queryKey: ["getDiscipuladosSupervisao"],
      });
      const dataGroupedForCell = await groupDiscipuladoByCell(data[0]);
      setDiscipuladoForCellForCell(dataGroupedForCell);
      setCorSupervisao(data[0]?.membros[0]?.supervisao_pertence?.nome);
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

  const handleRelatorio: SubmitHandler<
    z.infer<typeof FormRelatorioDataSchema>
  > = async ({ startDate, endDate, superVisionId }) => {
    DiscipuladosSupervisoesFn({
      startDate,
      endDate,
      superVisionId,
    });
  };

  const newCorSupervisao = CorSupervision(corSupervisao);
  const Supervisor = ListSupervisores(corSupervisao);

  return (
    <Fragment>
      <div className="relative z-40 p-2 bg-white rounded-sm">
        <div className="px-3 mt-2 mb-3">
          <Fragment>
            <div className="flex flex-col gap-4 p-3">
              <div className="flex items-center justify-start gap-4">
                <Link href={"/dashboard"}>
                  <Image
                    className="cursor-pointer"
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

              {/* FORMS */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRelatorio)}>
                  <div className="grid grid-cols-1 items-center justify-center mt-10 gap-2 gap-y-6 sm:grid-cols-12">
                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data de início</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      " pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      dayjs(field.value)
                                        // .subtract(3, "hours")
                                        .utc()
                                        .local()
                                        .locale("pt-br")
                                        .format("DD-MM-YYYY HH:mm:ss")
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* DATA FINAL */}
                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data final</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      " pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      dayjs(field.value)
                                        // .subtract(3, "hours")
                                        .utc()
                                        .local()
                                        .locale("pt-br")
                                        .format("DD-MM-YYYY HH:mm:ss")
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* SELECAO SUPERVISAO */}
                    <div className="sm:col-span-3">
                      <FormField
                        control={form.control}
                        name="superVisionId"
                        render={({ field }) => (
                          <FormItem className="space-y-2 flex flex-col">
                            <FormLabel>Supervisão</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma supervisão" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {supervisoes &&
                                  // @ts-ignore
                                  supervisoes?.map((supervisao) => (
                                    <SelectItem
                                      key={supervisao.id}
                                      value={supervisao.id}
                                    >
                                      {supervisao.nome}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Botões para submeter Forms */}
                    <div className="flex flex-col w-full sm:col-span-2">
                      <div className="sm:mt-5">
                        <Button
                          type="submit"
                          className="w-full text-white bg-blue-700 shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                          disabled={isPending}
                        >
                          {isPending ? (
                            <>
                              <Spinner className="animate-spin mr-2" />
                              <span>Gerando...</span>
                            </>
                          ) : (
                            <span>Relatório</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </Fragment>
        </div>

        {/* TABELA DE REGISTRO DE DISCIPULADOS DA SUPERVISÃO */}
        {isPending ? (
          <p className="flex items-center justify-center gap-2 text-center">
            {" "}
            <Spinner className="animate-spin" /> Carregando dados...
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
                                member?.discipulador[0]?.user_discipulador
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
                              member?.discipulador[0]?.discipulado.length;
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
                              member?.discipulador[0]?.discipulado[0]
                                ?.data_ocorreu;
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
                              member?.discipulador[0]?.discipulado[1]
                                ?.data_ocorreu;
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
