"use client";
import { ComboboxDemo } from "@/components/MultiUserSelect/multi-membros-select";
import { TimePicker } from "@/components/timer-picker-input/time-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/functions/functions";
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken";
import { cn } from "@/lib/utils";
import { useCombinedStore } from "@/store/DataCombineted";
import { useUserDataStore } from "@/store/UserDataStore";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { PlusCircle, Spinner } from "@phosphor-icons/react/dist/ssr";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm, UseFormSetValue } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { FormCelula, schemaFormCelula, SupervisaoData, UserCombobox } from "./schema";

dayjs.extend(utc);
dayjs.extend(timezone);

const handleZipCode = async (
  e: React.FormEvent<HTMLInputElement>,
  setValue: UseFormSetValue<FormCelula> // Atualize o valor do form
) => {
  const zipCode = e.currentTarget.value.replace(/\D/g, '');

  if (zipCode.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
      const data = await response.json();

      if (!data.erro) {
        // Defina os valores usando setValue
        setValue('cidade', data.localidade);
        setValue('endereco', data.logradouro);
        setValue('estado', data.uf);
        setValue('bairro', data.bairro);
      }
    } catch (error) {
      console.error('Erro ao buscar o CEP', error);
    }
  }
};

export default function AddNewCelula() {
  const { token } = useUserDataStore.getState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>();
  const [supervisoes, setSupervisoes] = useState<SupervisaoData[]>();
  const [usersSupervisaoSelecionada, setUsersSupervisaoSelecionada] = useState<
    UserCombobox[]
  >([]);
  const axiosAuth = useAxiosAuthToken(token);

  const URLCelulas = `${BASE_URL}/celulas`;
  const URLSupervisoes = `${BASE_URL}/supervisoes`;

  const daysWeek = [
    { label: "Domingo", value: "0" },
    { label: "Segunda-feira", value: "1" },
    { label: "Terça-feira", value: "2" },
    { label: "Quarta-feira", value: "3" },
    { label: "Quinta-feira", value: "4" },
    { label: "Sexta-feira", value: "5" },
    { label: "Sábado", value: "6" },
  ]

  const { state } = useCombinedStore()
  const supervisoesAll = state.supervisoes

  const form = useForm<FormCelula>({
    defaultValues: {
      nome: '',
      date_que_ocorre: '',
      date_inicio: undefined,
      date_multipicar: undefined,
      supervisao: {},
      lider: {},
      membros: [],
      cep: '',
      cidade: '',
      estado: '',
      bairro: '',
      endereco: '',
      numero_casa: ''
    }
  });

  const CreateNewCelulaFunction = async (
    data
      : z.infer<typeof schemaFormCelula>) => {

    const date_inicio = new Date(dayjs(data.date_inicio).toISOString())
    const date_multipicar = new Date(dayjs(data.date_multipicar).toISOString());

    const response = await axiosAuth.post(URLCelulas, {
      ...data,
      date_inicio,
      date_multipicar,
      membros: data.membros.map((membro) => membro.id)
    });
    form.reset();
    return response.data;
  };

  const { mutateAsync: createNewCelulaFn, isPending } = useMutation({
    mutationFn: CreateNewCelulaFunction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allCelulasIbb"] });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof schemaFormCelula>> = async (data) => {
    const response = await createNewCelulaFn(data)
    if (response) {
      toast({
        variant: "default",
        title: "Successo",
        description: "Célula Cadastrada com sucesso.",
      });
      form.reset();
    } else {
      toast({
        title: "Erro!!!",
        description: "Erro no Cadastro da Célula. 😰",
        variant: "destructive",
      });
    };
  }

  const handleSupervisaoSelecionada = (
    value: string,
  ) => {
    setSupervisaoSelecionada(value);
  };

  useEffect(() => {
    axiosAuth
      .get(URLSupervisoes)
      .then((response) => {
        setSupervisoes(response.data);
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
      });
  }, []);

  useEffect(() => {
    if (supervisaoSelecionada) {
      console.log('supervisaoSelecionada', supervisaoSelecionada)
      // Use the selected supervision ID to filter the list of users
      console.log('supervisoes', supervisoes)
      const selectedSupervisao = supervisoes?.find(
        (supervisao) => supervisao.id === supervisaoSelecionada,
      );
      console.log('selectedSupervisao', selectedSupervisao)
      if (selectedSupervisao) {
        const lideresOrdenados = selectedSupervisao.membros.sort((a, b) => (a.first_name ?? '').localeCompare(b.first_name ?? '')
        )
        setUsersSupervisaoSelecionada(lideresOrdenados);
      }
    }
  }, [supervisaoSelecionada, supervisoes]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full flex items-center justify-between gap-2 px-2 hover:bg-transparent hover:text-foreground">
                <PlusCircle size={18} />
                Add Nova Célula
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </DialogTrigger>
        <DialogContent className="lg:max-w-screen-md overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Cadastrando nova Célula</DialogTitle>
            <DialogDescription>
              Edite os dados preenchendo o formulário
            </DialogDescription>
          </DialogHeader>

          {/* Incio do Forms */}
          <div className="relative w-full mx-auto ">
            <div className="flex justify-between">
              <div className="relative mx-auto py-4">
                <div className="p-2 mx-auto bg-white rounded-lg">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="pb-3">
                        {/* Nome da Celula */}
                        <div className="grid grid-cols-1 mt-4 gap-x-4 gap-y-6 sm:grid-cols-8">
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="nome"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome da Célula</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nome da Célula" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {/* Dia que a Celula Ocorre */}
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="date_que_ocorre"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dia que Ocorre</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue className="text-muted-foreground" placeholder="Selecione uma data" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {daysWeek?.map((day) => (
                                        <SelectItem key={day.value} value={day.value}>
                                          {day.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {/* Data de Início da Célula */}
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="date_inicio"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Data de Início</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            " pl-3 text-left font-normal",
                                            !field.value &&
                                            "text-muted-foreground",
                                          )}
                                        >
                                          {field.value ? (
                                            dayjs(field.value)
                                              .subtract(3, "hours")
                                              .utc()
                                              .local()
                                              .locale("pt-br")
                                              .format("DD-MM-YYYY HH:mm:ss")
                                          ) : (
                                            <span className="text-muted-foreground">Selecione uma data</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto flex p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => {
                                          const today = new Date();
                                          today.setHours(0, 0, 0, 0);
                                          return date > today;
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
                          {/* Data para multiplicação da Célula */}
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="date_multipicar"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Data para Multiplicação</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            " pl-3 text-left font-normal",
                                            !field.value &&
                                            "text-muted-foreground",
                                          )}
                                        >
                                          {field.value ? (
                                            dayjs(field.value)
                                              .subtract(3, "hours")
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
                                      className="w-auto flex p-0"
                                      align="start"
                                    >
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
                          {/* Supervisao */}
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="supervisao"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Supervisão</FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      handleSupervisaoSelecionada(value)
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue className="text-muted-foreground" placeholder="Selecione uma supervisão" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {supervisoesAll?.map((supervisao) => (
                                        <SelectItem key={supervisao.id} value={supervisao.id}>
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
                          {/* Lider */}
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="lider"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Líder</FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione um Líder" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {supervisaoSelecionada && usersSupervisaoSelecionada?.map((lider) => (
                                        <SelectItem key={lider.id} value={lider.id}>
                                          {lider.first_name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {/* Selecao de Membros */}
                          <div className="sm:col-span-8">
                            <FormField
                              control={form.control}
                              name="membros"
                              render={({ field }) => (
                                <FormItem className="flex flex-col space-y-2">
                                  <FormLabel>Membros</FormLabel>
                                  <ComboboxDemo
                                    items={usersSupervisaoSelecionada}
                                    selectedItems={field.value || []}
                                    setSelectedItems={(val) => field.onChange(val)} // Atualiza o valor selecionado
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="sm:col-span-8 my-3">
                            <Separator />
                          </div>
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="cep"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cep</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Digite o Cep"
                                      maxLength={9}
                                      onKeyUp={(e) => handleZipCode(e, form.setValue)}
                                      {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="cidade"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cidade</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="estado"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Estado</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="bairro"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bairro</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="sm:col-span-6">
                            <FormField
                              control={form.control}
                              name="endereco"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Endereço</FormLabel>
                                  <FormControl>
                                    <Input id="endereco" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <FormField
                              control={form.control}
                              name="numero_casa"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nº</FormLabel>
                                  <FormControl>
                                    <Input id="numero_casa" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        {/* Botões para submeter Forms */}
                        <div className="flex items-center w-full sm:justify-end mt-6 gap-x-6">
                          <Button
                            type="submit"
                            className="px-3 py-2 text-sm w-full font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                          >
                            {isPending ?
                              (
                                <div className="flex justify-between items-center gap-2">
                                  Salvando
                                  <Spinner />
                                </div>
                              )
                              :
                              (<span>Salvar</span>)
                            }
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
