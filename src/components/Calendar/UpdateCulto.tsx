'use client'

import {
    CultoDaSemana,
    NewCulto,
} from '@/app/(authenticed)/cultos/schemaNewCulto'
import {
    FetchError,
    errorCadastro,
    fetchWithToken,
    success,
} from '@/functions/functions'
import { UserMinusIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'
import ModalCalendar from './ModalCalendar'

export default function UpdateCulto({
  cultoId,
}: // shouldFetch,
{
  cultoId: string
  // shouldFetch: boolean
}) {
  const { data: session } = useSession()
  const hostname = 'app-ibb.onrender.com'
  const URLCultosIndividuais = `https://${hostname}/cultosindividuais`
  const URLCultosSemanais = `https://${hostname}/cultossemanais`
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [dataCultos, setDataCultos] = useState<NewCulto[]>()
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm<NewCulto>({
    defaultValues: async () => {
      if (!cultoId) return {}

      const response = await fetch(URLCultosIndividuais, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      const data = await response.json()
      console.log('Data in the Update Culto', data)
      return data
    },
  })

  const onSubmit: SubmitHandler<NewCulto> = async (data) => {
    try {
      setIsLoadingSubmitForm(true)

      const formatDatatoISO8601 = (dataString: string) => {
        const dataObj = new Date(dataString)
        return dataObj.toISOString()
      }

      data.data_inicio_culto = formatDatatoISO8601(data.data_inicio_culto)
      data.data_termino_culto = formatDatatoISO8601(data.data_termino_culto)

      const response = await fetch(URLCultosIndividuais, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsLoadingSubmitForm(false)
        setFormSuccess(true)
        router.refresh()
        success('Culto Cadastrado')
      } else {
        errorCadastro('Erro ao cadastrar Culto')
      }
    } catch (error) {
      console.log(error)
      errorCadastro('Erro ao cadastrar Culto')
    }
    reset()
  }

  const { data: cultosSemanais, isLoading } = useSWR<CultoDaSemana[]>(
    [URLCultosSemanais, `${session?.user.token}`],
    ([url, token]: [string, string]) => fetchWithToken(url, 'GET', token),
  )

  const fetchCultos = useCallback(async () => {
    try {
      const response = await fetch(URLCultosIndividuais, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      if (!response.ok) {
        const error: FetchError = new Error('Failed to fetch get Cultos.')
        error.status = response.status
        throw error
      }
      const cultos = await response.json()
      setDataCultos(cultos)
    } catch (error) {
      console.log(error)
    }
  }, [URLCultosIndividuais, session?.user.token])

  // UseEffect para buscar as células quando a página é carregada
  useEffect(() => {
    fetchCultos()
  }, [fetchCultos])

  // UseEffect para buscar as células após o envio do formulário
  useEffect(() => {
    if (formSuccess) {
      fetchCultos()
    }
  }, [formSuccess, fetchCultos])

  if (dataCultos) {
    console.log('data Cultos Modal Eventos', dataCultos)
  }

  return (
    <ModalCalendar
      buttonIcon={
        <EditActiveIcon className="mr-2 h-5 w-5" aria-hidden="true" />
      }
      icon={UserMinusIcon}
      titleModal="Atualizar Culto"
      titleButton="Atualizar"
      buttonProps={{
        className:
          'group flex w-full cursor-pointer items-center rounded-md bg-white px-2 py-2 text-sm text-gray-900 hover:bg-slate-500 hover:text-white',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-10">
          <div className="mt-10 grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-8">
            <div className="sm:col-span-4">
              <label
                htmlFor="data_inicio_culto"
                className="block text-sm font-medium leading-6 text-slate-700"
              >
                Data Início
              </label>
              <div className="mt-3">
                <input
                  {...register('data_inicio_culto')}
                  type="datetime-local"
                  name="data_inicio_culto"
                  id="data_inicio_culto"
                  className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="data_termino_culto"
                className="block text-sm font-medium leading-6 text-slate-700"
              >
                Data Término
              </label>
              <div className="mt-3">
                <input
                  {...register('data_termino_culto')}
                  type="datetime-local"
                  name="data_termino_culto"
                  id="data_termino_culto"
                  className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          {/* INFORMAÇÕES DO REINO */}
          <div className="mt-10 grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="culto_semana"
                className="block text-sm font-medium leading-6 text-slate-700"
              >
                Culto da Semana
              </label>
              <div className="mt-3">
                <select
                  {...register('culto_semana')}
                  id="culto_semana"
                  name="culto_semana"
                  className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  {isLoading ? (
                    <option value="">Carregando cultos...</option>
                  ) : (
                    <option value="">Selecione</option>
                  )}
                  {cultosSemanais &&
                    cultosSemanais?.map((cultoDaSemana) => (
                      <option key={cultoDaSemana.id} value={cultoDaSemana.id}>
                        {cultoDaSemana.nome}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-slate-700"
              >
                Status do Culto
              </label>
              <div className="mt-3">
                <select
                  {...register('status')}
                  id="status"
                  name="status"
                  className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  {isLoading ? (
                    <option value="">Carregando status...</option>
                  ) : (
                    <>
                      <option value="">Selecione</option>
                      <option value="Agendado">Agendado</option>
                      <option value="Cancelado">Cancelado</option>
                      <option value="Realizado">Realizado</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Botões para submeter Forms */}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={() => reset()}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:rounded-md hover:bg-red-500 hover:px-3 hover:py-2 hover:text-white"
            >
              Cancelar
            </button>
            {isLoadingSubmitForm ? (
              <div>
                <button
                  type="submit"
                  disabled={isLoadingSubmitForm}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                >
                  <svg
                    className="mr-3 h-5 w-5 animate-spin text-gray-400"
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
                </button>
              </div>
            ) : (
              <button
                type="submit"
                className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
              >
                <span>Atualizar</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </ModalCalendar>
  )
}

function EditActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#47c180f7"
        stroke="#87ffbfe6"
        strokeWidth="2"
      />
    </svg>
  )
}
