"use client";
import { TimePicker } from "@/components/timer-picker-input/time-picker";
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
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/functions/functions";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { cn } from "@/lib/utils";
import { useUserDataStore } from "@/store/UserDataStore";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CultoSchema } from "./schemaNewCulto";

dayjs.extend(utc);
dayjs.extend(timezone);

const statusCulto = ["Agendado", "Realizado", "Cancelado"];
const cultosSemanais = [
  {
    id: "10875852-929b-4e81-a8cb-34721362c7c3",
    nome: "Culto de Ceia",
    descricao: "Culto Em Memória de Cristo",
  },
  {
    id: "4064be1d-bf55-4851-9f76-99c4554a6265",
    nome: "Culto de Edificação",
    descricao: "Culto de Edificação as quartas-feiras",
  },
  {
    id: "84acfbe4-c7e0-4841-813c-04731ffa9c67",
    nome: "Capacitação Para Discípulos - CPD",
    descricao: "Culto aos Sábados",
  },
  {
    id: "bffb62af-8d03-473a-ba20-ab5a9d7dafbe",
    nome: "Culto de Primícias",
    descricao: "Culto de Primícias ao Senhor",
  },
  {
    id: "cab02f30-cade-46ca-b118-930461013d53",
    nome: "Culto de Celebração - Manhã",
    descricao: "Culto aos Domingos pela manhã",
  },
  {
    id: "ea08ec9b-3d1b-42f3-818a-ec53ef99b78f",
    nome: "Culto de Celebração - Tarde",
    descricao: "Culto aos Domingos pela tarde",
  },
  {
    id: "e7bc72d1-8faa-4bbe-9c24-475b64f956cf",
    nome: "Domingo de Sacrifício",
    descricao: "Culto de 12h de relacionamento com Deus",
  },
];

export default function FormNewCulto() {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof CultoSchema>>({
    resolver: zodResolver(CultoSchema),
  });
  const { token } = useUserDataStore();
  const URLCultosIndividuais = `${BASE_URL}/cultosindividuais`;
  const axiosAuth = useAxiosAuth(token);

  const createNewCultoFunction = async (data: z.infer<typeof CultoSchema>) => {
    // ADAPTANDO HORARIO DEVIDO AO FUSO DO SERVIDOR
    const data_inicio_culto1 = dayjs(data.data_inicio_culto).subtract(3, "hour").toISOString()
    const data_termino_culto2 = dayjs(data.data_termino_culto).subtract(3, "hour").toISOString()

    const data_inicio_culto = new Date(data_inicio_culto1)
    const data_termino_culto = new Date(data_termino_culto2)

    var data = { ...data, data_inicio_culto, data_termino_culto }

    const response = await axiosAuth.post(URLCultosIndividuais, {
      data
    });
    form.reset();
    return response.data;
  };

  const {
    mutateAsync: createNewCultoFn,
    isPending,
  } = useMutation({
    mutationFn: createNewCultoFunction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cultosMarcados"] });
    },
  });

  const onSubmit = async (data: z.infer<typeof CultoSchema>) => {
    try {
      await createNewCultoFn(data);
      toast({
        title: "Sucesso!!!",
        description: "Culto criado com Sucesso!!! 🥳",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Erro!!!",
        description: "Erro na Criaçao do Culto. 😰",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 items-center justify-center mt-10 gap-2 gap-y-6 sm:grid-cols-4">
            {/* DATA INICIAL */}
            <div className="sm:col-span-2">
              <FormField
                control={form.control}
                name="data_inicio_culto"
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
                      <PopoverContent className="w-auto flex p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <TimePicker
                            setDate={field.onChange}
                            date={field.value}
                          />
                        </div>
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
                name="data_termino_culto"
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
                      <PopoverContent className="w-auto p-0 flex" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <TimePicker
                            setDate={field.onChange}
                            date={field.value}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SELECAO CULTOS */}
            <div className="sm:col-span-2">
              <FormField
                control={form.control}
                name="culto_semana"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tipo de Culto</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um culto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cultosSemanais &&
                          cultosSemanais?.map((culto) => (
                            <SelectItem key={culto.id} value={culto.id}>
                              {culto.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* SELECAO CULTOS */}
            <div className="sm:col-span-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusCulto &&
                          statusCulto?.map((status) => (
                            <SelectItem key={status + 1} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* <DialogFooter></DialogFooter> */}
          <Button
            className="mt-4 w-full bg-green-700 hover:bg-green-700 hover:opacity-95 transition ease-in"
            type="submit"
          >
            {isPending ? (
              <div className="flex items-center justify-between gap-2">
                <Spinner className="animate-spin" />
                Salvando
              </div>
            ) : (
              "Salvar"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
