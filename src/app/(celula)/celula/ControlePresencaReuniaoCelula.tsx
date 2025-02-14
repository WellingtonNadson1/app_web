/* eslint-disable camelcase */
'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BASE_URL, errorCadastro, success } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserFocus } from '@phosphor-icons/react'
import { Spinner } from '@phosphor-icons/react/dist/ssr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  CelulaProps,
  CelulaSort,
  attendanceReuniaCelulaSchema,
  attendanceReuniaoCelula,
  reuniaoCelulaData2,
  reuniaoCelulaUpdate,
  reuniaoCelulaUpdateSchema,
} from './schema'
import { z } from 'zod'

dayjs.extend(utc)
dayjs.extend(timezone)

interface UpdateDataParams {
  URL: string
  newData: reuniaoCelulaUpdate
  token: string | undefined
}

// Função assíncrona para fazer a requisição PUT com Bearer Token
async function updateData({ URL, newData, token }: UpdateDataParams) {
  const response = await fetch(URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newData),
  })

  if (!response.ok) {
    throw new Error('Failed to update data')
  }
  return response.json()
}

export default function ControlePresencaReuniaoCelula({
  celulaId,
  dataCelula,
}: {
  celulaId: string
  dataCelula: CelulaProps
}) {
  const { data: session } = useSession()
  const [reuniaoRegisteredId, setReuniaRegisteredId] = useState('')
  const URLPresencaReuniaoCelulaIsRegiter = `${BASE_URL}/presencareuniaocelulas/isregister/${reuniaoRegisteredId}`
  const [celulaSort, setCelulaSort] = useState<CelulaSort>([]);
  const { handleSubmit, register, setValue } = useForm<attendanceReuniaoCelula>({
    resolver: zodResolver(attendanceReuniaCelulaSchema),
    defaultValues: {
      which_reuniao_celula: reuniaoRegisteredId,
    },
  });
  const axiosAuth = useAxiosAuthToken(session?.user?.token as string)
  const [successRegisterPresence, setSuccessRegisterPresence] = useState(false);

  const token = session?.user?.token

  const queryClient = useQueryClient()

  const memoizedDataHoje = useMemo(() => dayjs(), [])
  const memoizedDataHojeString = memoizedDataHoje
    .tz('America/Sao_Paulo', true)
    .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')

  const status = 'Marcado'
  const celula = celulaId
  const data_reuniao = memoizedDataHojeString
  const presencas_membros_reuniao_celula = null

  useEffect(() => {
    const celulaSortable = dataCelula?.membros.sort((a, b) =>
      a.first_name.localeCompare(b.first_name)
    );
    setCelulaSort(celulaSortable);

    setValue(`which_reuniao_celula`, reuniaoRegisteredId);
    console.log('reuniaoRegisteredId', reuniaoRegisteredId);

    if (celulaSortable) {
      celulaSortable.forEach((member, index) => {
        setValue(`membro.${index}.id`, member.id);
        setValue(`membro.${index}.status`, 'false');
      });
    }
  }, [celulaId, dataCelula?.membros, reuniaoRegisteredId]);

  const createReuniaoCelula = async (
    dataSend: reuniaoCelulaData2 | undefined
  ) => {
    console.log('dataSend', dataSend);
    try {
      const response = await axiosAuth.post(
        `${BASE_URL}/reunioessemanaiscelulas`,
        dataSend
      );
      const newId = response?.data?.id;
      setReuniaRegisteredId(newId);
      setValue(`which_reuniao_celula`, newId); // Atualiza o valor aqui
  
      console.log('Criado reuniao', response.data);
      return response.data;
    } catch (error) {
      console.log('Erro ao criar reuniao', error);
      const axiosError = error as AxiosError;
      console.log('axiosError', axiosError?.response?.data);
      if (axiosError?.response) {
        const errorResponseData = axiosError?.response?.data;
        //@ts-ignore
        const id = errorResponseData.id as unknown as string;
        setReuniaRegisteredId(id);
        setValue(`which_reuniao_celula`, id); // Atualiza o valor aqui
  
        console.debug('Reunião já existente:', id);
      }
    }
  };
  

  const { data: dataMutate, mutate: createReuniao, isPending: isPendingCreateReunia } = useMutation({
    mutationFn: createReuniaoCelula,
    mutationKey: ['NewReuniaodeCelulaCreate'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['NewReuniaodeCelulaCreate'] });
    },
    onError: (error: AxiosError) => {
      console.error('Erro ao criar reunião:', error);
    },
  });

  useEffect(() => {
    const normalizedDate = dayjs()
      .tz('America/Sao_Paulo', true) // Aplica o fuso corretamente
      .startOf('day')
      .format('YYYY-MM-DD');

    console.log('normalizedDate', normalizedDate);
    const dataSend = {
      status: 'Marcado',
      celula: celulaId,
      data_reuniao: normalizedDate,
      presencas_membros_reuniao_celula: null,
    };
    createReuniao(dataSend);
  }, []);

  const dataSend = {
    status,
    celula,
    data_reuniao,
    presencas_membros_reuniao_celula,
  }

  const createPresencaReuniaoCelulaFunction = async (
    data: attendanceReuniaoCelula
  ) => {
    console.log('data create presence', data);
    try {
      const response = await axiosAuth.post(
        `${BASE_URL}/presencareuniaocelulas/newroute`,
        data
      );
      setSuccessRegisterPresence(true);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(
        'axiosError Ao registrar presença na reunião de célula"',
        axiosError
      );
      throw new Error('Erro ao registrar presença na reunião.');
    }
  };

  const { mutateAsync: createPresencaReuniaoCelulaFn, isPending, isSuccess } = useMutation(
    {
      mutationFn: createPresencaReuniaoCelulaFunction,
      mutationKey: ['CreatPresenceMeetingCelula'],
      onError: () => {
        queryClient.invalidateQueries({ queryKey: ['celula'] });
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['celula'] });
      },
    }
  );

  const getPresenceRegistered = async () => {
    try {
      const response = await axiosAuth.get(URLPresencaReuniaoCelulaIsRegiter)
      return response.data
    } catch (error) {
      console.log('Error in GET Presenca Registrada', error)
      return
    }
  }

  const {
    isLoading,
    isSuccess: isSuccessGetPresenceRegistered,
  } = useQuery({
    queryKey: ['presenceCellMetting'],
    queryFn: getPresenceRegistered,
    enabled: !!reuniaoRegisteredId, // A consulta será executada apenas se reuniaoRegisteredId existir
    retry: false,
  });
  

  const formUpdate = useForm<reuniaoCelulaUpdate>({
    resolver: zodResolver(reuniaoCelulaUpdateSchema),
    defaultValues: {
      visitantes: 0,
      almas_ganhas: 0,
    },
  })

  // Funcao para submeter os dados do Formulario Preenchido
  const onSubmit = async (
    data: z.infer<typeof attendanceReuniaCelulaSchema>
  ) => {
console.log('data enviado: ', data)
console.log('which_reuniao_celula:', data.which_reuniao_celula);
    if (!data.which_reuniao_celula) {
      console.error('which_reuniao_celula não foi preenchido!');
      return;
    }

    if (!data || !data.membro || !Array.isArray(data.membro)) {
      return;
    }

    const normalizedData = {
      ...data,
      membro: data.membro.map((membro) => ({
        ...membro,
        status: membro.status === 'true',
      })),
    };

    console.log('Dados normalizados para envio:', normalizedData);

    normalizedData.membro.forEach((membro, index) => {
      if (typeof membro.status !== 'boolean') {
        console.error(
          `Status do membro na posição ${index} não é booleano:`,
          membro.status
        );
      }
    });

    try {
      //@ts-ignore
      await createPresencaReuniaoCelulaFn(normalizedData)
    } catch (error) {
      errorCadastro('Já existem presenças registradas!')
    }
  }

  const updatePresencaReuniaoCelulaFunction = async () => {
    const dataSendUpdate = {
      visitantes: formUpdate.watch().visitantes,
      almas_ganhas: formUpdate.watch().almas_ganhas,
      id: reuniaoRegisteredId,
    };

    console.log('Updating data:', dataSendUpdate); // Log para verificar dados que estão sendo enviados

    await updateData({
      URL: `${BASE_URL}/reunioessemanaiscelulas/${reuniaoRegisteredId}`,
      newData: dataSendUpdate,
      token: token,
    }).catch((error) => {
      console.error('Erro ao atualizar dados:', error);
    });
  };

  const { mutateAsync: updatePresencaReuniaoCelulaFn } = useMutation({
    mutationFn: updatePresencaReuniaoCelulaFunction,
    mutationKey: ['UpdatePresenceMeetingCelula', reuniaoRegisteredId],
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['celula'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['celula'] });
    },
  });

  const hnadleFormsSubmit = async () => {
    try {
      await handleSubmit(onSubmit)()
      updatePresencaReuniaoCelulaFn();
    } catch (error) {
      console.error('Erro ao submeter os formulários', error)
    }
  }

  return (
    <>
      {isPendingCreateReunia || isLoading ? (
        <p className="mb-3 text-sm font-normal text-gray-500 leading-2">
          <Spinner className='animate-spin' />
        </p>
      ) : (
        <>
          {successRegisterPresence || isSuccessGetPresenceRegistered ? (
            <p className="mb-3 text-sm font-normal text-gray-500 leading-2">
              Presença já cadastrada!
            </p>
          ) : (
            <>
              <ToastContainer />
              <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
                <div className="w-full px-2 py-2 ">
                  <div className="w-full px-1 py-2 rounded-md">
                    <h2 className="mb-6 text-base font-medium leading-8 text-gray-800">
                      Presença de Reunião de Célula
                    </h2>
                    <form id="formUpadte">
                      {reuniaoRegisteredId && (
                        <Input
                          type="hidden"
                          value={reuniaoRegisteredId}
                          {...formUpdate.register(`id`)}
                        />
                      )}
                      <div className="grid grid-cols-1 mt-2 mb-4 gap-x-4 gap-y-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <Label
                            htmlFor="visitantes"
                            className="block text-sm font-medium leading-6 text-slate-700"
                          >
                            Visitantes
                          </Label>
                          <div className="mt-3">
                            <Input
                              {...formUpdate.register('visitantes')}
                              type="number"
                              min={0}
                              required
                              // defaultValue={0}
                              disabled={isPending}
                              id="visitantes"
                              className=" w-full rounded-md border-0.5 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <Label
                            htmlFor="almas_ganhas"
                            className="block text-sm font-medium leading-6 text-slate-700"
                          >
                            Almas Ganhas
                          </Label>
                          <div className="mt-3">
                            <Input
                              {...formUpdate.register('almas_ganhas')}
                              type="number"
                              min={0}
                              // defaultValue={0}
                              required
                              disabled={isPending}
                              id="almas_ganhas"
                              className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                    <div className="w-full border-separate border-spacing-y-6">
                      <div className="grid grid-cols-3 text-sm font-medium sm:grid-cols-4 md:grid-cols-5">
                        <div className="py-2 text-gray-800 border-b-2 border-blue-300 text-start">
                          Nome
                        </div>
                        <div className="hidden py-2 text-center text-gray-800 border-b-2 border-orange-300 sm:block">
                          Status
                        </div>
                        <div className="hidden py-2 text-center text-gray-800 border-b-2 border-indigo-300 md:inline">
                          Cargo
                        </div>
                        <div className="py-2 text-center text-gray-800 border-b-2 border-green-300">
                          P
                        </div>
                        <div className="py-2 text-center text-gray-800 border-b-2 border-red-300">
                          F
                        </div>
                      </div>
                      <div className="text-sm font-normal text-gray-700">
                        {celulaSort.map((user, index) => (
                          <form key={user.id} id={user.id}>
                            <div className="grid w-full grid-cols-3 gap-4 mt-3 mb-1 sm:grid-cols-4 md:grid-cols-5">
                              <Input
                                type="hidden"
                                value={user.id}
                                {...register(`membro.${index}.id`)}
                              />
                              {dataMutate && (
                                <Input
                                  type="hidden"
                                  value={reuniaoRegisteredId}
                                  {...register(`which_reuniao_celula`)}
                                />
                              )}
                              {/* NOME COM IMG */}
                              <div className="flex items-center justify-start gap-1 sm:gap-3">
                                <div className="flex items-center w-full">
                                  <div>
                                    <UserFocus
                                      className="hidden sm:block"
                                      size={28}
                                    />
                                  </div>
                                  <h2 className="ml-4 text-sm">
                                    {user.first_name}
                                  </h2>
                                </div>
                              </div>

                              {/* STATUS */}
                              <div className="hidden sm:block">
                                <span
                                  className={`hidden rounded-md px-2 py-1 text-center sm:block ${user.situacao_no_reino?.nome === 'Ativo'
                                    ? 'border border-green-200 bg-green-100 ring-green-500'
                                    : user.situacao_no_reino?.nome ===
                                      'Normal'
                                      ? 'border border-blue-200 bg-blue-100 ring-blue-500'
                                      : user.situacao_no_reino?.nome ===
                                        'Frio'
                                        ? 'border border-orange-200 bg-orange-100 ring-orange-500'
                                        : 'border border-red-200 bg-red-100 ring-red-500'
                                    }`}
                                >
                                  {user.situacao_no_reino?.nome}
                                </span>
                              </div>

                              {/* CARGO LIDERANÇA */}
                              <div className="hidden md:block">
                                <span className="hidden w-full px-2 py-1 text-center truncate border border-gray-200 rounded-md bg-gray-50 ring-gray-500 md:block">
                                  {user.cargo_de_lideranca?.nome}{' '}
                                </span>
                              </div>
                              <Input
                                {...register(`membro.${index}.status` as const, {
                                  required: true,
                                })}
                                value="true"
                                type="radio"
                                id={user.id}
                                className="w-4 h-4 mx-auto text-green-600 border-green-300 cursor-pointer focus:ring-green-600"
                              />
                              <Input
                                {...register(`membro.${index}.status` as const, {
                                  required: true,
                                })}
                                value="false"
                                type="radio"
                                id={user.first_name}
                                className="w-4 h-4 mx-auto text-red-600 border-red-300 cursor-pointer focus:ring-red-600"
                              />
                            </div>
                          </form>
                        ))}
                        {isPending ? (
                          <Button
                            type="submit"
                            disabled={isPending}
                            className="mx-auto flex w-full gap-2 items-center justify-center rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                          >
                            <Spinner className='animate-spin' />
                            <span>Registrando...</span>
                          </Button>
                        ) : (
                          <Button
                            className="mx-auto mt-3 w-full rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                            onClick={hnadleFormsSubmit}
                          >
                            Registrar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
