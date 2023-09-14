'use client'

import { UploadSimple } from "@phosphor-icons/react"

function Dropzone() {
  return (
    <>
        <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
          <div className="text-center">
            <h2 className="mt-5 text-3xl font-bold text-gray-900">
              Cadastro de Lição!
            </h2>
            <p className="mt-2 text-sm text-gray-400">coloque as informações abaixo.</p>
          </div>
          <form className="mt-8 space-y-3" action="#" method="POST">
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-sm font-bold text-gray-500 tracking-wide">Título da lição</label>
              <input className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" type="" placeholder="nome da lição" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-bold text-gray-500 tracking-wide">Versículo Chave</label>
                <input className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" type="" placeholder="versículo chave" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-500 tracking-wide">Período</label>
                <input className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500" type="" />
              </div>
            </div>
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-sm font-bold text-gray-500 tracking-wide">Anexar documento</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                  <div className="h-full w-full text-center flex flex-col items-center justify-center">
                    <div className="flex items-center flex-auto max-h-48 mx-auto -mt-10">
                    <UploadSimple size={32} color="#827d7d" />
                    </div>
                    <p className="pointer-none text-gray-500 "><span className="text-sm">Arraste e solte</span> o arquivo aqui <br /> ou <a href="" id="" className="text-blue-600 hover:underline">selecione um arquivo</a> do seu dispositivo</p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
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
          </form>
        </div>
    </>
  )
}

export default Dropzone