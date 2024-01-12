'use client'
import Modal from '@/components/modal'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { Fragment, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  CargoLidereanca,
  Encontros,
  Escolas,
  Member,
  SituacoesNoReino,
  SupervisaoData,
} from './schema'
import { handleCPFNumber, handlePhoneNumber } from './utils'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import { useQuery } from '@tanstack/react-query'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { handleZipCode } from '@/functions/zipCodeUtils'
import { errorCadastro, success } from '@/functions/functions'
import axios from 'axios'

function AddNewMember() {
  // const hostnameLocal = 'localhost:3333'
  // const URLUsers = `http://${hostnameLocal}/users`
  // const URLCombinedData = `http://${hostnameLocal}/users/all`
  const hostname = 'app-ibb.onrender.com'
  const URLUsers = `https://${hostname}/users`
  const URLCombinedData = `https://${hostname}/users/all`

  const { data: session } = useSession()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  const [supervisaoSelecionada, setSupervisaoSelecionada] = useState<string>()
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const { register, handleSubmit, setValue, reset } = useForm<Member>()
  const router = useRouter()

  // Combobox Autocomplete
  const [selected, setSelected] = useState<Member>()
  const [query, setQuery] = useState('')

  const handleCahngeIsBatizado = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'true'
    setValue(`batizado`, value)
  }

  const handleCahngeIsDiscipulado = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value === 'true'
    setValue(`is_discipulado`, value)
  }

  const handleCahngeHasFilho = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'true'
    setValue(`has_filho`, value)
  }

  const handleZipCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
    handleZipCode(e, setValue);
  };

  // Funcao para submeter os dados do Formulario Preenchido
  const onSubmit: SubmitHandler<Member> = async (data) => {
    try {
      const selectedIsDiscipulado = Boolean(data.is_discipulado)
      const selectedHasFilho = Boolean(data.has_filho)
      const selectedBatizado = Boolean(data.batizado)
      const passwordDefault = 'JesusCristoReina'
      const selectedEncontros = data?.encontros?.filter((id) => id !== '')
      const selectedEscolas = data?.escolas?.filter((id) => id !== '')

      // Verifica se não há encontros selecionados e define o valor como nulo
      const encontrosToSend =
        selectedEncontros && selectedEncontros.length === 0
          ? null
          : selectedEncontros

      const escolasToSend =
        selectedEscolas && selectedEscolas.length === 0 ? null : selectedEscolas

      const dataToSend = {
        ...data,
        discipuladorId: selected?.id,
        encontros: encontrosToSend,
        escolas: escolasToSend,
        is_discipulado: selectedIsDiscipulado,
        has_filho: selectedHasFilho,
        batizado: selectedBatizado,
        password: passwordDefault,
      }

      setIsLoadingSubmitForm(true)

      console.log('Data Form2: ', dataToSend)

      const response = await fetch(URLUsers, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify(dataToSend),
      })
      if (response.ok) {
        setIsLoadingSubmitForm(false)
        success('👍🏻 Membro Cadastrado!')
        reset()
        router.refresh()
      } else {
        errorCadastro('👎🏻 Erro no Cadastro!')
        setIsLoadingSubmitForm(false)
      }
    } catch (error) {
      errorCadastro('👎🏻 Erro no Cadastro!')
      setIsLoadingSubmitForm(false)
    }
  }

  const DataCombineted = async () => {
    try {
      const response = await axiosAuth.get(URLCombinedData)
      return await response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const { data: combinedData, isError: error, isLoading } = useQuery({
    queryKey: ["cultossemanais"],
    queryFn: DataCombineted,
  })

  const AllUsers = async () => {
    try {
      const response = await axiosAuth.get(URLUsers)
      return await response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const { data: queryMembers } = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: AllUsers,
  })

  const filteredPeople =
    query === ''
      ? queryMembers
      : queryMembers?.filter((person) =>
        person.first_name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, '')),
      )

  // Agora você pode acessar os diferentes conjuntos de dados a partir de combinedData
  const supervisoes: SupervisaoData[] = combinedData ? combinedData[0] : undefined
  const escolas: Escolas[] = combinedData ? combinedData[1] : undefined
  const encontros: Encontros[] = combinedData ? combinedData[2] : undefined
  const situacoesNoReino: SituacoesNoReino[] = combinedData ? combinedData[3] : undefined
  const cargoLideranca: CargoLidereanca[] = combinedData ? combinedData[4] : undefined

  if (error)
    return (
      <div className="w-full px-2 py-2 mx-auto">
        <div className="w-full mx-auto">
          <div>Falha ao carregar, atualize a página.</div>
        </div>
      </div>
    )

  if (!supervisoes) {
    return (
      <div className="z-50 w-full px-2 py-2 mx-auto">
        <div className="flex items-center w-full gap-2 mx-auto">
          <SpinnerButton message={''} />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <SpinnerButton message={'Carregando'} />
    )
  }

  const handleSupervisaoSelecionada = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSupervisaoSelecionada(event.target.value)
  }

  const celulasFiltradas = (supervisoes ?? []).find(
    (supervisao) => supervisao.id === supervisaoSelecionada,
  )?.celulas
  return (
    <>
      <ToastContainer />
      <Modal
        icon={UserPlusIcon}
        titleModal="Cadastro de Membro"
        titleButton="+ Add Membro"
        buttonProps={{
          className:
            'z-10 rounded-md bg-slate-950 text-white px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874] sm:w-full',
        }}
      >
        {/* Incio do Forms */}
        <div className="relative w-full px-2 py-2 mx-auto">
          <div className="flex justify-between">
            <div className="relative px-2 mx-auto py-7">
              <div className="p-6 mx-auto bg-white rounded-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="pb-12 border-b border-gray-900/10">
                    <h2 className="text-sm leading-normal text-gray-400 uppercase">
                      Informações Pessoais
                    </h2>

                    <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="first_name"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Primeiro Nome
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('first_name')}
                            type="text"
                            name="first_name"
                            id="first_name"
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="last_name"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Sobrenome
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('last_name')}
                            type="text"
                            name="last_name"
                            id="last_name"
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="cpf"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          CPF
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('cpf')}
                            type="text"
                            onKeyUp={handleCPFNumber}
                            maxLength={14}
                            name="cpf"
                            id="cpf"
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="date_nascimento"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Dt. Nasc.
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('date_nascimento')}
                            type="datetime-local"
                            id="date_nascimento"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="sexo"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Sexo
                        </label>
                        <div className="mt-3">
                          <select
                            {...register('sexo')}
                            id="sexo"
                            name="sexo"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option value={''}>Selecione</option>
                            <option value={'M'}>M</option>
                            <option value={'F'}>F</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Endereço de Email
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('email')}
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="telefone"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Telefone
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('telefone')}
                            id="telefone"
                            onKeyUp={handlePhoneNumber}
                            maxLength={14}
                            name="telefone"
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="escolaridade"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Escolaridade
                        </label>
                        <div className="mt-3">
                          <select
                            {...register('escolaridade')}
                            id="escolaridade"
                            name="escolaridade"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option value={''}>Selecione</option>
                            <option value={'Sem Escolaridade'}>
                              Sem Escolaridade
                            </option>
                            <option value={'Fundamental Incompleto'}>
                              Fundamental Incompleto
                            </option>
                            <option value={'Fundamental Completo'}>
                              Fundamental Completo
                            </option>
                            <option value={'Médio Incompleto'}>
                              Médio Incompleto
                            </option>
                            <option value={'Médio Completo'}>
                              Médio Completo
                            </option>
                            <option value={'Superior Incompleto'}>
                              Superior Incompleto
                            </option>
                            <option value={'Superior Completo'}>
                              Superior Completo
                            </option>
                            <option value={'Pós Graduado'}>Pós Graduado</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="profissao"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Profissão
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('profissao')}
                            id="profissao"
                            name="profissao"
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    {/* INFORMAÇÕES DO REINO */}
                    <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <hr className="h-px mx-0 my-4 bg-transparent border-0 bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                        <h2 className="mt-8 text-sm leading-normal text-gray-400 uppercase">
                          Informações do Reino
                        </h2>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="batizado"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Batizado
                        </label>
                        <div className="mt-3">
                          <select
                            {...register('batizado')}
                            onChange={handleCahngeIsBatizado}
                            id="batizado"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option value={''}>Selecione</option>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="date_batizado"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Dt. Batismo
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('date_batizado')}
                            id="date_batizado"
                            type="datetime-local"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="is_discipulado"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Discipulado
                        </label>
                        <div className="mt-3">
                          <select
                            {...register('is_discipulado')}
                            onChange={handleCahngeIsDiscipulado}
                            id="is_discipulado"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option value={''}>Selecione</option>
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="discipuladorId"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Discipulador
                        </label>
                        <div className="mt-3">
                          <Combobox value={selected} onChange={(newValue) => setSelected(newValue)}>
                            <div className="relative">
                              <div className="relative w-full overflow-hidden text-left bg-white rounded-md shadow-sm cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                <Combobox.Input
                                  {...register('discipuladorId')}
                                  id="discipuladorId"
                                  className="w-full rounded-md border-none py-1.5 pl-3 pr-10 text-sm leading-5 text-gray-900 ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                  displayValue={(person: Member) =>
                                    person.first_name
                                  }
                                  onChange={(event) =>
                                    setQuery(event.target.value)
                                  }
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="w-5 h-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </Combobox.Button>
                              </div>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => setQuery('')}
                              >
                                <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {filteredPeople?.length === 0 &&
                                    query !== '' ? (
                                    <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                                      Nothing found.
                                    </div>
                                  ) : (
                                    filteredPeople?.map((person) => (
                                      <Combobox.Option
                                        key={person.id}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${active
                                            ? 'bg-teal-600 text-white'
                                            : 'text-gray-900'
                                          }`
                                        }
                                        value={person}
                                      >
                                        {({ selected, active }) => (
                                          <>
                                            <span
                                              className={`block truncate ${selected
                                                ? 'font-medium'
                                                : 'font-normal'
                                                }`}
                                            >
                                              {person.first_name}
                                            </span>
                                            {selected ? (
                                              <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active
                                                  ? 'text-white'
                                                  : 'text-teal-600'
                                                  }`}
                                              >
                                                <CheckIcon
                                                  className="w-5 h-5"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Combobox.Option>
                                    ))
                                  )}
                                </Combobox.Options>
                              </Transition>
                            </div>
                          </Combobox>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="supervisao_pertence"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Supervisão
                        </label>
                        <div className="mt-3">
                          <select
                            {...register('supervisao_pertence')}
                            id="supervisao_pertence"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            onChange={handleSupervisaoSelecionada}
                          >
                            <option value={''}>Selecione</option>
                            {!isLoading ? (
                              supervisoes?.map((supervisao) => (
                                <option key={supervisao.id} value={supervisao.id}>
                                  {supervisao.nome}
                                </option>
                              ))
                            ) : (
                              <option value={''}>Carregando...</option>
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="celula"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Célula
                        </label>
                        <div className="mt-3">
                          <select
                            {...register('celula')}
                            id="celula"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option value={''}>Selecione</option>
                            {!isLoading ? (
                              celulasFiltradas?.map((celula) => (
                                <option key={celula.id} value={celula.id}>
                                  {celula.nome}
                                </option>
                              ))
                            ) : (
                              <option value={''}>Carregando...</option>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Escolas Realizadas */}
                    <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <div className="mt-3 sm:col-span-6">
                        <fieldset>
                          <legend className="block text-sm font-medium leading-6 text-slate-700">
                            Escolas Feitas
                          </legend>
                          <div className="flex flex-wrap items-center justify-between w-full mt-4 gap-x-8">
                            {!isLoading ? (
                              escolas?.map((escola) => (
                                <div
                                  key={escola.id}
                                  className="relative flex gap-x-3"
                                >
                                  <div className="flex items-center h-6">
                                    <input
                                      {...register('escolas')}
                                      id={escola.id}
                                      value={escola.id}
                                      type="checkbox"
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded shadow-sm focus:ring-blue-600"
                                    />
                                  </div>
                                  <div className="text-sm leading-6">
                                    <label
                                      htmlFor={escola.id}
                                      className="font-medium text-slate-700"
                                    >
                                      {escola.nome}
                                    </label>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>Carregando...</p>
                            )}
                          </div>
                        </fieldset>
                      </div>
                    </div>

                    {/* Econtros Realizados */}
                    <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <div className="mt-3 sm:col-span-3">
                        <fieldset>
                          <legend className="block text-sm font-medium leading-6 text-slate-700">
                            Encontros Participados
                          </legend>
                          <div className="flex flex-wrap items-center justify-between w-full mt-4 gap-x-8">
                            {supervisoes ? (
                              encontros?.map((encontro) => (
                                <div
                                  key={encontro.id}
                                  className="relative flex gap-x-3"
                                >
                                  <div className="flex items-center h-6">
                                    <input
                                      {...register('encontros')}
                                      value={encontro.id}
                                      id={encontro.id}
                                      type="checkbox"
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded shadow-sm focus:ring-blue-600"
                                    />
                                  </div>
                                  <div className="text-sm leading-6">
                                    <label
                                      htmlFor={encontro.id}
                                      className="font-medium text-slate-700"
                                    >
                                      {encontro.nome}
                                    </label>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p>Carregando...</p>
                            )}
                          </div>
                        </fieldset>
                      </div>
                      {/* Situação No reino */}
                      <div className="mt-3 ml-2 sm:col-span-3">
                        <label
                          htmlFor="situacao_no_reino"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Situação no Reino
                        </label>
                        <div className="mt-3">
                          <select
                            {...register('situacao_no_reino')}
                            id="situacao_no_reino"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option value={''}>Selecione</option>
                            {!isLoading ? (
                              situacoesNoReino?.map((situacao) => (
                                <option key={situacao.id} value={situacao.id}>
                                  {situacao.nome}
                                </option>
                              ))
                            ) : (
                              <option value={''}>Carregando...</option>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 mt-3 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <div className="col-span-6">
                        <label
                          htmlFor="cargo_de_lideranca"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Cargo de Liderança
                        </label>
                        <div className="mt-4">
                          <select
                            {...register('cargo_de_lideranca')}
                            id="cargo_de_lideranca"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option value={''}>Selecione</option>
                            {!isLoading ? (
                              cargoLideranca?.map((cargo) => (
                                <option key={cargo.id} value={cargo.id}>
                                  {cargo.nome}
                                </option>
                              ))
                            ) : (
                              <option value={''}>Carregando...</option>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* INFORMAÇÕES CONJUGAIS */}
                    <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <hr className="h-px mx-0 my-4 bg-transparent border-0 bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                        <h2 className="mt-8 text-sm leading-normal text-gray-400 uppercase">
                          Informações Conjugais
                        </h2>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="estadoCivil"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Estado Civil
                        </label>
                        <div className="mt-3">
                          <select
                            {...register('estado_civil')}
                            id="estadoCivil"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option value={''}>Selecione</option>
                            <option value={'Casado'}>Casado(a)</option>
                            <option value={'Solteiro'}>Solteiro(a)</option>
                            <option value={'Viuvo'}>Viúvo(a)</option>
                            <option value={'Divorciado'}>Divorciado(a)</option>
                            <option value={'Uniao_Estável'}>União Estável</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="nome_conjuge"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Nome Conjuge
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('nome_conjuge')}
                            type="text"
                            name="nome_conjuge"
                            id="nome_conjuge"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="date_casamento"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Data/Casamento
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('date_casamento', {
                              setValueAs: (value) =>
                                value ? Date.parse(value) : null,
                            })}
                            type="datetime-local"
                            id="date_casamento"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="has_filho"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Tem Filho?
                        </label>
                        <div className="mt-3">
                          <select
                            {...register('has_filho')}
                            onChange={handleCahngeHasFilho}
                            id="has_filho"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option value={''}>Selecione</option>
                            <option value={'true'}>Sim</option>
                            <option value={'false'}>Não</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="quantidade_de_filho"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Qntd. Filho(s)
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('quantidade_de_filho', {
                              setValueAs: (value) =>
                                value ? parseInt(value) : 0,
                            })}
                            type="number"
                            id="quantidade_de_filho"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Informações para Visita */}
                    <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <hr className="h-px mx-0 my-4 bg-transparent border-0 bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                        <h2 className="mt-8 text-sm leading-normal text-gray-400 uppercase">
                          Endereço para Visita/Contato
                        </h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 mt-3 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="cep"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Cep
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('cep')}
                            type="text"
                            id="cep"
                            onKeyUp={handleZipCodeChange}
                            maxLength={9}
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="cidade"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Cidade
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('cidade')}
                            type="text"
                            id="cidade"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="estado"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Estado
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('estado')}
                            type="text"
                            id="estado"
                            autoComplete="address-level1"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 mt-3 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <div className="col-span-2">
                        <label
                          htmlFor="bairro"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Bairro
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('bairro')}
                            type="text"
                            id="bairro"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="col-span-3">
                        <label
                          htmlFor="endereco"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Endereço
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('endereco')}
                            type="text"
                            id="endereco"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="numero_casa"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Nº
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('numero_casa')}
                            type="text"
                            id="numero_casa"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botões para submeter Forms */}
                  <div className="flex items-center justify-end mt-6 gap-x-6">
                    <button
                      type="button"
                      onClick={() => reset()}
                      className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:px-3 hover:py-2 hover:text-gray-900 sm:mt-0 sm:w-auto"
                    >
                      Cancelar
                    </button>
                    {isLoadingSubmitForm ? (
                      <button
                        type="submit"
                        disabled={isLoadingSubmitForm}
                        className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
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
                        <span>Cadastrando...</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                      >
                        <span>Cadastrar</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default AddNewMember
