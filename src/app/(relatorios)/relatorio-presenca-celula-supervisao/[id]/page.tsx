"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BASE_URL } from "@/functions/functions";
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken";
import { cn } from "@/lib/utils";
import { useData } from "@/providers/providers";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import TabelRelatorio from "./FormRelatorio";
import { FormRelatorioDataSchema, FormRelatorioSchema, TSupervisionData } from "./schema";
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
  const form = useForm<z.infer<typeof FormRelatorioDataSchema>>({
    resolver: zodResolver(FormRelatorioDataSchema),
  })
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false);

  // @ts-ignore
  const { data: dataAllCtx } = useData();
  const supervisoes = dataAllCtx?.combinedData[0];

  const handleRelatorio: SubmitHandler<FormRelatorioSchema> = async ({
    startDate,
    endDate,
    superVisionId,
  }) => {
    try {
      setIsLoadingSubmitForm(true);
      const response = await axiosAuth.post(URLPresencaReuniaoCelula, {
        superVisionId,
        startDate,
        endDate,
      });
      const result = await response.data;
      setRelatorioData(result);
      setIsLoadingSubmitForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <div className="relative z-40 p-2 bg-white rounded-sm">
        <div className="px-3 mt-2 mb-3">
          <Fragment>
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
                          disabled={isLoadingSubmitForm}
                        >
                          {isLoadingSubmitForm ? (
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
