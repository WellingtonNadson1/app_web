'use client';
import { TimePicker } from '@/components/timer-picker-input/time-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { BASE_URL } from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { cn } from '@/lib/utils';
import { Disclosure } from '@headlessui/react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckFat, Warning } from '@phosphor-icons/react';
import { Spinner } from '@phosphor-icons/react/dist/ssr';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ChevronUpIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import {
  DiscipuloOfSupervisor,
  dataSchemaCreateDiscipulado,
  dataSchemaReturnCreateDiscipulado,
} from './schema';

dayjs.extend(utc);
dayjs.extend(timezone);

interface PropsForm {
  supervisor_id: string;
  discipulador_name: string;
  membro: DiscipuloOfSupervisor;
}

export default function FormFirstDiscipuladoSupervisor(membro: PropsForm) {
  const queryClient = useQueryClient();
  const [registeredDate, setRegisteredDate] = useState<Date | null>(null);

  const dataOcorreu = dayjs(membro?.membro?.discipulado[0]?.data_ocorreu)
    .add(3, 'hour')
    .toISOString();

  const form = useForm<z.infer<typeof dataSchemaCreateDiscipulado>>({
    resolver: zodResolver(dataSchemaCreateDiscipulado),
    defaultValues: {
      data_ocorreu: membro?.membro?.discipulado[0]
        ? new Date(dataOcorreu)
        : undefined, // Se já existe uma data registrada, coloca como default
    },
  });

  const isRegistered = Boolean(membro?.membro?.discipulado[0]?.data_ocorreu); // Checa se já foi registrado

  const { data: session } = useSession();
  const token = session?.user?.token as string;
  const axiosAuth = useAxiosAuth(token);
  const URLCreateNewDiscipulado = `${BASE_URL}/discipuladosibb`;

  const discipulador = membro?.discipulador_name || 'Sem Registro';
  const discipulador_id = membro?.supervisor_id;
  const quantidade_discipulado = membro?.membro?._count?.discipulado || 0;

  const discipulo_id = membro?.membro?.user_discipulos.id;

  useEffect(() => {
    form.setValue('usuario_id', discipulo_id);
    form.setValue('discipulador_id', discipulador_id);
  }, [form, discipulo_id, discipulador_id]);

  // Register New Discipulado
  const CreateDiscipuladoFunction = async (
    dataForm: z.infer<typeof dataSchemaCreateDiscipulado>,
  ) => {
    // ADAPTANDO HORARIO DEVIDO AO FUSO DO SERVIDOR
    const data_discipulado1 = dayjs(dataForm.data_ocorreu)
      .subtract(3, 'hour')
      .toISOString();

    const data_ocorreu = new Date(data_discipulado1);

    const data = { ...dataForm, data_ocorreu };

    try {
      const response: dataSchemaReturnCreateDiscipulado = await axiosAuth.post(
        URLCreateNewDiscipulado,
        data,
      );
      toast({
        title: 'Sucesso!!!',
        description: '1º Discipulado Registrado! 🥳',
      });
      form.reset();
      return response;
    } catch (error) {
      toast({
        title: 'Erro!!!',
        description: 'Error no registro do Discipulado! 😰',
        variant: 'destructive',
      });
    }
  };

  const {
    mutateAsync: createDiscipuladoFn,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: CreateDiscipuladoFunction,
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newMember, context) => {
      // errorCadastro('⛔ error no registro do Discipulado')
      queryClient.invalidateQueries({
        queryKey: ['dataRegisterAllDiscipuladoCell'],
      });
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['dataRegisterAllDiscipuladoCell'],
      });
    },
  });

  const onSubmitFirstDiscipulado = async (
    data: z.infer<typeof dataSchemaCreateDiscipulado>,
  ) => {
    const result = await createDiscipuladoFn(data);
    if (result) {
      setRegisteredDate(data.data_ocorreu); // Armazena a data registrada no estado
    }
    return result;
  };

  return (
    <Fragment>
      <Toaster />
      <Disclosure>
        {({ open }) => (
          <Fragment>
            <ToastContainer />
            <Disclosure.Button
              className={cn(
                'flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg bg-red-50 ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75',
                `${quantidade_discipulado >= 1 ? 'bg-green-50 ring-1 ring-green-100' : 'bg-red-50 ring-1 ring-blue-100'}`,
              )}
            >
              <span className="flex items-center justify-start gap-2 truncate sm:gap-4">
                1º Discipulado do Mês{' '}
                {quantidade_discipulado >= 1 ? (
                  <CheckFat size={16} color="#15803d" />
                ) : (
                  <Warning size={16} color="#dc2626" />
                )}
              </span>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
              />
            </Disclosure.Button>
            {quantidade_discipulado >= 1 ? (
              <Disclosure.Panel
                aria-disabled={true}
                className="w-full px-2 pt-4 pb-2 text-sm text-gray-500 sm:flex sm:flex-col"
              >
                <div className="flex items-center justify-between mb-3 text-slate-400">
                  <h2>Discipulador(a):</h2>
                  <div className="flex items-center justify-start">
                    <h2 className={cn(`ml-4`)}>{discipulador}</h2>
                  </div>
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmitFirstDiscipulado)}
                    aria-disabled
                    key={discipulo_id}
                    id={discipulo_id}
                  >
                    <FormField
                      control={form.control}
                      name="usuario_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              key={discipulo_id}
                              type="hidden"
                              value={discipulo_id}
                              disabled={isRegistered}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discipulador_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              key={discipulo_id + discipulador_id}
                              type="hidden"
                              value={discipulador_id}
                              disabled={isRegistered}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      disabled
                      control={form.control}
                      name="data_ocorreu"
                      render={({ field }) => (
                        <FormItem aria-disabled className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    ' pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                  disabled={isRegistered}
                                >
                                  {field.value || registeredDate ? (
                                    dayjs(field.value || registeredDate)
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
                              aria-disabled
                              className="w-auto sm:flex p-0"
                              align="start"
                            >
                              <Calendar
                                disabled={isSuccess}
                                mode="single"
                                selected={field.value || registeredDate}
                                onSelect={field.onChange}
                                initialFocus
                                disableNavigation={isSuccess}
                              />
                              <div className="p-3 border-t border-border">
                                <TimePicker
                                  setDate={field.onChange}
                                  date={field.value || registeredDate}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      disabled={isRegistered || isPending}
                      className="mt-4 w-full bg-btnIbb hover:bg-btnIbb hover:opacity-95 transition ease-in"
                      type="submit"
                    >
                      Já Registrado
                    </Button>
                  </form>
                </Form>
              </Disclosure.Panel>
            ) : (
              <Disclosure.Panel className="w-full px-2 pt-4 pb-2 text-sm text-gray-500 sm:flex sm:flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2>Discipulador(a):</h2>
                  <div className="flex items-center justify-start">
                    <h2
                      className={cn(
                        `ml-4`,
                        !discipulador ? `text-red-400` : ``,
                      )}
                    >
                      {discipulador}
                    </h2>
                  </div>
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmitFirstDiscipulado)}
                    aria-disabled
                    key={discipulo_id}
                    id={discipulo_id}
                  >
                    <FormField
                      control={form.control}
                      name="usuario_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              key={discipulo_id}
                              type="hidden"
                              {...field}
                              value={discipulo_id}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discipulador_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              key={discipulo_id + discipulador_id}
                              disabled={isSuccess}
                              type="hidden"
                              {...field}
                              value={discipulador_id}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="data_ocorreu"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    ' pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                  disabled={isSuccess}
                                >
                                  {field.value || registeredDate ? (
                                    dayjs(field.value || registeredDate)
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
                              className="w-auto sm:flex p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value || registeredDate}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={isSuccess}
                              />
                              <div className="p-3 border-t border-border">
                                <TimePicker
                                  setDate={field.onChange}
                                  date={field.value || registeredDate}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      disabled={isRegistered || isPending}
                      className="mt-4 w-full bg-btnIbb hover:bg-btnIbb hover:opacity-95 transition ease-in"
                      type="submit"
                    >
                      {isPending ? (
                        <div className="flex items-center justify-between gap-2">
                          <Spinner className="animate-spin" />
                          Registrando
                        </div>
                      ) : isSuccess ? (
                        'Registrado com sucesso'
                      ) : (
                        'Registrar'
                      )}
                    </Button>
                  </form>
                </Form>
              </Disclosure.Panel>
            )}
          </Fragment>
        )}
      </Disclosure>
    </Fragment>
  );
}
