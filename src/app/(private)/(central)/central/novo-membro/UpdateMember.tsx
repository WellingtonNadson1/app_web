'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BASE_URL_LOCAL } from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { cn } from '@/lib/utils';
import { useData } from '@/providers/providers';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { PencilSimple, Spinner } from '@phosphor-icons/react/dist/ssr';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import type { TUser } from './table-users/schema';
import { handleCPFNumber, handlePhoneNumber } from './utils';
import dayjs from 'dayjs';
import { TimePicker } from '@/components/timer-picker-input/time-picker';
import { handleZipCode } from '@/functions/zipCodeUtils';
import { Separator } from '@/components/ui/separator';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CheckIcon } from 'lucide-react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

// Schema dinâmico para validação
const updateUserSchema = z
  .object({
    first_name: z.string().min(1, 'Nome é obrigatório'),
    last_name: z.string().min(1, 'Sobrenome é obrigatório'),
    email: z.string().email('Email inválido'),
    telefone: z.string().min(10, 'Telefone inválido'),
    cpf: z.string().optional(),
    date_nascimento: z.date().optional(),
    escolaridade: z
      .enum([
        'sem_escolaridade',
        'fundamental_incompleto',
        'fundamental_completo',
        'medio_incompleto',
        'medio_completo',
        'superior_incompleto',
        'superior_completo',
        'pos_graduado',
        'mestre',
        'doutor',
      ])
      .optional(),
    profissao: z.string().optional(),
    sexo: z.enum(['M', 'F'], { required_error: 'Sexo é obrigatório' }),
    batizado: z.boolean(),
    date_batizado: z.date().optional(),
    is_discipulado: z.boolean(),
    discipuladorId: z.string().uuid().optional(),
    discipulador: z
      .array(
        z.object({
          user_discipulador: z.object({
            first_name: z.string(),
            id: z.string().uuid(),
          }),
        }),
      )
      .optional(),
    escolas: z
      .array(z.object({ id: z.string().uuid(), nome: z.string() }))
      .optional(),
    encontros: z
      .array(z.object({ id: z.string().uuid(), nome: z.string() }))
      .optional(),
    situacao_no_reino: z
      .string()
      .uuid({ message: 'Situação no Reino é obrigatória' }),
    cargo_de_lideranca: z
      .string()
      .uuid({ message: 'Cargo de Liderança é obrigatório' }),
    estado_civil: z.enum(
      ['solteiro', 'casado', 'divorciado', 'uniao_estavel', 'viuvo'],
      { required_error: 'Estado Civil é obrigatório' },
    ),
    has_filho: z.boolean(),
    quantidade_de_filho: z
      .number()
      .optional()
      .refine((val) => val === undefined || val >= 0, 'Quantidade inválida'),
    cep: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    bairro: z.string().optional(),
    endereco: z.string().optional(),
    numero_casa: z.string().optional(),
    supervisao_pertence: z
      .string()
      .uuid({ message: 'Supervisão é obrigatória' }),
    celula: z.string().uuid().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.has_filho && !data.quantidade_de_filho) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['quantidade_de_filho'],
        message: 'Quantidade de filhos é obrigatória se tem filhos',
      });
    }
    if (data.batizado && !data.date_batizado) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['date_batizado'],
        message: 'Data do batismo é obrigatória se batizado',
      });
    }
  });

type UpdateUserForm = z.infer<typeof updateUserSchema>;

function UpdateMember({ member }: { member: TUser }) {
  console.log('member clicado:', member);
  const { data: session } = useSession();
  const token = session?.user?.token as string;
  const axiosAuth = useAxiosAuth(token);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: dataAllCtx } = useData();
  const supervisoes = dataAllCtx?.combinedData[0] || [];
  const escolas = dataAllCtx?.combinedData[1] || [];
  const encontros = dataAllCtx?.combinedData[2] || [];
  const situacoesNoReino = dataAllCtx?.combinedData[3] || [];
  const cargoLideranca = dataAllCtx?.combinedData[4] || [];
  const escolaridadeOptions = [
    { label: 'Sem Escolaridade', value: 'sem_escolaridade' },
    { label: 'Fundamental Incompleto', value: 'fundamental_incompleto' },
    { label: 'Fundamental Completo', value: 'fundamental_completo' },
    { label: 'Médio Incompleto', value: 'medio_incompleto' },
    { label: 'Médio Completo', value: 'medio_completo' },
    { label: 'Superior Incompleto', value: 'superior_incompleto' },
    { label: 'Superior Completo', value: 'superior_completo' },
    { label: 'Pós Graduado', value: 'pos_graduado' },
    { label: 'Mestre', value: 'mestre' },
    { label: 'Doutor', value: 'doutor' },
  ];

  const [open, setOpen] = useState(false);
  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState(
    member.supervisao_pertence?.id || '',
  );

  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      first_name: member.first_name || '',
      last_name: member.last_name || '',
      email: member.email || '',
      telefone: member.telefone || '',
      cpf: member.cpf || '',
      date_nascimento: member.date_nascimento
        ? new Date(member.date_nascimento)
        : undefined,
      escolaridade: member.escolaridade || undefined,
      profissao: member.profissao || '',
      sexo: member.sexo || 'M',
      batizado: member.batizado || false,
      date_batizado: member.date_batizado
        ? new Date(member.date_batizado)
        : undefined,
      is_discipulado: member.is_discipulado || false,
      discipuladorId:
        member?.discipulador?.[0]?.user_discipulador?.id || undefined,
      escolas: member.escolas || [],
      encontros: member.encontros || [],
      situacao_no_reino: member.situacao_no_reino?.id || '',
      cargo_de_lideranca: member.cargo_de_lideranca?.id || '',
      estado_civil: member.estado_civil || 'solteiro',
      has_filho: member.has_filho || false,
      quantidade_de_filho: member.quantidade_de_filho || undefined,
      cep: member.cep || '',
      cidade: member.cidade || '',
      estado: member.estado || '',
      bairro: member.bairro || '',
      endereco: member.endereco || '',
      numero_casa: member.numero_casa || '',
      supervisao_pertence: member.supervisao_pertence?.id || '',
      celula: member.celula?.id || undefined,
    },
  });

  // Busca de todos os membros para o campo discipulador
  const fetchMembers = async () => {
    const { data } = await axiosAuth.get(`${BASE_URL_LOCAL}/users`);
    return data;
  };

  const { data: allMembers, isLoading: isLoadingMembers } = useQuery<TUser[]>({
    queryKey: ['allMembers'],
    queryFn: fetchMembers,
    enabled: !!token,
  });

  const membrosSortedForName = allMembers?.sort((a, b) =>
    a.first_name.localeCompare(b.first_name),
  );

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateUserForm) =>
      axiosAuth.put(`${BASE_URL_LOCAL}/users/${member.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', 'allMembers'] });
      toast.success('Membro atualizado com sucesso!');
      setOpen(false);
      router.refresh();
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['members', 'allMembers'] });
      toast.error('Falha ao atualizar membro.');
      console.error(error);
    },
  });

  const onSubmit = (data: UpdateUserForm) => {
    mutate(data);
  };

  const celulasFiltradas =
    //@ts-ignore
    supervisoes.find((s) => s.id === supervisaoSelecionada)?.celulas || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="flex justify-between"
        >
          Editar <PencilSimple size={18} />
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Editar Membro</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="my-2">
              <h2 className="mb-2 text-sm text-gray-400 uppercase">
                Informações Pessoais
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          onKeyUp={handlePhoneNumber}
                          maxLength={14}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
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
                <FormField
                  control={form.control}
                  name="date_nascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? dayjs(field.value).format('DD/MM/YYYY')
                                : 'Selecione'}
                              <CalendarIcon className="ml-auto h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="escolaridade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escolaridade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {escolaridadeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profissao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissão</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Informações do Reino */}
            <div className="my-2">
              <h2 className="mb-2 text-sm text-gray-400 uppercase">
                Informações do Reino
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <FormField
                  control={form.control}
                  name="batizado"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel className="mr-2">Batizado?</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('batizado') && (
                  <FormField
                    control={form.control}
                    name="date_batizado"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-3">
                        <FormLabel>Data do Batismo</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value
                                  ? dayjs(field.value).format('DD/MM/YYYY')
                                  : 'Selecione'}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
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
                )}
                <FormField
                  control={form.control}
                  name="is_discipulado"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel className="mr-2">Discipulado?</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discipuladorId"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Discipulador</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value && membrosSortedForName
                                ? `${membrosSortedForName.find((membro) => membro.id === field.value)?.first_name} ${membrosSortedForName.find((membro) => membro.id === field.value)?.last_name}`
                                : isLoadingMembers
                                  ? 'Carregando...'
                                  : 'Selecione um discipulador'}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Pesquise por nome..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                Nenhum discipulador encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {isLoadingMembers ? (
                                  <CommandItem disabled>
                                    Carregando...
                                  </CommandItem>
                                ) : (
                                  membrosSortedForName?.map((membro) => (
                                    <CommandItem
                                      key={membro.id}
                                      value={`${membro.first_name} ${membro.last_name}`}
                                      onSelect={() => field.onChange(membro.id)}
                                    >
                                      {membro.first_name} {membro.last_name}
                                      <CheckIcon
                                        className={cn(
                                          'ml-auto h-4 w-4',
                                          field.value === membro.id
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                    </CommandItem>
                                  ))
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="escolas"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Escolas Feitas</FormLabel>
                      <div className="space-y-2">
                        {
                          //@ts-ignore
                          escolas.map((escola) => (
                            <div
                              key={escola.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                checked={field.value?.some(
                                  (e) => e.id === escola.id,
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      escola,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        (e) => e.id !== escola.id,
                                      ),
                                    );
                                  }
                                }}
                              />
                              <span>{escola.nome}</span>
                            </div>
                          ))
                        }
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="encontros"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Encontros Participados</FormLabel>
                      <div className="space-y-2">
                        {
                          //@ts-ignore
                          encontros.map((encontro) => (
                            <div
                              key={encontro.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                checked={field.value?.some(
                                  (e) => e.id === encontro.id,
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      encontro,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
                                        (e) => e.id !== encontro.id,
                                      ),
                                    );
                                  }
                                }}
                              />
                              <span>{encontro.nome}</span>
                            </div>
                          ))
                        }
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="situacao_no_reino"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Situação no Reino</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            //@ts-ignore
                            situacoesNoReino.map((situacao) => (
                              <SelectItem key={situacao.id} value={situacao.id}>
                                {situacao.nome}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cargo_de_lideranca"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Cargo de Liderança</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            //@ts-ignore
                            cargoLideranca.map((cargo) => (
                              <SelectItem key={cargo.id} value={cargo.id}>
                                {cargo.nome}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Supervisão e Célula */}
            <div className="my-2">
              <h2 className="mb-2 text-sm text-gray-400 uppercase">
                Supervisão e Célula
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="supervisao_pertence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supervisão</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSupervisaoSelecionada(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            //@ts-ignore
                            supervisoes.map((supervisao) => (
                              <SelectItem
                                key={supervisao.id}
                                value={supervisao.id}
                              >
                                {supervisao.nome}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="celula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Célula</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            //@ts-ignore
                            celulasFiltradas.map((celula) => (
                              <SelectItem key={celula.id} value={celula.id}>
                                {celula.nome}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Informações Conjugais */}
            <div className="my-2">
              <h2 className="mb-2 text-sm text-gray-400 uppercase">
                Informações Conjugais
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="estado_civil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado Civil</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                          <SelectItem value="casado">Casado(a)</SelectItem>
                          <SelectItem value="divorciado">
                            Divorciado(a)
                          </SelectItem>
                          <SelectItem value="uniao_estavel">
                            União Estável
                          </SelectItem>
                          <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="has_filho"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mr-2">Tem Filho(s)?</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('has_filho') && (
                  <FormField
                    control={form.control}
                    name="quantidade_de_filho"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de Filho(s)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <Separator />

            {/* Endereço */}
            <div className="my-2">
              <h2 className="mb-2 text-sm text-gray-400 uppercase">Endereço</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input
                          onKeyUp={(e) => handleZipCode(e, form.setValue)}
                          maxLength={9}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numero_casa"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-1">
                      <FormLabel>Nº</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Botões */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Spinner className="animate-spin" /> : 'Atualizar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateMember;
