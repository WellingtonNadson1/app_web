'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PencilSimple } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { LicaoUpdateForm } from './_forms/licao-update-form'

type dataLicaoType = {
  id: string
  titulo: string
  versiculo_chave: string
  licao_lancando_redes: boolean
  data_inicio: string
  data_termino: string
  link_objeto_aws: string
}

export default function UpdateLicoesCelula({
  temaData,
}: {
  temaData: dataLicaoType
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DropdownMenuItem className="w-full flex items-center justify-between gap-2 px-2 hover:bg-transparent hover:text-foreground">
                Editar
                <PencilSimple size={18} />
              </DropdownMenuItem>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </DialogTrigger>
        <DialogContent className="lg:max-w-screen-md overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Atualizar Lição de Célula</DialogTitle>
            <DialogDescription>
              Edite os dados preenchendo o formulário
            </DialogDescription>
          </DialogHeader>

          {/* Incio do Forms */}
          <div className="relative w-full mx-auto ">
            <div className="flex justify-between">
              <div className="relative mx-auto py-4">
                <div className="p-2 mx-auto bg-white rounded-lg">
                  <div className="mt-2 card-body">
                    <LicaoUpdateForm key={temaData.id} licaoData={temaData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
