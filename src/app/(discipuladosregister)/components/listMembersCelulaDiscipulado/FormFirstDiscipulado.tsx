'use client'
import { SubmitHandler, useForm } from "react-hook-form"
import { MembroCell, dataSchemaCreateDiscipulado, dataSchemaReturnCreateDiscipulado } from "./schema"
import { useUserDataStore } from "@/store/UserDataStore"
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken"
import { BASE_URL, BASE_URL_LOCAL, errorCadastro, success } from "@/functions/functions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Disclosure } from "@headlessui/react"
import { Fragment } from "react"
import { ChevronUpIcon } from "lucide-react"
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { cn } from "@/lib/utils"
import { CheckFat, Warning } from "@phosphor-icons/react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc);
dayjs.extend(timezone);

interface PropsForm {
  membro: MembroCell
}
export default function FormFirstDiscipulado(membro: PropsForm) {
  console.log('membro', membro)
  const queryClient = useQueryClient()
  const { token } = useUserDataStore.getState()
  const axiosAuth = useAxiosAuthToken(token)
  const URLCreateNewDiscipulado = `${BASE_URL_LOCAL}/discipulados`
  const discipulador = membro?.membro?.discipulador_usuario_discipulador_usuario_usuario_idTouser[0]?.user_discipulador_usuario_discipulador_idTouser?.first_name
  const discipulador_id = membro?.membro?.discipulador_usuario_discipulador_usuario_usuario_idTouser[0]?.user_discipulador_usuario_discipulador_idTouser?.id
  const quantidade_discipulado = membro?.membro?.discipulador_usuario_discipulador_usuario_usuario_idTouser[0]?._count?.discipulado
  const data_1discipulado_ocorreu = membro?.membro?.discipulador_usuario_discipulador_usuario_usuario_idTouser[0]?.discipulado[0]?.data_ocorreu
  const { register, handleSubmit, setValue } = useForm<dataSchemaCreateDiscipulado>()

  // Register New Discipulado
  const CreateDiscipuladoFunction = async (dataForm: dataSchemaCreateDiscipulado) => {
    try {
      const data: dataSchemaReturnCreateDiscipulado = await axiosAuth.post(URLCreateNewDiscipulado, dataForm)
      return data
    } catch (error) {
      console.error('⛔ error no registro do Discipulado', error)
    }
  }

  const { mutateAsync: createDiscipuladoFn, isLoading } = useMutation({
    mutationFn: CreateDiscipuladoFunction,
    onSuccess: () => {
      success('😉 Discipulado Registrado!')
      // queryClient.setQueryData(['dataReturnDiscipuladoExist'], (cachedData: any) => {
      //   return {
      //     ...cachedData,
      //     discipuladosRealizados: cachedData.map((discipulado: { discipulado_id: string, data_ocorreu: string }) =>
      //       discipulado.discipulado_id === data?.discipulado_id ? {
      //         ...discipulado,
      //         data_ocorreu,
      //       } : discipulado
      //     )
      //   };
      // }
      setTimeout(() => {
        window.location.reload()
      }, 2500);

    },
    onError: () => {
      errorCadastro('⛔ error no registro do Discipulado')
    }
  })

  const onSubmitFirstDiscipulado: SubmitHandler<dataSchemaCreateDiscipulado> = async (data) => {
    const result = await createDiscipuladoFn(data)
    return result
  }

  return (
    <Fragment>
      <Disclosure>
        {({ open }) => (
          <Fragment>
            <ToastContainer />
            <Disclosure.Button
              className={cn(
                "flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 rounded-lg bg-red-50 ring-1 ring-blue-100 hover:bg-blue-50 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:ring-opacity-75",
                `${quantidade_discipulado >= 1 ? 'bg-green-50 ring-1 ring-green-100' : 'bg-red-50 ring-1 ring-blue-100'}`
              )}
            >

              <span className="flex items-center justify-start gap-2 truncate sm:gap-4">1º Discipulado do Mês  {quantidade_discipulado >= 1 ? <CheckFat size={16} color="#15803d" /> : <Warning size={16} color="#dc2626" />}</span>
              <ChevronUpIcon
                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-blue-500`}
              />
            </Disclosure.Button>
            {quantidade_discipulado >= 1
              ?
              <Disclosure.Panel aria-disabled={true} className="w-full px-2 pt-4 pb-2 text-sm text-gray-500 sm:flex sm:flex-col">
                <div className='flex items-center justify-between mb-3 text-slate-400'>
                  <h2>Discipulador(a):</h2>
                  <div className="flex items-center justify-start">
                    <h2 className="ml-4">{discipulador || 'Sem Registro'}</h2>
                  </div>
                </div>
                <form
                  aria-disabled
                  key={membro.membro.id}
                  id={membro.membro.id}
                // onSubmit={handleSubmit(onSubmitFirstDiscipulado)}
                >
                  <input
                    key={membro.membro.id}
                    type="hidden"
                    value={membro.membro.id}
                    {...register(`usuario_id`)}
                  />
                  <input
                    key={membro.membro.id + discipulador_id}
                    type="hidden"
                    value={discipulador_id}
                    {...register(`discipulador_id`)}
                  />{

                  }
                  <input type="date"
                    disabled
                    placeholder={dayjs.utc(data_1discipulado_ocorreu).format('YYYY-MM-DD')}
                    value={dayjs.utc(data_1discipulado_ocorreu).format('YYYY-MM-DD')}
                    key={membro.membro.id + 7}
                    {...register(`data_ocorreu`, {
                      required: true
                    })}
                    id="first_discipulado"
                    className="block w-full rounded-md border-0 py-1.5 mb-4 text-slate-400 text-sm shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                  {isLoading ? (
                    <button
                      type="submit"
                      disabled={true}
                      className="flex items-center justify-center w-full px-3 py-1.5 mb-6 mx-auto text-sm font-semibold text-white bg-green-700 rounded-md leading-7 shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
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
                    <button disabled className='mx-auto flex w-full items-center justify-center rounded-md bg-[#014874] opacity-40 px-3 py-1.5 mb-6 text-sm font-semibold leading-7 text-white shadow-sm duration-100' type="submit">Registrar</button>)}
                </form>
              </Disclosure.Panel>
              :
              <Disclosure.Panel className="w-full px-2 pt-4 pb-2 text-sm text-gray-500 sm:flex sm:flex-col">
                <div className='flex items-center justify-between mb-3'>
                  <h2>Discipulador(a):</h2>
                  <div className="flex items-center justify-start">
                    <h2 className="ml-4">{discipulador || 'Sem Registro'}</h2>
                  </div>
                </div>
                <form
                  key={membro.membro.id}
                  id={membro.membro.id}
                  onSubmit={handleSubmit(onSubmitFirstDiscipulado)}>
                  <input
                    key={membro.membro.id}
                    type="hidden"
                    value={membro.membro.id}
                    {...register(`usuario_id`)}
                  />
                  <input
                    key={membro.membro.id + discipulador_id}
                    type="hidden"
                    value={discipulador_id}
                    {...register(`discipulador_id`)}
                  />
                  <input type="date"
                    key={membro.membro.id + 7}
                    {...register(`data_ocorreu`, {
                      required: true
                    })}
                    id="first_discipulado"
                    className="block w-full text-sm rounded-md border-0 py-1.5 mb-4 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                  {isLoading ? (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center justify-center w-full px-3 py-1.5 mb-6 mx-auto text-sm font-semibold text-white bg-green-700 rounded-md leading-7 shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
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
                    <button className='mx-auto flex w-full items-center justify-center rounded-md bg-[#014874] px-3 py-1.5 mb-6 text-sm font-semibold leading-7 text-white shadow-sm duration-100 hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874]' type="submit">Registrar</button>)}
                </form>
              </Disclosure.Panel>
            }
          </Fragment>
        )}
      </Disclosure>
    </Fragment>
  );
};
