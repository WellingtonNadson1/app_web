'use client';
import { TimePicker } from '@/components/timer-picker-input/time-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { handleZipCode } from '@/functions/zipCodeUtils';
import { BASE_URL } from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { cn } from '@/lib/utils';
import { useData } from '@/providers/providers';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { PencilSimple, Spinner } from '@phosphor-icons/react/dist/ssr';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { TUser } from './table-users/schema';
import { userSchemaTable } from './table-users/schema';
import { handleCPFNumber, handlePhoneNumber } from './utils';
dayjs.extend(utc);
dayjs.extend(timezone);

const estadoCivil = [
  { label: 'Solteiro(a)', value: 'solteiro' },
  { label: 'Casado(a)', value: 'casado' },
  { label: 'Divorciado(a)', value: 'divorciado' },
  { label: 'Uniao Estável', value: 'uniao_estavel' },
  { label: 'Viúvo(a)', value: 'viuvo' },
];
const trueFalse = [
  { label: 'Sim', value: 'true' },
  { label: 'Não', value: 'false' },
];

function UpdateMember({ member }: { member: TUser }) {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth(session?.user?.token as string);
  const URLUsersId = `${BASE_URL}/users/${member.id}`;
  const URLUsers = `${BASE_URL}/users`;

  // Zustand Store
  // @ts-ignore
  const { data: dataAllCtx } = useData();
  console.log('dataAllCtx', dataAllCtx);
  const supervisoes = dataAllCtx?.combinedData[0] || [];

  const escolas = dataAllCtx?.combinedData[1] || [];
  const encontros = dataAllCtx?.combinedData[2];
  const situacoesNoReino = dataAllCtx?.combinedData[3] || [];
  const cargoLideranca = dataAllCtx?.combinedData[4] || [];
  const masculinoFeminino = ['M', 'F'];
  const escolaridade = [
    'Sem Escolaridade',
    'Fundamental Incompleto',
    'Fundamental Completo',
    'Médio Incompleto',
    'Médio Completo',
    'Superior Incompleto',
    'Superior Completo',
    'Pós Graduado',
    'Mestre',
    'Doutor',
  ];
  console.log('supervisoes', supervisoes);
  const [supervisaoSelecionadaUpDate, setSupervisaoSelecionadaUpDate] =
    useState<string>();
  const [isLoadingSubmitUpDate, setIsLoadingSubmitUpDate] = useState(false);
  const [open, setOpen] = useState(false);

  // const { register, handleSubmit, setValue, reset } = useForm<TUser>({
  const form = useForm<TUser>({
    defaultValues: {
      id: member.id,
      role: member.role,
      email: member.email,
      image_url: member.image_url,
      first_name: member.first_name,
      last_name: member.last_name,
      cpf: member.cpf,
      date_nascimento: member.date_nascimento,
      sexo: member.sexo,
      telefone: member.telefone,
      escolaridade: member.escolaridade,
      profissao: member.profissao,
      batizado: Boolean(member.batizado),
      date_batizado: member.date_batizado,
      is_discipulado: member.is_discipulado,
      discipuladorId: member.discipuladorId,
      supervisao_pertence: member.supervisao_pertence,
      bairro: member.bairro,
      cidade: member.cidade,
      estado: member.estado,
      estado_civil: member.estado,
    },
  });

  const cancelButtonRef = useRef(null);
  const router = useRouter();

  // Combobox Autocomplete
  const [queryUpDate, setQueryUpDate] = useState('');

  const handleZipCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
    handleZipCode(e, form.setValue);
  };

  // Funcao para submeter os dados do Formulario Preenchido
  const onSubmit: SubmitHandler<z.infer<typeof userSchemaTable>> = async (
    data,
  ) => {
    console.log('dataToSend', data);

    try {
      const selectedEncontros = data?.encontros?.filter(
        (encontro) => encontro.id !== '',
      );
      const selectedEscolas = data?.escolas?.filter(
        (escola) => escola.id !== '',
      );

      // Verifica se não há encontros selecionados e define o valor como nulo
      const encontrosToSend =
        selectedEncontros && selectedEncontros.length === 0
          ? null
          : selectedEncontros;

      const escolasToSend =
        selectedEscolas && selectedEscolas.length === 0
          ? null
          : selectedEscolas;

      const dataToSend = {
        ...data,
        encontros: encontrosToSend,
        escolas: escolasToSend,
      };

      setIsLoadingSubmitUpDate(true);

      const response = await axiosAuth.put(URLUsersId, dataToSend);
      const result = await response.data;
      if (result) {
        setIsLoadingSubmitUpDate(false);
        toast({
          title: 'Sucesso!!!',
          description: 'Membro atualizado com Sucesso!!! 🥳',
        });
        form.reset();
        router.refresh();
      } else {
        toast({
          title: 'Erro!!!',
          description: 'Erro na Atualização do Membro. 😰',
          variant: 'destructive',
        });
        setIsLoadingSubmitUpDate(false);
      }
    } catch (error) {
      toast({
        title: 'Erro!!!',
        description: 'Erro na Atualização do Membro. 😰',
        variant: 'destructive',
      });
      console.error(error);
      setIsLoadingSubmitUpDate(false);
    }
  };

  const AllMembers = async () => {
    try {
      const { data } = await axiosAuth.get(URLUsers);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  const { data: queryMembers, isLoading: isLoadingQueryUpdate } = useQuery<
    TUser[]
  >({
    queryKey: ['membersquery'],
    queryFn: AllMembers,
    retry: 3,
  });

  const filteredPeople =
    queryUpDate === ''
      ? queryMembers
      : queryMembers?.filter((person) =>
          person.first_name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(queryUpDate.toLowerCase().replace(/\s+/g, '')),
        );

  const handleSupervisaoSelecionada = (supervisao: string) => {
    setSupervisaoSelecionadaUpDate(supervisao);
  };

  //@ts-ignore
  const celulasFiltradas = (supervisoes ?? []).find(
    (supervisao: { id: string | undefined }) =>
      supervisao.id === supervisaoSelecionadaUpDate,
  )?.celulas;

  return isLoadingQueryUpdate ? (
    <Spinner className="animate-spin" />
  ) : (
    <>
      {/* Vou preciar add scroll y para conseguir exibir todo o forms */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <DropdownMenuItem
            className="w-full flex items-center justify-between"
            onSelect={(e) => e.preventDefault()}
          >
            Editar
            <PencilSimple size={18} />
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="lg:max-w-screen-md overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Editar dados do Membro</DialogTitle>
            <DialogDescription>
              Edite os dados preenchendo o formulário
            </DialogDescription>
          </DialogHeader>

          {/* Incio do Forms */}
          <div className="relative w-full px-2 mx-auto ">
            <div className="flex justify-between">
              <div className="relative px-2 mx-auto py-4">
                <div className="p-2 mx-auto bg-white rounded-lg">
                  <Form {...form}>
                    <form
                      className="p-2 overflow-y-scroll max-h-screen"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <div className="pb-12 border-b border-gray-900/10">
                        <h2 className="text-sm leading-normal text-gray-400 uppercase">
                          Informações Pessoais
                        </h2>

                        {/* FIRST NAME */}
                        <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <FormField
                              control={form.control}
                              name="first_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nome aqui" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* LAST NAME */}
                          <div className="sm:col-span-3">
                            <FormField
                              control={form.control}
                              name="last_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sobrenome</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="sobrenome aqui"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* CPF */}
                          <div className="sm:col-span-2">
                            <FormField
                              control={form.control}
                              name="cpf"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>CPF</FormLabel>
                                  <FormControl>
                                    <Input
                                      onKeyUp={handleCPFNumber}
                                      maxLength={14}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Data do Nascimento */}
                          <div className="sm:col-span-2">
                            <FormField
                              control={form.control}
                              name="date_nascimento"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Data de Nascimento</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={'outline'}
                                          className={cn(
                                            ' pl-3 text-left font-normal',
                                            !field.value &&
                                              'text-muted-foreground',
                                          )}
                                        >
                                          {field.value ? (
                                            dayjs(field.value)
                                              .subtract(3, 'hours')
                                              .utc()
                                              .local()
                                              .locale('pt-br')
                                              .format('DD-MM-YYYY HH:mm:ss')
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

                          {/* SEXO */}
                          <div className="sm:col-span-2">
                            <FormField
                              control={form.control}
                              name="sexo"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Sexo</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione um sexo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {masculinoFeminino?.map((sexo) => (
                                        <SelectItem key={sexo} value={sexo}>
                                          {sexo}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* EMAIL */}
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="email"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* TELEFONE */}
                          <div className="sm:col-span-2">
                            <FormField
                              control={form.control}
                              name="telefone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Telefone</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      onKeyUp={handlePhoneNumber}
                                      maxLength={14}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* ESCOLARIDADE */}
                          <div className="sm:col-span-3">
                            <FormField
                              control={form.control}
                              name="escolaridade"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Escolaridade</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue
                                          className="text-muted-foreground"
                                          placeholder="Selecione uma escolaridade"
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {escolaridade?.map((tipoEscolaridade) => (
                                        <SelectItem
                                          key={tipoEscolaridade}
                                          value={tipoEscolaridade}
                                        >
                                          {tipoEscolaridade}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* PROFISSAO */}
                          <div className="sm:col-span-3">
                            <FormField
                              control={form.control}
                              name="profissao"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Profissão</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="profissão aqui"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* INFORMAÇÕES DO REINO */}
                        <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <hr className="h-px mx-0 my-4 bg-transparent border-0 bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                            <h2 className="mt-8 text-sm leading-normal text-gray-400 uppercase">
                              Informações do Reino
                            </h2>
                          </div>

                          {/* Batizado */}
                          <div className="sm:col-span-3">
                            <FormField
                              control={form.control}
                              name="batizado"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>É Batizado?</FormLabel>
                                  <Select onValueChange={field.onChange}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione um opção" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {trueFalse?.map((isBatizado) => (
                                        <SelectItem
                                          key={isBatizado.value}
                                          value={isBatizado.value}
                                        >
                                          {isBatizado.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Data do Batizado */}
                          <div className="sm:col-span-3">
                            <FormField
                              control={form.control}
                              name="date_batizado"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Data do Batizado</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={'outline'}
                                          className={cn(
                                            ' pl-3 text-left font-normal',
                                            !field.value &&
                                              'text-muted-foreground',
                                          )}
                                        >
                                          {field.value ? (
                                            dayjs(field.value)
                                              .subtract(3, 'hours')
                                              .utc()
                                              .local()
                                              .locale('pt-br')
                                              .format('DD-MM-YYYY HH:mm:ss')
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

                          {/* Is Discipulado */}
                          <div className="sm:col-span-2">
                            <FormField
                              control={form.control}
                              name="is_discipulado"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>É Discipulado?</FormLabel>
                                  <Select onValueChange={field.onChange}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione um culto" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {trueFalse?.map((isDiscipulado) => (
                                        <SelectItem
                                          key={isDiscipulado.value}
                                          value={isDiscipulado.value}
                                        >
                                          {isDiscipulado.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <div className="space-y-2 flex flex-col">
                              <FormField
                                control={form.control}
                                name="discipuladorId"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Discipulador</FormLabel>
                                    <Popover modal>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                              'w-full justify-between',
                                              !field.value &&
                                                'text-muted-foreground',
                                            )}
                                          >
                                            {field.value
                                              ? filteredPeople?.find(
                                                  (membro) =>
                                                    membro.id === field.value,
                                                )?.first_name
                                              : 'Selecione discipulador'}
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-full p-0">
                                        <Command>
                                          <CommandInput
                                            placeholder="Pesquise discipulador..."
                                            className="h-9"
                                          />
                                          <CommandList>
                                            <ScrollArea className="h-56 overflow-y-auto">
                                              <CommandEmpty>
                                                Discipulador não encontrado.
                                              </CommandEmpty>
                                              <CommandGroup>
                                                {filteredPeople?.map(
                                                  (membro) => (
                                                    <CommandItem
                                                      value={membro.first_name}
                                                      key={membro.id}
                                                      onSelect={() => {
                                                        form.setValue(
                                                          'discipuladorId',
                                                          membro.id,
                                                        );
                                                      }}
                                                    >
                                                      {membro.first_name}
                                                      <CheckIcon
                                                        className={cn(
                                                          'ml-auto h-4 w-4',
                                                          membro.id ===
                                                            field.value
                                                            ? 'opacity-100'
                                                            : 'opacity-0',
                                                        )}
                                                      />
                                                    </CommandItem>
                                                  ),
                                                )}
                                              </CommandGroup>
                                            </ScrollArea>
                                          </CommandList>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          {/* SUPERVISAO PERTENCE */}
                          <div className="sm:col-span-3">
                            <FormField
                              control={form.control}
                              name="supervisao_pertence.id"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Supervisão</FormLabel>
                                  <Select
                                    onValueChange={() =>
                                      handleSupervisaoSelecionada(field.value)
                                    }
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione um culto" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {supervisoes ? (
                                        // @ts-ignore
                                        (supervisoes ?? []).map(
                                          // @ts-ignore
                                          (supervisao) => (
                                            <SelectItem
                                              key={supervisao.id}
                                              value={supervisao.id}
                                            >
                                              {supervisao.nome}
                                            </SelectItem>
                                          ),
                                        )
                                      ) : (
                                        <SelectItem value={''}>
                                          Carregando...
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* CELULA */}
                          <div className="sm:col-span-3">
                            <FormField
                              control={form.control}
                              name="celula.id"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Célula</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma célula" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {supervisoes ? (
                                        // @ts-ignore
                                        (celulasFiltradas ?? []).map(
                                          // @ts-ignore
                                          (celula) => (
                                            <SelectItem
                                              key={celula.id}
                                              value={celula.id}
                                            >
                                              {celula.nome}
                                            </SelectItem>
                                          ),
                                        )
                                      ) : (
                                        <SelectItem value={''}>
                                          Carregando...
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Escolas Realizadas */}
                        <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                          <div className="mt-3 sm:col-span-6">
                            <FormField
                              control={form.control}
                              name="escolas"
                              render={() => (
                                <FormItem>
                                  <div className="mb-4">
                                    <FormLabel className="text-base">
                                      Escolas
                                    </FormLabel>
                                  </div>
                                  {//@ts-ignore
                                  escolas?.map((escola) => (
                                    <FormField
                                      key={escola.id}
                                      control={form.control}
                                      name="escolas"
                                      render={({ field }) => {
                                        const isChecked = field.value?.some(
                                          (value) => value.id === escola.id,
                                        );
                                        return (
                                          <div
                                            key={escola.id + 1}
                                            className="flex"
                                          >
                                            <FormItem
                                              key={escola.id}
                                              className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                              <FormControl>
                                                <Checkbox
                                                  checked={isChecked}
                                                  onCheckedChange={(
                                                    checked,
                                                  ) => {
                                                    return checked
                                                      ? field.onChange([
                                                          ...field.value,
                                                          escola,
                                                        ])
                                                      : field.onChange(
                                                          field.value?.filter(
                                                            (value) =>
                                                              value.id !==
                                                              escola.id,
                                                          ),
                                                        );
                                                  }}
                                                />
                                              </FormControl>
                                              <FormLabel className="text-sm font-normal">
                                                {escola.nome}
                                              </FormLabel>
                                            </FormItem>
                                          </div>
                                        );
                                      }}
                                    />
                                  ))}
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Econtros Realizados */}
                        <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                          <div className="mt-3 sm:col-span-3">
                            <fieldset>
                              <legend className="block text-sm font-medium leading-6 text-slate-700">
                                Encontros Participados
                              </legend>
                              <div className="flex flex-wrap items-center justify-between w-full mt-4 gap-x-8">
                                {supervisoes ? (
                                  // @ts-ignore
                                  encontros?.map((encontro) => (
                                    <div
                                      key={encontro.id}
                                      className="relative flex gap-x-3"
                                    >
                                      <div className="flex items-center h-6">
                                        <input
                                          {...form.register('encontros')}
                                          value={encontro.id}
                                          id={encontro.id}
                                          type="checkbox"
                                          className="w-4 h-4 text-blue-600 border-gray-300 rounded shadow-sm focus:ring-blue-600"
                                        />
                                      </div>
                                      <div className="text-sm leading-6">
                                        <label
                                          htmlFor={encontro.id}
                                          className="font-medium text-slate-700"
                                        >
                                          {encontro.nome}
                                        </label>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p>Carregando...</p>
                                )}
                              </div>
                            </fieldset>
                          </div>

                          {/* Situação No reino */}
                          <div className="mt-3 ml-2 sm:col-span-3">
                            <FormField
                              control={form.control}
                              name="situacao_no_reino.id"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Sitação no Reino</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione um sexo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {//@ts-ignore
                                      situacoesNoReino?.map((situacao) => (
                                        <SelectItem
                                          key={situacao.id}
                                          value={situacao.id}
                                        >
                                          {situacao.nome}
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
                        <div className="grid grid-cols-1 mt-3 gap-x-4 gap-y-6 sm:grid-cols-6">
                          <div className="col-span-6">
                            <FormField
                              control={form.control}
                              name="cargo_de_lideranca.id"
                              render={({ field }) => (
                                <FormItem className="flex flex-col mt-4">
                                  <FormLabel>Sitação no Reino</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma situação" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {//@ts-ignore
                                      cargoLideranca?.map((cargo) => (
                                        <SelectItem
                                          key={cargo.id}
                                          value={cargo.id}
                                        >
                                          {cargo.nome}
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

                        {/* INFORMAÇÕES CONJUGAIS */}
                        <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <hr className="h-px mx-0 my-4 bg-transparent border-0 bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                            <h2 className="mt-8 text-sm leading-normal text-gray-400 uppercase">
                              Informações Conjugais
                            </h2>
                          </div>

                          <div className="sm:col-span-2">
                            <FormField
                              control={form.control}
                              name="estado_civil"
                              render={({ field }) => (
                                <FormItem className="flex flex-col mt-3">
                                  <FormLabel>Estado Civil</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione um estado" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {estadoCivil?.map((estadoCivil) => (
                                        <SelectItem
                                          key={estadoCivil.value}
                                          value={estadoCivil.value}
                                        >
                                          {estadoCivil.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="nome_conjuge"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome Côunjuge</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nome aqui" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <FormField
                              control={form.control}
                              name="date_casamento"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Data do Casamento</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={'outline'}
                                          className={cn(
                                            ' pl-3 text-left font-normal',
                                            !field.value &&
                                              'text-muted-foreground',
                                          )}
                                        >
                                          {field.value ? (
                                            dayjs(field.value)
                                              .subtract(3, 'hours')
                                              .utc()
                                              .local()
                                              .locale('pt-br')
                                              .format('DD-MM-YYYY HH:mm:ss')
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

                          <div className="sm:col-span-2">
                            <FormField
                              control={form.control}
                              name="has_filho"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Tem Filho(s)?</FormLabel>
                                  <Select onValueChange={field.onChange}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione um opção" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {trueFalse?.map((hasChild) => (
                                        <SelectItem
                                          key={hasChild.value}
                                          value={hasChild.value}
                                        >
                                          {hasChild.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <FormField
                              control={form.control}
                              name="quantidade_de_filho"
                              render={({ field }) => (
                                <FormItem className="space-y-2 flex flex-col">
                                  <FormLabel>Qntd. Filho(s)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="qnt aqui"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Informações para Visita */}
                        <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <hr className="h-px mx-0 my-4 bg-transparent border-0 bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                            <h2 className="mt-8 text-sm leading-normal text-gray-400 uppercase">
                              Endereço para Visita/Contato
                            </h2>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 mt-3 gap-x-4 gap-y-6 sm:grid-cols-6">
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="cep"
                              className="block text-sm font-medium leading-6 text-slate-700"
                            >
                              Cep
                            </label>
                            <div className="mt-3">
                              <input
                                {...form.register('cep')}
                                type="text"
                                id="cep"
                                onKeyUp={handleZipCodeChange}
                                maxLength={9}
                                className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="cidade"
                              className="block text-sm font-medium leading-6 text-slate-700"
                            >
                              Cidade
                            </label>
                            <div className="mt-3">
                              <input
                                {...form.register('cidade')}
                                type="text"
                                id="cidade"
                                className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="estado"
                              className="block text-sm font-medium leading-6 text-slate-700"
                            >
                              Estado
                            </label>
                            <div className="mt-3">
                              <input
                                {...form.register('estado')}
                                type="text"
                                id="estado"
                                autoComplete="address-level1"
                                className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 mt-3 gap-x-4 gap-y-6 sm:grid-cols-6">
                          <div className="col-span-2">
                            <label
                              htmlFor="bairro"
                              className="block text-sm font-medium leading-6 text-slate-700"
                            >
                              Bairro
                            </label>
                            <div className="mt-3">
                              <input
                                {...form.register('bairro')}
                                type="text"
                                id="bairro"
                                className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label
                              htmlFor="endereco"
                              className="block text-sm font-medium leading-6 text-slate-700"
                            >
                              Endereço
                            </label>
                            <div className="mt-3">
                              <input
                                {...form.register('endereco')}
                                type="text"
                                id="endereco"
                                className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                          <div className="col-span-1">
                            <label
                              htmlFor="numero_casa"
                              className="block text-sm font-medium leading-6 text-slate-700"
                            >
                              Nº
                            </label>
                            <div className="mt-3">
                              <input
                                {...form.register('numero_casa')}
                                type="text"
                                id="numero_casa"
                                className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botões para submeter Forms */}
                      <div className="flex items-center justify-end mt-6 gap-x-6">
                        <Button
                          type="button"
                          ref={cancelButtonRef}
                          onClick={() => setOpen(false)}
                          className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:px-3 hover:py-2 hover:text-gray-900 sm:mt-0 sm:w-auto"
                        >
                          Cancelar
                        </Button>
                        {isLoadingSubmitUpDate ? (
                          <Button
                            type="submit"
                            disabled={isLoadingSubmitUpDate}
                            className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
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
                            <span>Atualizando...</span>
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                          >
                            <span>Atualizar</span>
                          </Button>
                        )}
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

export default UpdateMember;
