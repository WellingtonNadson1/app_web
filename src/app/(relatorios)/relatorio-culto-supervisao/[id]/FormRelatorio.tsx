import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BASE_URL, errorCadastro, success } from '@/functions/functions'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormRelatorioSchema, ISupervisoes } from './schema'

function FormRelatorio() {
  const { data: session } = useSession()
  const URLPresencaGeralCultos = `${BASE_URL}/relatorio/presencacultos`
  const URLRelatorioPresenceCulto = `${BASE_URL}/cultosindividuais/fordate`
  const URLSupervisoes = `${BASE_URL}/supervisoes`

  const { register, handleSubmit, reset } = useForm<FormRelatorioSchema>()
  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>()
  const [supervisoes, setSupervisoes] = useState<ISupervisoes[]>()
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)

  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  const onSubmit: SubmitHandler<FormRelatorioSchema> = async ({
    superVisionId,
    startDate,
    endDate,
  }) => {
    try {
      setIsLoadingSubmitForm(true)

      const formatDatatoISO8601 = (dataString: string) => {
        const dataObj = new Date(dataString)
        return dataObj.toISOString()
      }

      const response = await axiosAuth.post(URLRelatorioPresenceCulto, {
        superVisionId,
        startDate,
        endDate,
      })
      const relatorioPresenceCulto = response.data

      if (relatorioPresenceCulto) {
        setIsLoadingSubmitForm(false)
        success('Célula Cadastrada')
      } else {
        errorCadastro('Erro ao Cadastrar Célula')
      }
    } catch (error) {
      console.log(error)
      setIsLoadingSubmitForm(false)
      errorCadastro('Erro ao Cadastrar Célula')
    }
    reset()
  }

  const { data: dataSupervisoes, isLoading } = useQuery<ISupervisoes[]>({
    queryKey: ['supervisoes'],
    queryFn: async () => {
      const response = await axiosAuth.get(URLSupervisoes)
      const dataSupervisoes = response.data
      return dataSupervisoes
    },
    retry: false,
  })

  if (!isLoading) {
    return dataSupervisoes && setSupervisoes(dataSupervisoes)
  }

  const handleSupervisaoSelecionada = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSupervisaoSelecionada(event.target.value)
  }

  return (
    <div className="relative w-full px-4 py-2 mx-auto mt-4 ">
      <div className="w-full px-2 py-2 bg-white shadow-lg rounded-xl ">
        <div className="flex justify-between w-full gap-3 px-1 py-2 rounded-md items center sm:justify-start">
          <div className="relative w-full px-2 py-2 mx-auto">
            <div className="flex justify-between">
              <div className="relative px-2 mx-auto py-7">
                <div className="p-6 mx-auto bg-white rounded-lg">
                  {/* Incio do Forms */}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="pb-3">
                      <h2 className="text-sm leading-normal text-gray-400 uppercase">
                        Relatório
                      </h2>

                      <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-9">
                        <div className="sm:col-span-2">
                          <Label
                            htmlFor="startDate"
                            className="block text-sm font-medium leading-6 text-slate-700"
                          >
                            Dt. Início
                          </Label>
                          <div className="mt-3">
                            <Input
                              {...register('startDate')}
                              type="datetime-local"
                              name="startDate"
                              id="startDate"
                              className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <Label
                            htmlFor="endDate"
                            className="block text-sm font-medium leading-6 text-slate-700"
                          >
                            Dt. Multipli.
                          </Label>
                          <div className="mt-3">
                            <Input
                              {...register('endDate')}
                              type="datetime-local"
                              name="endDate"
                              id="endDate"
                              className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      {/* INFORMAÇÕES DO REINO */}
                      <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="superVisionId"
                            className="block text-sm font-medium leading-6 text-slate-700"
                          >
                            Supervisão
                          </label>
                          <div className="mt-3">
                            <select
                              {...register('superVisionId')}
                              id="superVisionId"
                              name="superVisionId"
                              className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              onChange={handleSupervisaoSelecionada}
                            >
                              {!supervisoes ? (
                                <option value="">
                                  Carregando supervisões...
                                </option>
                              ) : (
                                <option value="">Selecione</option>
                              )}
                              {supervisoes &&
                                supervisoes?.map((supervisao) => (
                                  <option
                                    key={supervisao.id}
                                    value={supervisao.id}
                                  >
                                    {supervisao.nome}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      {/* Botões para submeter Forms */}
                      <div className="flex items-center justify-end mt-6 gap-x-6">
                        <Button
                          type="button"
                          className="px-3 py-2 text-sm font-semibold text-slate-700 hover:rounded-md hover:bg-red-500 hover:px-3 hover:py-2 hover:text-white"
                        >
                          Cancelar
                        </Button>
                        {isLoadingSubmitForm ? (
                          <Button
                            type="submit"
                            disabled={isLoadingSubmitForm}
                            className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                          >
                            <svg
                              className="w-5 h-5 mr-3 text-gray-400 animate-spin"
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
                            <span>Cadastrando...</span>
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                          >
                            <span>Cadastrar</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormRelatorio
