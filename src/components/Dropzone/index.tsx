'use client'

import { errorCadastro, success } from "@/functions/functions"
import { UploadSimple } from "@phosphor-icons/react"
import { useSession } from "next-auth/react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { SubmitHandler, useForm } from "react-hook-form"

interface ILicaoCelula {
  title: string
  versiculoChave: string
  data_inicio: string
  data_termino: string
}

function DropzoneUpload() {
  // Logica Submit Data to BackEnd
  const hostname = 'app-ibb.onrender.com'
  // const URLSupervisoes = `https://${hostname}/supervisoes`
  const URLCelulas = `https://${hostname}/celulas`

  const { data: session } = useSession()
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const { register, handleSubmit, reset } = useForm<ILicaoCelula>()

  const onSubmit: SubmitHandler<ILicaoCelula> = async (data) => {
    try {
      console.log('Celula: ', data)
      setIsLoadingSubmitForm(true)

      const formatDatatoISO8601 = (dataString: string) => {
        const dataObj = new Date(dataString)
        return dataObj.toISOString()
      }

      data.data_inicio = formatDatatoISO8601(data.data_inicio)
      data.data_termino = formatDatatoISO8601(data.data_termino)

      const response = await fetch(URLCelulas, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsLoadingSubmitForm(false)
        setFormSuccess(true)
        success('Lição Cadastrada')
      } else {
        errorCadastro('Erro ao Cadastrar Lição')
      }
    } catch (error) {
      console.log(error)
      errorCadastro('Erro ao Cadastrar Lição')
    }
    reset()
  }

  // Logica Drop
  const [uploadFiles, setUploadFiles] = useState<File | null>(null)

  const onDrop = useCallback((files: File[]) => {
    setUploadFiles(files[0])
  }, [])

  if (uploadFiles) return null

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop,
  })
  return (
    <>
      <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
        <div className="text-center">
          <h2 className="mt-5 text-3xl font-bold text-gray-900">
            Cadastro de Lição!
          </h2>
          <p className="mt-2 text-sm text-gray-400">coloque as informações abaixo.</p>
        </div>

        <div className="relative mx-auto w-full px-2 py-2">
          <div className="flex justify-between">
            <div className="relative mx-auto px-2 py-7">
              <div className="mx-auto rounded-lg bg-white p-6">
                {/* Incio do Forms */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="pb-3">
                    <h2 className="text-sm uppercase leading-normal text-gray-400">
                      Tema de Lições de Célula
                    </h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-9">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Tema das Lições
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('title')}
                            type="text"
                            name="title"
                            id="title"
                            autoComplete="given-name"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="data_inicio"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Dt. Início
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('data_inicio')}
                            type="datetime-local"
                            name="data_inicio"
                            id="data_inicio"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="data_termino"
                          className="block text-sm font-medium leading-6 text-slate-700"
                        >
                          Dt. Final.
                        </label>
                        <div className="mt-3">
                          <input
                            {...register('data_termino')}
                            type="datetime-local"
                            name="data_termino"
                            id="data_termino"
                            className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Informações para Localização */}
                    <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <hr className="mx-0 my-4 h-px border-0 bg-transparent bg-gradient-to-r from-transparent via-black/50 to-transparent opacity-30" />
                        <h2 className="mt-8 text-sm uppercase leading-normal text-gray-400">
                          Descrição
                        </h2>
                      </div>
                    </div>

                    {/* Dropzone */}
                    <div {...getRootProps()} className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <label className="text-sm font-bold text-gray-500 tracking-wide">Anexar documento</label>
                      <div className="flex items-center justify-center w-full">
                        <input {...getInputProps()} type="file" className="hidden" />
                        <label className={`flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 ${isDragActive ? 'border-green-400' : 'border-gray-400'} text-center`}>
                          <div className="h-full w-full text-center flex flex-col items-center justify-center">
                            <div className="flex items-center flex-auto max-h-48 mx-auto -mt-10">
                              <UploadSimple size={32} color={isDragActive ? '#75d587' : '#827d7d'} />
                            </div>
                            {isDragActive ? (
                              <p className="pointer-none text-gray-500 "><span className="text-sm">Solte</span> o arquivo aqui</p>

                            ) : (
                              <p className="pointer-none text-gray-500 "><span className="text-sm">Arraste e solte</span> o arquivo aqui <br /> ou <a href="" id="" className="text-blue-600 hover:underline">selecione um arquivo</a> do seu dispositivo</p>
                            )}
                          </div>
                        </label>

                        {isDragReject && (
                          <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 border-red-400 text-center">
                            <div className="h-full w-full text-center flex flex-col items-center justify-center">
                              <div className="flex items-center flex-auto max-h-48 mx-auto -mt-10">
                                <UploadSimple size={32} color="#827d7d" />
                              </div>
                              <p className="pointer-none text-gray-500 "><span className="text-sm">Arquivo</span> não suportado</p>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">
                      <span>Tipo de arquivo permitido: pdf</span>
                    </p>
                    <div>
                      <button type="submit" className="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-md tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300">
                        Upload
                      </button>
                    </div>
                    {/* Botões para submeter Forms */}
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="button"
                        className="px-3 py-2 text-sm font-semibold text-slate-700 hover:rounded-md hover:bg-red-500 hover:px-3 hover:py-2 hover:text-white"
                      >
                        Cancelar
                      </button>
                      {isLoadingSubmitForm ? (
                        <button
                          type="submit"
                          disabled={isLoadingSubmitForm}
                          className="flex items-center justify-between rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
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
                          <span>Cadastrando...</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                        >
                          <span>Cadastrar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DropzoneUpload
