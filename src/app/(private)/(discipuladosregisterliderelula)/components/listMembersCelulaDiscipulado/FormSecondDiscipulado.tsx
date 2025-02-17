'use client';
import { dataSchemaReturnCreateDiscipulado } from '@/app/(private)/(discipuladosregistersupervisor)/components/listMembersSupervisorDiscipulado/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { BASE_URL } from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { cn } from '@/lib/utils';
import { Disclosure } from '@headlessui/react';
import { CheckFat, Warning } from '@phosphor-icons/react';
import { Spinner } from '@phosphor-icons/react/dist/ssr';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ChevronUpIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Fragment } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { dataCreateDiscipulado, MembroCell } from './schema';

dayjs.extend(utc);
dayjs.extend(timezone);

interface PropsForm {
  membro: MembroCell;
}
export default function FormSecondDiscipulado({ membro }: PropsForm) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user?.token as string;
  const axiosAuth = useAxiosAuth(token);
  const URLCreateNewDiscipulado = `${BASE_URL}/discipuladosibb`;
  const discipulador =
    membro?.discipulador?.[0]?.user_discipulador?.first_name || 'Sem Registro';
  const discipulador_id = membro?.discipulador?.[0]?.user_discipulador?.id;
  const quantidade_discipulado =
    membro?.discipulador?.[0]?._count?.discipulado || 0;

  const isRegistered = Boolean(
    membro?.discipulador[0]?.discipulado[1]?.data_ocorreu,
  ); // Checa se já foi registrado

  const dataOcorreu = dayjs(
    membro?.discipulador[0]?.discipulado[1]?.data_ocorreu,
  )
    .add(3, 'hour')
    .toISOString();

  const { register, handleSubmit, reset } = useForm<dataCreateDiscipulado>({
    defaultValues: {
      data_ocorreu: membro?.discipulador[0]?.discipulado[1]?.data_ocorreu
        ? new Date(dataOcorreu)
        : undefined, // Se já existe uma data registrada, coloca como default
    },
  });

  // Register New Discipulado
  const CreateDiscipuladoFunction = async (dataForm: dataCreateDiscipulado) => {
    try {
      const data: dataSchemaReturnCreateDiscipulado = await axiosAuth.post(
        URLCreateNewDiscipulado,
        dataForm,
      );
      toast({
        title: 'Sucesso!!!',
        description: '2º Discipulado Registrado! 🥳',
      });
      reset();
      return data;
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

  const onSubmitFirstDiscipulado: SubmitHandler<dataCreateDiscipulado> = async (
    data,
  ) => {
    const result = await createDiscipuladoFn(data);
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
                `${quantidade_discipulado >= 2 ? 'bg-green-50 ring-1 ring-green-100' : 'bg-red-50 ring-1 ring-blue-100'}`,
              )}
            >
              <span className="flex items-center justify-start gap-2 truncate sm:gap-4">
                2º Discipulado do Mês{' '}
                {quantidade_discipulado >= 2 ? (
                  <CheckFat size={16} color="#15803d" />
                ) : (
                  <Warning size={16} color="#dc2626" />
                )}
              </span>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
              />
            </Disclosure.Button>
            {quantidade_discipulado >= 2 ? (
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
                <form aria-disabled key={membro.id} id={membro.id}>
                  <input
                    key={membro.id}
                    type="hidden"
                    value={membro.id}
                    {...register(`usuario_id`)}
                  />
                  <input
                    key={membro.id + discipulador_id}
                    type="hidden"
                    value={discipulador_id}
                    {...register(`discipulador_id`)}
                  />
                  {}
                  <Input
                    type="date"
                    disabled
                    placeholder={dayjs.utc(dataOcorreu).format('YYYY-MM-DD')}
                    value={dayjs.utc(dataOcorreu).format('YYYY-MM-DD')}
                    key={membro.id + 7}
                    {...register(`data_ocorreu`, {
                      required: true,
                    })}
                    id="first_discipulado"
                    className="block w-full rounded-md border-0 py-1.5 px-2 mb-4 text-slate-400 text-sm shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                  <Button
                    disabled={isRegistered || isPending}
                    className="mt-4 w-full bg-btnIbb hover:bg-btnIbb hover:opacity-95 transition ease-in"
                    type="submit"
                  >
                    Já Registrado
                  </Button>
                </form>
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
                <form
                  key={membro.id}
                  id={membro.id}
                  onSubmit={handleSubmit(onSubmitFirstDiscipulado)}
                >
                  <input
                    key={membro.id}
                    type="hidden"
                    value={membro.id}
                    {...register(`usuario_id`)}
                  />
                  <input
                    key={membro.id + discipulador_id}
                    type="hidden"
                    value={discipulador_id}
                    {...register(`discipulador_id`)}
                  />
                  <Input
                    type="datetime-local"
                    key={membro.id + 7}
                    disabled={isSuccess}
                    placeholder="Selecione uma data"
                    {...register(`data_ocorreu`, {
                      required: true,
                    })}
                    id="first_discipulado"
                    className={cn(
                      `block w-full text-sm rounded-md border-0 py-1.5 px-2 mb-4 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`,
                    )}
                  />
                  <Button
                    disabled={isPending}
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
              </Disclosure.Panel>
            )}
          </Fragment>
        )}
      </Disclosure>
    </Fragment>
  );
}
