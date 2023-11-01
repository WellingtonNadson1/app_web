'use client'
import { ICelula } from '@/components/ListCelulas'
import { BASE_URL, errorCadastro, success } from '@/functions/functions'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'
import { z } from 'zod'
import Modal from '@/components/modal'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import SpinnerButton from '@/components/spinners/SpinnerButton'

interface Member {
  id: string;
  first_name: string;
  cargo_de_lideranca: {
    id: string;
    nome: string;
  };
  situacao_no_reino: {
    id: string;
    nome: string;
  };
}

interface Lider {
  id: string;
  first_name: string;
}

interface Supervisao {
  id: string;
  nome: string;
}

interface ReuniaoCelula {
  id: string;
  data_reuniao: string;
  status: string;
  presencas_membros_reuniao_celula: any[]; // You can replace 'any' with the appropriate type if needed
}

interface DataCelula {
  id: string;
  nome: string;
  membros: Member[];
  lider: Lider;
  supervisao: Supervisao;
  date_que_ocorre: string;
  reunioes_celula: ReuniaoCelula[];
}

const schemaFormCelulaDate = z.object({
  id: z.string(),
  date_que_ocorre: z.string().datetime(),
})

type FormCelulaDate = z.infer<typeof schemaFormCelulaDate>

const schemaFormCelula = z.object({
  id: z.string(),
  nome: z.string(),
  lider: z.string().uuid(),
  supervisao: z.string().uuid(),
  cep: z.string(),
  cidade: z.string(),
  estado: z.string(),
  bairro: z.string(),
  endereco: z.string(),
  numero_casa: z.string(),
  date_inicio: z.string().datetime(),
  date_multipicar: z.string().datetime(),
  date_que_ocorre: z.string().datetime(),
  membros: z.string().uuid().array(),
})

type FormCelula = z.infer<typeof schemaFormCelula>

interface Celula {
  id: string
  nome: string
  lider: {
    id: string
    first_name: string
  }
}

interface User {
  id: string
  first_name?: string
  cargo_de_lideranca: { 
    id: string, 
    nome: string },
  situacao_no_reino: { 
    id: string, 
    nome: string
  }
}

export interface SupervisaoData {
  id: string
  nome: string
  membros: User[]
  celulas: Celula[]
}

export default function UpdateCelula2({
  id,
  shouldFetch,
}: {
  id: string
  shouldFetch: boolean
}) {
  const URLSupervisoes = `${BASE_URL}/supervisoes`
  const URLCelulaId = `${BASE_URL}/celulas/${id}`
  const URLCelulas = `${BASE_URL}/celulas`
  const { data: session } = useSession()
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>()
  const [supervisoes, setSupervisoes] = useState<SupervisaoData[]>()
  const [usersSupervisaoSelecionada, setUsersSupervisaoSelecionada] = useState<
    User[]
  >([])
  const [dataCelulas, setDataCelulas] = useState<ICelula[]>()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)
  const { register, handleSubmit, reset, setValue } = useForm<FormCelula>({
    defaultValues: async () => {
      if (!id) return {}

      const response = await axiosAuth.get(URLCelulaId)
      const dataCelula =  response.data
      return dataCelula
    },
  })

  const onSubmit: SubmitHandler<FormCelula> = async ({
    date_que_ocorre
  }) => {
    try {
      setIsLoadingSubmitForm(true)

      const response = await axiosAuth.put(URLCelulas, { 
        id , date_que_ocorre
      })
      const celulaRegister = response.data
      console.log('Dados da celula, date: ', celulaRegister);
      

      if (celulaRegister) {
        setIsLoadingSubmitForm(false)
        setFormSuccess(true)
        success('Célula Atualizada')
        setTimeout(() => {
          window.location.reload()
        }, 2500);
        
      } else {
        errorCadastro('Erro ao Atualizar Célula')
      }
    } catch (error) {
      console.log(error)
      setIsLoadingSubmitForm(false)
      errorCadastro('Erro ao Atualizar Célula')
    }
    reset()
  }

  useEffect(() => {
    setIsLoading(true)
    axiosAuth.get(URLSupervisoes)
      .then(response => {
        setSupervisoes(response.data);
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        setIsLoading(false)
      });
  }, []);

  const fetchCelulas = useCallback(async () => {
    try {
      const response = await axiosAuth.get(URLCelulas)
      const getCelulaRegister = response.data
      if (!getCelulaRegister) {
        console.log('Failed to fetch get Celulas.')
      }
      setDataCelulas(getCelulaRegister)
    } catch (error) {
      console.log(error)
    }
  }, [session?.user.token])

  // UseEffect para buscar as células quando a página é carregada
  useEffect(() => {
    fetchCelulas()
  }, [fetchCelulas])

  // UseEffect para buscar as células após o envio do formulário
  useEffect(() => {
    if (formSuccess) {
      fetchCelulas()
    }
  }, [formSuccess, fetchCelulas])

  useEffect(() => {
    if (supervisaoSelecionada) {
      // Use the selected supervision ID to filter the list of users
      const selectedSupervisao = supervisoes?.find(
        (supervisao) => supervisao.id === supervisaoSelecionada,
      )
      if (selectedSupervisao) {
        setUsersSupervisaoSelecionada(selectedSupervisao.membros)
      } else {
        setUsersSupervisaoSelecionada([])
      }
    }
  }, [supervisaoSelecionada, supervisoes])
  return (
    <>
      <div className="relative ">
        <div className="w-full rounded-xl ">
          <div className="flex justify-between w-full gap-3 px-1 py-2 rounded-md items center sm:justify-start">
            <Modal
              icon={UserPlusIcon}
              titleModal="Atalização de Céula"
              titleButton="Editar"
              buttonProps={{
                className:
                  'z-10 rounded-md bg-blue-950 text-white px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700',
              }}
            >
              <div className="relative w-full px-2 py-2 mx-auto">
                <div className="flex justify-between">
                  <div className="relative px-2 mx-auto py-7">
                    <div className="p-6 mx-auto bg-white rounded-lg">
                      {/* Incio do Forms */}
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="pb-3">
                          <h2 className="text-sm leading-normal text-gray-400 uppercase">
                            Atualização de Célula
                          </h2>

                          <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-9">
                            <div className="sm:col-span-3">
                              <label
                                htmlFor="nome"
                                className="block text-sm font-medium leading-6 text-slate-700"
                              >
                                Nome da Célula
                              </label>
                              <div className="mt-3">
                                <input
                                  {...register('nome')}
                                  type="text"
                                  id="nome"
                                  disabled
                                  className="disabled:opacity-75 block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-2">
                              <label
                                htmlFor="date_que_ocorre"
                                className="block text-sm font-medium leading-6 text-slate-700"
                              >
                                Dia que Ocorre
                              </label>
                              <div className="mt-3">
                                <select
                                  {...register('date_que_ocorre')}
                                  id="date_que_ocorre"
                                  className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                >
                                  <option value="">
                                    Selecione
                                  </option>
                                  <option value="0">Domingo</option>
                                  <option value="1">Segunda</option>
                                  <option value="2">Terça</option>
                                  <option value="3">Quarta</option>
                                  <option value="4">Quinta</option>
                                  <option value="5">Sexta</option>
                                  <option value="6">Sábado</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Botões para submeter Forms */}
                          <div className="flex items-center justify-end mt-6 gap-x-6">
                            {isLoadingSubmitForm ? (
                              <button
                                type="submit"
                                disabled={isLoadingSubmitForm}
                                className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                              >
                                <SpinnerButton message={'Atualizando'} />
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                              >
                                <span>Atualizar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  )
}
