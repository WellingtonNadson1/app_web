/* eslint-disable camelcase */
'use client'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { BASE_URL, errorCadastro, success } from '@/functions/functions'
import { UserFocus } from '@phosphor-icons/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as z from 'zod'
import { CelulaProps } from './schema'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import dayjs from 'dayjs'
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { AxiosError } from 'axios'

dayjs.extend(utc);
dayjs.extend(timezone);

type ReuniaoCelulaSuccessData = {
  status: string;
  celula: string;
  data_reuniao: string;
  presencas_membros_reuniao_celula: string;
  id?: string | undefined;
};

const PresencaCultoCelulaSchema = z.object({
  id: z.string(),
  status: z.boolean(),
  membro: z.string(),
  presenca_culto: z.string(),
})

export type PresencaCultoProps = z.infer<typeof PresencaCultoCelulaSchema>

const reuniaoCelulaDataSchema = z.object({
  id: z.string().optional(),
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_membros_reuniao_celula: z.string(),
})

type reuniaoCelulaData = z.infer<typeof reuniaoCelulaDataSchema>

const reuniaoCelulaDataSchema2 = z.object({
  status: z.string(),
  celula: z.string(),
  data_reuniao: z.string(),
  presencas_membros_reuniao_celula: z.string().nullable(),
})

type reuniaoCelulaData2 = z.infer<typeof reuniaoCelulaDataSchema2>

const attendanceSchema = z.object({
  status: z.string(),
  membro: z.string(),
  which_reuniao_celula: z.string(),
})

type attendance = z.infer<typeof attendanceSchema>

export default function ControlePresencaReuniaoCelula({
  celulaId,
  dataCelula,
}: {
  celulaId: string
  dataCelula: CelulaProps
}) {
  const { data: session } = useSession()
  const [reuniaoRegisteredId, setReuniaRegisteredId] = useState<string>()
  const URLControlePresencaReuniaoCelula = `${BASE_URL}/presencareuniaocelulas`
  const URLPresencaReuniaoCelulaIsRegiter = `${BASE_URL}/presencareuniaocelulas/isregister/${reuniaoRegisteredId}`
  const URLReuniaoCelula = `${BASE_URL}/reunioessemanaiscelulas`
  
  // const URLControlePresencaReuniaoCelula = `http://localhost:3333/presencareuniaocelulas`
  // const URLPresencaReuniaoCelulaIsRegiter = `http://localhost:3333/presencareuniaocelulas/isregister/${reuniaoRegisteredId}`
  // const URLReuniaoCelula = `http://localhost:3333/reunioessemanaiscelulas`

  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const [isLoadingCreateReuniaoCelula, setIsLoadingCreateReuniaoCelula] = useState(false)
  const [presencaReuniaoIsRegistered, setPresencaReuniaoIsRegistered] = useState(false)
  const [dataReuniao, setDataReuniao] = useState<reuniaoCelulaData[]>()
  const [erro, setErro] = useState<Error>();
  const router = useRouter()
  const { handleSubmit, register, reset } = useForm<attendance[]>()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  const queryClient = useQueryClient()

  const memoizedDataHoje = useMemo(() => dayjs(), [])
  const memoizedDataHojeString = memoizedDataHoje.tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')

  const status = 'Marcado'
  const celula = celulaId
  const data_reuniao = memoizedDataHojeString
  const presencas_membros_reuniao_celula = null

  const dataSend = {
    status,
    celula,
    data_reuniao,
    presencas_membros_reuniao_celula,
  }

  const createReuniaoCelula= async (dataSend: reuniaoCelulaData2): Promise<reuniaoCelulaData[] | reuniaoCelulaData> => {
    const response = await axiosAuth.post(URLReuniaoCelula, dataSend)
    console.log(response)
    return response.data;
  }

  const { mutate, data: dataMutate, isSuccess, isError } = useMutation({
    mutationFn: createReuniaoCelula,
    onSuccess: async (responseData) => {
      queryClient.invalidateQueries({ queryKey: ['reuniaocelula']});
      const {id} = responseData as ReuniaoCelulaSuccessData;
      setReuniaRegisteredId(id)

      console.log('success mutate', responseData);
    },
    onError: async (errorData) => {
      const axiosError = errorData as AxiosError;
      if (axiosError.response) {
        const errorResponseData = axiosError.response.data;
        if (Array.isArray(errorResponseData) && errorResponseData.length > 0) {
          // Access the 'id' from the first element in the array (assuming it's the only one)
          const id = errorResponseData[0].id;
          setReuniaRegisteredId(id)
          // Now you can use 'id' in other parts of your code
          console.log('Error Response ID:', id);
        }       
      } else {
        console.error('Error response is not available');
      }
    }
  })

  useEffect(() => {
    // Criando uma nova Reunião de Célula para que seja tirada as faltas dos membros
    // setIsLoadingCreateReuniaoCelula(true)
    mutate(dataSend)

    if (isError) {
      setDataReuniao(dataMutate)
      setErro(new Error('A reunião já está registrada'));
      console.error(erro); 
      setErro(undefined); 
    }
  }, [])

  const { data: PresenceCelulaExist, isSuccess: succesTrue } = useQuery({
    queryKey: ["presenca"],
    queryFn: async () => {
      const id = reuniaoRegisteredId
      const response = await axiosAuth.get(URLPresencaReuniaoCelulaIsRegiter)
      const PresenceExistRegistered = await response.data
      if (response.status === 200) {
        setPresencaReuniaoIsRegistered(true)
      }
      return PresenceExistRegistered
    },
    enabled: !!reuniaoRegisteredId, // A consulta será executada apenas se reuniaoRegisteredId existir
  })

  // Funcao para submeter os dados do Formulario Preenchido
  const onSubmit: SubmitHandler<attendance[]> = async (data) => {
    try {
      setIsLoadingSubmitForm(true)

      for (const key in data) {
        const status = data[key].status === 'true'
        const which_reuniao_celula = reuniaoRegisteredId;
        const response = await axiosAuth.post(URLControlePresencaReuniaoCelula, {...data[key], status, which_reuniao_celula})
        if (response.status !== 201) {
          throw new Error('Failed to submit dados de presenca')
        }
      }

      success('😉 Presenças de Célula Registradas!')
      setIsLoadingSubmitForm(false)
      reset()
      router.refresh()
    } catch (error) {
      errorCadastro('Já existem presenças registradas!')
      setIsLoadingSubmitForm(false)
    }
  }

  return (
    <>
    {isLoadingCreateReuniaoCelula ? (
      <p className="mb-3 text-sm font-normal text-gray-500 leading-2">
      <SpinnerButton message={''}/>
    </p>
    ) : (
      <>
        {presencaReuniaoIsRegistered ? (
          <p className="mb-3 text-sm font-normal text-gray-500 leading-2">
            Presença já cadastrada!
          </p>
        ) : (
          <>
            <ToastContainer />
            <div className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
              <div className="w-full px-2 py-2 ">
                <div className="w-full px-1 py-2 rounded-md">
                  <h2 className="mb-3 text-lg font-semibold leading-7 text-gray-800">
                    Presença de Reunião de Célula
                  </h2>
                  <div className="w-full border-separate border-spacing-y-6">
                    <div className="grid grid-cols-3 text-base font-bold sm:grid-cols-5">
                      <div className="py-2 text-gray-800 border-b-2 border-blue-300 text-start">
                        Nome
                      </div>
                      <div className="hidden py-2 text-center text-gray-800 border-b-2 border-orange-300 sm:block">
                        Status
                      </div>
                      <div className="hidden py-2 text-center text-gray-800 border-b-2 border-indigo-300 sm:block">
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
                      {dataCelula.membros.map((user, index) => (
                        <form key={user.id} id={user.id}>
                          <div className="grid grid-cols-3 gap-4 mt-3 mb-1 sm:grid-cols-5">
                            <input
                              type="hidden"
                              value={user.id}
                              {...register(`${index}.membro`)}
                            />
                            <div className="flex items-center justify-start gap-1 sm:gap-3">
                              <UserFocus className="hidden sm:block" size={28} />
                              <h2 className="ml-4">{user.first_name}</h2>
                            </div>
                            <div className="hidden sm:block">
                              <span
                                className={`hidden rounded-md px-2 py-1 text-center sm:block ${
                                  user.situacao_no_reino?.nome === 'Ativo'
                                    ? 'border border-green-200 bg-green-100 ring-green-500'
                                    : user.situacao_no_reino?.nome === 'Normal'
                                    ? 'border border-blue-200 bg-blue-100 ring-blue-500'
                                    : user.situacao_no_reino?.nome === 'Frio'
                                    ? 'border border-orange-200 bg-orange-100 ring-orange-500'
                                    : 'border border-red-200 bg-red-100 ring-red-500'
                                }`}
                              >
                                {user.situacao_no_reino?.nome}
                              </span>
                            </div>
                            <div className="hidden sm:block">
                              <span className="hidden w-full px-2 py-1 text-center border border-gray-200 rounded-md bg-gray-50 ring-gray-500 sm:inline">
                                {user.cargo_de_lideranca?.nome}{' '}
                              </span>
                            </div>
                            <input
                              {...register(`${index}.status` as const, { required: true })}
                              value="true"
                              type="radio"
                              id={user.id}
                              className="w-4 h-4 mx-auto text-green-600 border-green-300 cursor-pointer focus:ring-green-600"
                            />
                            <input
                              {...register(`${index}.status` as const, { required: true })}
                              value="false"
                              type="radio"
                              id={user.first_name}
                              className="w-4 h-4 mx-auto text-red-600 border-red-300 cursor-pointer focus:ring-red-600"
                            />
                          </div>
                        </form>
                      ))}
                      {isLoadingSubmitForm ? (
                        <button
                          type="submit"
                          disabled={isLoadingSubmitForm}
                          className="mx-auto flex w-full items-center justify-center rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
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
                          <span>Registrando...</span>
                        </button>
                      ) : (
                        <button
                          className="mx-auto mt-3 w-full rounded-md bg-[#014874] px-3 py-1.5 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]"
                          type="submit"
                          onClick={handleSubmit(onSubmit)}
                        >
                          Registrar
                        </button>
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
