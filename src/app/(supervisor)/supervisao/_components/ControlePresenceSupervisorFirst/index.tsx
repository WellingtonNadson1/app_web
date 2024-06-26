'use client'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { BASE_URL, BASE_URL_LOCAL, errorCadastro, success } from '@/functions/functions'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { UserFocus } from '@phosphor-icons/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ControlePresencaSupervisorProps, attendance } from '../../schema'

export default function ControlePresenceSupervisorFirst({
  id,
  culto,
  supervisorId,
}: ControlePresencaSupervisorProps) {
  const URLControlePresenca = `${BASE_URL}/presencacultos`
  const URLPresencaCultoId = `${BASE_URL}/presencacultosbycelula/${culto}/${supervisorId}`
  const { handleSubmit, register } = useForm<attendance>()
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth(session?.user.token as string)
  const queryClient = useQueryClient()

  const getPresenceRegistered = async () => {
    const { data } = await axiosAuth.get(URLPresencaCultoId)
    return data
  }

  const { data: PresenceExistRegisteredSupervisorFirst, isLoading, isSuccess: isSuccessGetPresence, error } = useQuery({
    queryKey: ['presenceExistRegisteredSupervisorFirst'],
    queryFn: getPresenceRegistered,
  })

  if (isSuccessGetPresence) {
    console.log('PresenceExistRegisteredSupervisorFirst', PresenceExistRegisteredSupervisorFirst)
  }

  const createPresencaCultoSupervisorFunction = async (data: attendance) => {
    try {
      const status = data.status === 'true'
      const response = await axiosAuth.post(URLControlePresenca, { ...data, status })
      const presenceRegister = response.data
      if (!presenceRegister) {
        throw new Error('Failed to submit dados de presenca')
      }
      success('😉 Presenças Registradas!')
    } catch (error) {
      console.error('error: ', error)
    }
  }

  const { mutateAsync: createPresencaCultoSupervisorFn, isPending: isPendingCreateFirstPresenceSupervisor, isSuccess } = useMutation({
    mutationFn: createPresencaCultoSupervisorFunction,
    onError: (err, newMember, context) => {
      queryClient.invalidateQueries({ queryKey: ['presenceExistRegisteredSupervisorFirst'] })
      queryClient.invalidateQueries({ queryKey: ['meetingsData'] })
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['presenceExistRegisteredSupervisorFirst'] })
      queryClient.invalidateQueries({ queryKey: ['meetingsData'] })
    },
  })

  // Funcao para submeter os dados do Formulario Preenchido
  const onSubmit: SubmitHandler<attendance> = async (data) => {
    try {
      await createPresencaCultoSupervisorFn(data)
    } catch (error) {
      errorCadastro('Já existem presenças registradas!')
    }
  }

  return (
    <>
      {isLoading ? (
        <SpinnerButton message={''} />
      ) : (
        isLoading ? (
          <SpinnerButton message={''} />
        ) :
          <>
            {
              PresenceExistRegisteredSupervisorFirst ? (
                <p className="mb-3 text-sm font-normal text-gray-500 leading-2">
                  Presença já cadastrada!
                </p>
              ) : (
                <>
                  <ToastContainer />
                  <div id={id} className="relative w-full px-4 py-2 mx-auto bg-white shadow-lg rounded-xl">
                    <div className="w-full px-2 py-2 ">
                      <div className="w-full px-1 py-2 rounded-md">
                        <h2 className="mb-6 text-base font-medium leading-8 text-gray-800">
                          Presença de Culto
                        </h2>
                        <div className="w-full border-separate border-spacing-y-6">
                          <div className="flex items-center justify-between">
                            <div className="w-full py-2 text-gray-800 border-b-2 border-blue-300 text-start">
                              Nome
                            </div>
                            <div className="hidden w-full py-2 text-center text-gray-800 border-b-2 border-orange-300 sm:block">
                              Status
                            </div>
                            <div className="hidden w-full py-2 text-center text-gray-800 border-b-2 border-indigo-300 sm:block">
                              Cargo
                            </div>
                            <div className='flex items-center justify-between w-full'>
                              <div className="w-full px-2 py-2 text-center text-gray-800 border-b-2 border-green-300">
                                P
                              </div>
                              <div className="w-full px-2 py-2 text-center text-gray-800 border-b-2 border-red-300">
                                F
                              </div>
                            </div>

                          </div>
                          <div className="text-sm font-normal text-gray-700">
                            <form id={'supervisorId'}>
                              <div className="grid grid-cols-3 gap-4 mt-3 mb-1 sm:grid-cols-5">
                                <input
                                  type="hidden"
                                  value={supervisorId}
                                  {...register("membro")}
                                />
                                <input
                                  type="hidden"
                                  value={culto}
                                  {...register("presenca_culto")}
                                />
                                <div className="flex items-center justify-start gap-1 sm:gap-3">
                                  <UserFocus
                                    className="hidden sm:block"
                                    size={28}
                                  />
                                  <h2 className="ml-4">{session?.user.first_name}</h2>
                                </div>
                                <div className="hidden sm:block">
                                  <span
                                    className={`hidden w-full rounded-md px-2 py-1 text-center sm:block ${session?.user.situacaoNoReinoId === '0892b1ed-3e99-4e13-acf6-99f7a0e99358'
                                      ? 'border border-green-200 bg-green-100 ring-green-500'
                                      : session?.user.situacaoNoReinoId ===
                                        'f4c1c9ee-5f5a-4681-af13-99c422c240e0'
                                        ? 'border border-blue-200 bg-blue-100 ring-blue-500'
                                        : session?.user.situacaoNoReinoId === 'fab25926-b19e-4a2b-bfad-cf33fa0ace86'
                                          ? 'border border-orange-200 bg-orange-100 ring-orange-500'
                                          : 'border border-red-200 bg-red-100 ring-red-500'
                                      }`}
                                  >
                                    {session?.user.situacaoNoReinoId === '0892b1ed-3e99-4e13-acf6-99f7a0e99358' ?
                                      (
                                        <span key={"ativo"}>Ativo</span>
                                      ) : session?.user.situacaoNoReinoId === 'f4c1c9ee-5f5a-4681-af13-99c422c240e0' ?
                                        (
                                          <span key={"nomral"}>Normal</span>
                                        ) : session?.user.situacaoNoReinoId === 'fab25926-b19e-4a2b-bfad-cf33fa0ace86' ?
                                          (
                                            <span key={"frio"}>Frio</span>
                                          ) :
                                          (
                                            <span key={"afastado"}>Afastado</span>
                                          )}
                                  </span>
                                </div>
                                <div className="hidden sm:block">
                                  <span className="hidden w-full px-2 py-1 text-center border border-gray-200 rounded-md bg-gray-50 ring-gray-500 sm:block">
                                    {session?.user.cargoDeLiderancaId === 'c394f146-c054-4d77-97a8-d24ee4d9013c' ?
                                      (
                                        <span key={"ativo"}>Pastor</span>
                                      ) : session?.user.cargoDeLiderancaId === '1777ff88-7b8a-4ac9-9926-9f6ac13872c6' ?
                                        (
                                          <span key={"nomral"}>Sup. de Área</span>
                                        ) : session?.user.cargoDeLiderancaId === '4508f737-cdf5-405a-951b-db91c11f2555' ?
                                          (
                                            <span key={"frio"}>Sup. de Setor</span>
                                          ) : session?.user.cargoDeLiderancaId === '6bc843b9-83f4-45c4-ad45-b77077c0ace2' ?
                                            (
                                              <span key={"frio"}>Líder de Célula</span>
                                            ) :
                                            session?.user.cargoDeLiderancaId === '079e35a7-8e9c-40ef-9d5b-cb8f9c7c11a8' ?
                                              (
                                                <span key={"frio"}>Membro</span>
                                              ) :
                                              session?.user.cargoDeLiderancaId === 'ac44e636-6953-46c6-ab8e-7fcd0a36ddae' ?
                                                (
                                                  <span key={"frio"}>Sup. de Distrito</span>
                                                ) :
                                                session?.user.cargoDeLiderancaId === '78e0f4ef-9578-4a17-9d34-31617ca82018' ?
                                                  (
                                                    <span key={"frio"}>Líder Auxiliar</span>
                                                  ) :
                                                  (
                                                    <span key={"frio"}>Líder de Célula Sup.</span>
                                                  )}
                                  </span>
                                </div>
                                <input
                                  {...register("status", {
                                    required: true
                                  })}
                                  value="true"
                                  type="radio"
                                  id={session?.user.id}
                                  className="w-4 h-4 mx-auto text-green-600 border-green-300 cursor-pointer focus:ring-green-600"
                                />
                                <input
                                  {...register("status", { required: true })}
                                  value="false"
                                  type="radio"
                                  id={session?.user.first_name}
                                  className="w-4 h-4 mx-auto text-red-600 border-red-300 cursor-pointer focus:ring-red-600"
                                />
                              </div>
                            </form>
                            {isPendingCreateFirstPresenceSupervisor ? (
                              <button
                                type="submit"
                                disabled={isPendingCreateFirstPresenceSupervisor}
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
              )
            }
          </>
      )}
    </>
  )
}
