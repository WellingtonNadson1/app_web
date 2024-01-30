'use client'
import Modal from '@/components/modal'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import React, { Fragment, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useAxiosAuthToken from '@/lib/hooks/useAxiosAuthToken'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BASE_URL, BASE_URL_LOCAL, errorCadastro, success } from '@/functions/functions'
import SpinnerButton from '@/components/spinners/SpinnerButton'
import axios from 'axios'
import { Member } from '@/app/(authenticed)/novo-membro/schema'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type dataUpdateDiscipulador = {
  id: string,
  discipuladorId: string
}

interface Membro {
  id: string;
  first_name: string;
  cargo_de_lideranca: {
    id: string;
    nome: string;
  };
  user: {
    id: string;
    first_name: string;
  };
  situacao_no_reino: {
    id: string;
    nome: string;
  };
}

function UpdateDisicipulador({
  member,
}: {
  member: Membro
}) {

  console.log('memberBtnUpdateDiscipulador', member)
  const URLUsers = `${BASE_URL}/users`

  const { data: session } = useSession()
  const axiosAuth = useAxiosAuthToken(session?.user.token as string)

  const [isLoadingSubmitUpDate, setIsLoadingSubmitUpDate] = useState(false)
  const [nome, setNome] = useState(member.user.first_name);
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset } = useForm<dataUpdateDiscipulador>()

  const cancelButtonRef = useRef(null)

  // Combobox Autocomplete
  const [selectedMember, setSelectedMember] = useState<Member>()
  const [queryUpDate, setQueryUpDate] = useState('')

  const UpdateDiscipuladorFunction = async (dataForm: dataUpdateDiscipulador) => {
    try {
      const { data } = await axiosAuth.put(URLUsers, dataForm)
      return data
    } catch (error) {
      console.error('⛔ error na atualização do Discipulador', error)
    }
  }

  const { mutateAsync: updateDiscipuladorFn } = useMutation({
    mutationFn: UpdateDiscipuladorFunction,
    onSuccess(_, variables) {
      const cached = queryClient.getQueryData(["celula"])

      // Atualizando o cached da lista de membros e discipuladores atraves do HTTPState
      queryClient.setQueryData(["celula"], (data: any) => {
        console.log('selectedMember', selectedMember)
        return {
          ...data,
          user: {
            id: selectedMember?.id,
            first_name: selectedMember?.first_name,
          }
        }
      })
    },
  })

  // Funcao para submeter os dados do Formulario Preenchido
  const onSubmit: SubmitHandler<dataUpdateDiscipulador> = async (data) => {
    data.id = member.id;
    selectedMember && (data.discipuladorId = selectedMember?.id);
    setIsLoadingSubmitUpDate(true)
    try {
      await updateDiscipuladorFn({
        id: data.id,
        discipuladorId: data.discipuladorId
      })
      setIsLoadingSubmitUpDate(false)
      success('🙌🏻 Disicipulador Atualizado!')
      reset()
    } catch (error) {
      errorCadastro('⛔ Error na Atualização!')
      console.error('⛔ error na atualização do Discipulador', error)
      setIsLoadingSubmitUpDate(false)
    }
  }

  const AllMembers = async () => {
    try {
      const { data } = await axiosAuth.get(URLUsers)
      return data
    }
    catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(error.response.data)
      } else {
        console.error(error)
      }
    }
  }

  const { data: queryMembers, isLoading: isLoadingQueryUpdate } = useQuery<Member[]>({
    queryKey: ["membersquery"],
    queryFn: AllMembers,
    retry: 3,
  })

  if (isLoadingQueryUpdate) {
    return null
  }

  const filteredPeople =
    queryUpDate === ''
      ? queryMembers
      : queryMembers?.filter((person) =>
        person.first_name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(queryUpDate.toLowerCase().replace(/\s+/g, '')),
      )

  return (
    isLoadingQueryUpdate ?
      (
        <SpinnerButton message='' />
      )
      : (
        <Fragment>
          <ToastContainer />
          <Modal
            icon={UserPlusIcon}
            titleModal="Atualizar Discipulador"
            titleButton="Editar"
            buttonProps={{
              className:
                'z-10 rounded-md bg-green-500 text-white mt-2 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:w-full',
            }}
          >
            {/* Incio do Forms */}
            <div className="relative w-full px-2 py-2 mx-auto">
              <div className="flex justify-between">
                <div className="relative px-2 py-5 mx-auto">
                  <div className="p-6 mx-auto bg-white rounded-lg">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="pb-12 border-b border-gray-900/10">
                        <h2 className="text-sm leading-normal text-gray-400 uppercase">
                          Informações Discipulado
                        </h2>

                        <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="membro"
                              className="block text-sm font-medium leading-6 text-slate-700"
                            >
                              Membro
                            </label>
                            <div className="mt-3">
                              <input
                                type="text"
                                name="membro"
                                value={member.first_name}
                                id="membro"
                                disabled
                                autoComplete="family-name"
                                className="disabled:opacity-75 block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>

                        {/* INFORMAÇÕES DO DISCIPULADOR */}
                        <div className="grid grid-cols-1 mt-10 gap-x-4 gap-y-6 sm:grid-cols-6">
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="is_discipulado"
                              className="block text-sm font-medium leading-6 text-slate-700"
                            >
                              Discipulador Atual
                            </label>
                            <div className="mt-3">
                              <input
                                {...register('id',)}
                                type="text"
                                value={nome}
                                id="is_discipulado"
                                disabled
                                className="disabled:opacity-75 block w-full rounded-md border-0 py-1.5 text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-4">
                            <label
                              htmlFor="discipuladorId"
                              className="block text-sm font-medium leading-6 text-slate-700"
                            >
                              Digite o Novo Discipulador
                            </label>
                            <div className="mt-3">
                              <Combobox
                                value={selectedMember}
                                onChange={setSelectedMember}
                              >
                                <div className="relative">
                                  <div className="relative w-full overflow-hidden text-left bg-white rounded-md shadow-sm cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                    <Combobox.Input
                                      {...register('discipuladorId')}
                                      id="discipuladorId"
                                      className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none rounded-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                      displayValue={(person: Member) =>
                                        person.first_name
                                      }
                                      onChange={(event) =>
                                        setQueryUpDate(event.target.value)
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
                                    afterLeave={() => setQueryUpDate('')}
                                  >
                                    <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filteredPeople?.length === 0 &&
                                        queryUpDate !== '' ? (
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
                        </div>
                      </div>

                      {/* Botões para submeter Forms */}
                      <div className="flex items-center justify-end mt-6 gap-x-6">
                        <button
                          type="button"
                          ref={cancelButtonRef}
                          onClick={() => reset()}
                          className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:px-3 hover:py-2 hover:text-gray-900 sm:mt-0 sm:w-auto"
                        >
                          Cancelar
                        </button>
                        {isLoadingSubmitUpDate ? (
                          <button
                            type="submit"
                            disabled={isLoadingSubmitUpDate}
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
                            <span>Atualizando...</span>
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
                    </form>
                  </div>
                </div>
              </div>
            </div >
          </Modal >
        </Fragment>
      )
  )
}

export default UpdateDisicipulador
