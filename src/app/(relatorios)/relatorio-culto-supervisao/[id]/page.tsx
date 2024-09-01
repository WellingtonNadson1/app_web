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
import { addYears } from "date-fns";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormRelatorioDataSchema,
  GroupedForCulto,
  Pessoa,
  PresencaForDate,
} from "./schema";
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ptBr);
dayjs.tz.setDefault("America/Sao_Paulo");

export default function StatsCardRelatorios() {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuthToken(session?.user.token as string);

  const URLPresencaGeralCultos = `${BASE_URL}/relatorio/presencacultos`;
  const URLRelatorioPresenceCulto = `${BASE_URL}/cultosindividuais/fordate`;

  const [groupedForCell, setGroupedForCell] = useState<
    Record<string, Pessoa[]> | undefined
  >();
  const [dateCultoData, setDateCultoData] = useState<GroupedForCulto | null>(
    null,
  );
  const [corSupervisao, setCorSupervisao] = useState<string>("");
  const [idCultos, setIdCultos] = useState<string[] | undefined>();
  const [datasUnic, setDatasUnic] = useState<string[] | undefined>();
  const [numberOfRowsCell, setNumberOfRowsCell] = useState<
    number[] | undefined
  >();
  const form = useForm<z.infer<typeof FormRelatorioDataSchema>>({
    resolver: zodResolver(FormRelatorioDataSchema),
  });

  const today = new Date();
  const yearCalendar = addYears(today, 5).getFullYear();
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false);
  const [totalCultos, setTotalCultos] = useState<number>(0);
  const [totalCultosPrimicias, setTotalCultosPrimicias] = useState<number>(0);
  const [totalCultosSacrificio, setTotalCultosSacrificio] = useState<number>(0);
  const [totalCultosQuarta, setTotalCultosQuarta] = useState<number>(0);
  const [totalCultosSabado, setTotalCultosSabado] = useState<number>(0);
  const [totalCultosDomingoManha, setTotalCultosDomingoManha] =
    useState<number>(0);
  const [totalCultosDomingoTarde, setTotalCultosDomingoTarde] =
    useState<number>(0);

  // @ts-ignore
  const { data: dataAllCtx } = useData();
  const supervisoes = dataAllCtx?.combinedData[0];

  const handleRelatorio = async ({
    startDate,
    endDate,
    superVisionId,
  }: z.infer<typeof FormRelatorioDataSchema>) => {
    try {
      setIsLoadingSubmitForm(true);

      // Adicionando um dia ao endDate
      const adjustedEndDate = dayjs(endDate).add(1, "day").toISOString();

      // Executando as chamadas de API em paralelo com Promise.all
      const [presencaGeralResponse, relatorioResponse] = await Promise.all([
        axiosAuth.post(URLPresencaGeralCultos, {
          startDate,
          endDate: adjustedEndDate,
          superVisionId,
        }),
        axiosAuth.post(URLRelatorioPresenceCulto, {
          superVisionId,
          startDate,
          endDate: adjustedEndDate,
        }),
      ]);

      const presencaGeralCultos = presencaGeralResponse.data as Pessoa[];
      const relatorioData = relatorioResponse.data;

      if (presencaGeralCultos) {
        // Pegando as datas unicas para o THeader
        const datasUnicas = new Set<string>();

        presencaGeralCultos.forEach((membro) => {
          membro.presencasFiltradas.forEach((presenca) => {
            datasUnicas.add(presenca.presenca_culto.data_inicio_culto);
          });
        });

        const datasArray: string[] = Array.from(datasUnicas).sort();
        setDatasUnic(datasArray);
        // Fim do get for datas unicas para o THeader

        const dataGroupedForCell = groupDataByCell(presencaGeralCultos);
        setGroupedForCell(dataGroupedForCell);
      }

      if (
        presencaGeralCultos &&
        relatorioData &&
        presencaGeralCultos.length > 0
      ) {
        const ids = new Set<string>();
        presencaGeralCultos.forEach((membro) => {
          const presencasOrdenadas = membro.presencasFiltradas.sort(
            (a, b) =>
              new Date(a.presenca_culto.data_inicio_culto).getTime() -
              new Date(b.presenca_culto.data_inicio_culto).getTime(),
          );
          presencasOrdenadas.forEach((t) => {
            ids.add(t.cultoIndividualId);
          });
        });

        const sortedIds = Array.from(ids).sort((a, b) => {
          const cultoA = presencaGeralCultos.find((membro) =>
            membro.presencasFiltradas.some(
              (presenca) => presenca.cultoIndividualId === a,
            ),
          );
          const cultoB = presencaGeralCultos.find((membro) =>
            membro.presencasFiltradas.some(
              (presenca) => presenca.cultoIndividualId === b,
            ),
          );

          const dataInicioA = cultoA?.presencasFiltradas.find(
            (presenca) => presenca.cultoIndividualId === a,
          )?.presenca_culto.data_inicio_culto;
          const dataInicioB = cultoB?.presencasFiltradas.find(
            (presenca) => presenca.cultoIndividualId === b,
          )?.presenca_culto.data_inicio_culto;

          if (dataInicioA && dataInicioB) {
            return (
              new Date(dataInicioA).getTime() - new Date(dataInicioB).getTime()
            );
          } else {
            return 0;
          }
        });
        setIdCultos(sortedIds);
        idCultos && console.log("IDS: ", idCultos);
      }

      const relatorio: PresencaForDate[] = Object.values(relatorioData);

      if (!relatorio) {
        console.log("Erro na resposta da API:", relatorioData.statusText);
        return;
      }

      const dataGroupedForDateCulto: GroupedForCulto =
        groupDataByDateCulto(relatorio);

      setCorSupervisao(
        relatorio[0].presencas_culto[0].membro.supervisao_pertence.nome,
      );
      console.log("relatorio", relatorio);

      const Cultos = relatorio.pop();
      setTotalCultos(Cultos as unknown as number);

      const CultoDomingoTarde = relatorio.pop();
      setTotalCultosDomingoTarde(CultoDomingoTarde as unknown as number);

      const CultoDomingoManha = relatorio.pop();
      setTotalCultosDomingoManha(CultoDomingoManha as unknown as number);

      const CultoSabado = relatorio.pop();
      setTotalCultosSabado(CultoSabado as unknown as number);

      const cultoDomingoSacrificio = relatorio.pop();
      setTotalCultosSacrificio(cultoDomingoSacrificio as unknown as number);

      const cultoPrimicia = relatorio.pop();
      setTotalCultosPrimicias(cultoPrimicia as unknown as number);

      const CultoQuarta = relatorio.pop();
      setTotalCultosQuarta(CultoQuarta as unknown as number);

      setDateCultoData(dataGroupedForDateCulto);

      setIsLoadingSubmitForm(false);
    } catch (error) {
      setIsLoadingSubmitForm(false);
      console.log("Erro ao buscar o relatório:", error);
    }
  };

  const handleFunctions = (data: z.infer<typeof FormRelatorioDataSchema>) => {
    handleRelatorio(data);
  };

  const groupDataByDateCulto = (relatorio: PresencaForDate[]) => {
    const groupedDataForDateCulto: GroupedForCulto = {};

    relatorio.forEach((entry) => {
      const dateCultoId = entry.data_inicio_culto;
      if (dateCultoId) {
        if (!groupedDataForDateCulto[dateCultoId]) {
          groupedDataForDateCulto[dateCultoId] = [];
        }
        groupedDataForDateCulto[dateCultoId].push(entry);
      }
    });
    return groupedDataForDateCulto;
  };

  const groupDataByCell = (relatorio: Pessoa[]): Record<string, Pessoa[]> => {
    const grupos: Record<string, Pessoa[]> = {};

    relatorio.forEach((person) => {
      const cellName = person.celula?.nome;

      if (cellName) {
        if (!grupos[cellName]) {
          grupos[cellName] = [];
        }
        grupos[cellName].push(person);
      }
    });
    return grupos;
  };

  const newCorSupervisao = CorSupervision(corSupervisao);
  console.log("newCorSupervisao", newCorSupervisao);
  const Supervisor = ListSupervisores(corSupervisao);

  useEffect(() => {
    const rowsCellName = new Set<number>();
    const rowsNameCell: number[] =
      (groupedForCell &&
        idCultos &&
        Object.keys(groupedForCell)?.map((cellName, cellIndex) => {
          const length = groupedForCell[cellName].length;
          rowsCellName.add(length);
          return length; // Return the length to populate the array
        })) ||
      [];

    setNumberOfRowsCell(rowsNameCell);
  }, [groupedForCell, idCultos]); // Add dependencies to useEffect

  return (
    <Fragment>
      <div className="relative z-40 p-2 bg-white rounded-sm">
        <div className="px-3 mt-2 mb-3">
          <Fragment>
            <div className="p-3">
              {/* HEADER */}
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
                    Relatório de Supervisão
                  </h2>
                </div>
              </div>

              {/* FORMS */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFunctions)}>
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
                                  className="flex items-center justify-center gap-1"
                                  captionLayout="dropdown-buttons"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  fromYear={2023}
                                  toYear={yearCalendar}
                                  // disabled={(date) =>
                                  //   date > new Date() ||
                                  //   date < new Date("1900-01-01")
                                  // }
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
                                  captionLayout="dropdown-buttons"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  fromYear={2023}
                                  toYear={yearCalendar}
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
                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="superVisionId"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
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
                    {/* <div className="sm:col-span-2">
                      <Label
                        htmlFor="startDate"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Dt. Início
                      </Label>
                      <div className="mt-3">
                        <Input
                          {...register("startDate", { required: true })}
                          type="datetime-local"
                          name="startDate"
                          id="startDate"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div> */}

                    {/* <div className="sm:col-span-2">
                      <Label
                        htmlFor="endDate"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Dt. Final
                      </Label>
                      <div className="mt-3">
                        <Input
                          {...register("endDate", { required: true })}
                          type="datetime-local"
                          name="endDate"
                          id="endDate"
                          className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div> */}

                    {/* INFORMAÇÕES DO REINO */}
                    {/* <div className="sm:col-span-2">
                      <Label
                        htmlFor="superVisionId"
                        className="block text-sm font-medium leading-6 text-slate-700"
                      >
                        Supervisão
                      </Label>
                      <div className="mt-3">
                        <Select
                          {...register("superVisionId", { required: true })}
                          // onChange={handleSupervisaoSelecionada}
                        >
                          <SelectContent>
                            <SelectGroup>
                              {!supervisoes ? (
                                <SelectItem value="q">
                                  Carregando supervisões...
                                </SelectItem>
                              ) : (
                                <SelectItem value="w">Selecione</SelectItem>
                              )}
                              {supervisoes &&
                                supervisoes?.map((supervisao) => (
                                  <SelectItem
                                    key={supervisao.id}
                                    value={supervisao.id}
                                  >
                                    {supervisao.nome}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div> */}
                    {/* Botões para submeter Forms */}
                    <div className="flex flex-col w-full sm:justify-center sm:items-center sm:col-span-2">
                      <div className="sm:mt-6 w-full">
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
                            <span>Gerando...</span>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="px-3 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                          >
                            <span>Relatório</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </Fragment>
        </div>
        {/* Inicio Relatorio */}
        <div
          className={cn(
            `bg-yellow-400 w-full text-center text-white`,
            `${newCorSupervisao}`,
          )}
        >
          <div className="pt-2 pb-0">
            <h1 className="py-1 font-bold uppercase">
              RELATÓRIO - SUPERVISÃO - {corSupervisao}
            </h1>
          </div>
          {totalCultos ? (
            <div className="pb-2 pl-2">
              <p className="p-2 text-base font-medium uppercase text-start">
                SUPERVISOR(ES):{" "}
                <span className="font-normal">{Supervisor}</span>
              </p>
            </div>
          ) : (
            <div className="pb-2 pl-2">
              <p className="p-2 text-base font-medium uppercase text-start">
                SUPERVISOR(ES): <span className="font-normal ">Sem Dados</span>
              </p>
            </div>
          )}
          <div className="flex items-center justify-between gap-2 pb-2 pl-2 text-zinc-700 bg-slate-50">
            {totalCultos ? (
              <div>
                <p className="p-2 text-base font-medium uppercase text-start">
                  TOTAL DE CULTOS:{" "}
                  <span className="font-normal ">{totalCultos}</span>
                </p>
              </div>
            ) : (
              <div>
                <p className="p-2 text-base font-medium uppercase text-start">
                  TOTAL DE CULTOS:{" "}
                  <span className="font-normal ">Sem Registro</span>
                </p>
              </div>
            )}
            {totalCultosPrimicias ? (
              <div>
                <p className="p-2 font-medium uppercase text-start">
                  CULTOS DE PRIMÍCIAS:{" "}
                  <span className="font-normal">{totalCultosPrimicias}</span>
                </p>
              </div>
            ) : (
              <div className="hidden"></div>
            )}
            {totalCultosSacrificio ? (
              <div>
                <p className="p-2 font-medium uppercase text-start">
                  DOMINGO DE SACRIFÍCIO:{" "}
                  <span className="font-normal">{totalCultosSacrificio}</span>
                </p>
              </div>
            ) : (
              <div className="hidden">
                <p className="p-2 uppercase text-start">
                  DOMINGO DE SACRIFÍCIO: Sem Registro
                </p>
              </div>
            )}
            <div>
              {totalCultosDomingoManha ? (
                <p className="p-2 font-medium uppercase text-start">
                  DOMINGO MANHÃ:{" "}
                  <span className="font-normal">{totalCultosDomingoManha}</span>
                </p>
              ) : (
                <p className="p-2 font-medium uppercase text-start">
                  DOMINGO MANHÃ:{" "}
                  <span className="font-normal">Sem Registro</span>
                </p>
              )}
            </div>
            <div>
              {totalCultosDomingoTarde ? (
                <p className="p-2 font-medium uppercase text-start">
                  DOMINGO TARDE:{" "}
                  <span className="font-normal">{totalCultosDomingoTarde}</span>
                </p>
              ) : (
                <p className="p-2 font-medium uppercase text-start">
                  DOMINGO TARDE:{" "}
                  <span className="font-normal">Sem Registro</span>
                </p>
              )}
            </div>
            <div>
              {totalCultosSabado ? (
                <p className="p-2 font-medium uppercase text-start">
                  SÁBADO (CPD):{" "}
                  <span className="font-normal">{totalCultosSabado}</span>
                </p>
              ) : (
                <p className="p-2 font-medium uppercase text-start">
                  SÁBADO (CPD):{" "}
                  <span className="font-normal">Sem Registro</span>
                </p>
              )}
            </div>
            <div>
              {totalCultosQuarta ? (
                <p className="p-2 font-medium uppercase text-start">
                  CULTOS DE QUARTA:{" "}
                  <span className="font-normal">{totalCultosQuarta}</span>
                </p>
              ) : (
                <p className="p-2 font-medium uppercase text-start">
                  CULTOS DE QUARTA:{" "}
                  <span className="font-normal">Sem Registro</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <table className="text-sm text-left text-gray-500 auto-table dark:text-gray-400">
          {/* Cabeçalho da tabela */}
          <thead className={cn(`p-2 text-center`, `${newCorSupervisao}`)}>
            <Fragment>
              <tr className={`mx-4 p-2`}>
                <th>
                  <h1 className="p-2 font-bold text-center text-white uppercase">
                    CÉLULAS
                  </h1>
                </th>
                <th>
                  <h1 className="p-2 font-bold text-center text-white uppercase">
                    MEMBROS
                  </h1>
                </th>
                <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                  <div>
                    <h1 className="font-bold text-center uppercase">
                      % PRES. TOTAL
                    </h1>
                  </div>
                </th>
                {totalCultosPrimicias ? (
                  <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                    <div>
                      <h1 className="font-bold text-center uppercase">%</h1>
                      <h1 className="font-bold text-center uppercase">
                        PRIMI.
                      </h1>
                    </div>
                  </th>
                ) : (
                  <th className="hidden"></th>
                )}
                {totalCultosSacrificio ? (
                  <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                    <div>
                      <h1 className="font-bold text-center uppercase">%</h1>
                      <h1 className="font-bold text-center uppercase">
                        SACRIFI.
                      </h1>
                    </div>
                  </th>
                ) : (
                  <th className="hidden"></th>
                )}
                <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                  <div className="text-center">
                    <h1 className="font-bold text-center uppercase">%</h1>
                    <h1 className="font-bold text-center uppercase">DOM M.</h1>
                  </div>
                </th>
                <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                  <div className="text-center">
                    <h1 className="font-bold text-center uppercase">%</h1>
                    <h1 className="font-bold text-center uppercase">DOM T.</h1>
                  </div>
                </th>
                <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                  <div className="text-center">
                    <h1 className="font-bold text-center uppercase">%</h1>
                    <h1 className="font-bold text-center uppercase">CPD</h1>
                  </div>
                </th>
                <th className="flex-col items-center justify-center w-20 h-20 p-2 bg-white border text-zinc-700">
                  <div className="text-center">
                    <h1 className="font-bold text-center uppercase">%</h1>
                    <h1 className="font-bold text-center uppercase">QUARTA</h1>
                  </div>
                </th>
                {groupedForCell &&
                  datasUnic &&
                  datasUnic.map((dataCulto, dataCultoIndex) => (
                    <th
                      className="flex-col items-center justify-center w-20 h-20 p-2 mb-2 text-white"
                      key={dataCultoIndex}
                    >
                      <div className="">
                        <p>{`${dayjs(dataCulto)
                          .format("ddd")
                          .toUpperCase()}`}</p>
                        <p>{`${dayjs(dataCulto).format("DD/MM")}`}</p>
                      </div>
                    </th>
                  ))}
              </tr>
            </Fragment>
          </thead>
          <tbody>
            {groupedForCell &&
              idCultos &&
              Object.keys(groupedForCell).map((cellName, cellIndex) => (
                <tr
                  className={`border-b border-slate-600`}
                  key={cellName + cellIndex}
                >
                  {/* Coluna fixa */}
                  <td className="px-4 bg-gray-50">
                    <p className="text-base font-medium text-black">
                      {cellName}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      Líder:{" "}
                      <span className="font-normal">
                        {groupedForCell[cellName][0].celula.lider.first_name}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600">
                      Membros: <span>{groupedForCell[cellName].length}</span>
                    </p>
                  </td>
                  {/* Coluna para membros */}
                  <td className="px-4">
                    {groupedForCell[cellName].map((member) => (
                      <tr className="w-20 h-20 py-4" key={member.id}>
                        <div className="flex flex-col justify-center h-20">
                          {member.first_name}
                        </div>
                      </tr>
                    ))}
                  </td>
                  <td className="border">
                    {groupedForCell[cellName].map((member) => (
                      <tr className="" key={member.id}>
                        <div className="flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50">
                          {member.cultos.porcentagemPresencaTotal} %
                        </div>
                      </tr>
                    ))}
                  </td>
                  {totalCultosPrimicias ? (
                    <td className="border">
                      {groupedForCell[cellName].map((member) => (
                        <tr className="" key={member.id}>
                          <div className="flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50">
                            {member.cultos.porcentagemPresencaPrimicia} %
                          </div>
                        </tr>
                      ))}
                    </td>
                  ) : (
                    <div className="hidden"></div>
                  )}
                  {totalCultosSacrificio ? (
                    <td className="border">
                      {groupedForCell[cellName].map((member) => (
                        <tr className="" key={member.id}>
                          <div className="flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50">
                            {member.cultos.porcentagemPresencaDomingoSacrificio}{" "}
                            %
                          </div>
                        </tr>
                      ))}
                    </td>
                  ) : (
                    <div className="hidden"></div>
                  )}
                  <td className="border">
                    {groupedForCell[cellName].map((member) => (
                      <tr className="" key={member.id}>
                        <div className="flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50">
                          {member.cultos.porcentagemPresencaTotalDomingoManha} %
                        </div>
                      </tr>
                    ))}
                  </td>
                  <td className="border">
                    {groupedForCell[cellName].map((member) => (
                      <tr className="" key={member.id}>
                        <div className="flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50">
                          {member.cultos.porcentagemPresencaTotalDomingoTarde} %
                        </div>
                      </tr>
                    ))}
                  </td>
                  <td className="border">
                    {groupedForCell[cellName].map((member) => (
                      <tr className="" key={member.id}>
                        <div className="flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50">
                          {member.cultos.porcentagemPresencaSabado} %
                        </div>
                      </tr>
                    ))}
                  </td>
                  <td className="border">
                    {groupedForCell[cellName].map((member) => (
                      <tr className="" key={member.id}>
                        <div className="flex flex-col items-center justify-center w-20 h-20 border-b bg-slate-50">
                          {member.cultos.porcentagemPresencaQuarta} %
                        </div>
                      </tr>
                    ))}
                  </td>
                  {/* Colunas dinâmicas para presenças */}
                  {idCultos.map((cultoId, indexCulto) => (
                    <td
                      className="mx-4 mb-4 text-center border border-zinc-200"
                      key={cultoId + indexCulto}
                    >
                      {groupedForCell[cellName].map((member, indexMember) => {
                        const presenceCulto = member.presencas_cultos.find(
                          (p) => p.cultoIndividualId === cultoId,
                        );
                        return (
                          <div
                            className="flex flex-col justify-center w-20 h-20 font-bold border-b border-zinc-200"
                            key={cultoId + indexMember}
                          >
                            {presenceCulto ? (
                              <Fragment>
                                {presenceCulto.status === true && (
                                  <p className="text-green-600">P</p>
                                )}
                                {presenceCulto.status === false && (
                                  <p className="text-red-600">F</p>
                                )}
                              </Fragment>
                            ) : (
                              <p key={indexMember}>
                                <p className="font-normal text-slate-600">-</p>
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}
