'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import { BASE_URL } from '@/lib/axios'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Spinner, Trash } from '@phosphor-icons/react/dist/ssr'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function DeleteCelula({
  celulaId,
  celulaName,
}: {
  celulaId: string
  celulaName: string
}) {
  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const token = session?.user?.token as string
  const axiosAuth = useAxiosAuth(token)

  const deleteMemberFunction = async (CelulaId: string) => {
    const URLM = `${BASE_URL}/celulas/${CelulaId}`
    try {
      const response = await axiosAuth.delete(URLM)
      toast({
        title: 'Sucesso!!!',
        description: 'Célula DELETADA com Sucesso!!! 🧨',
      })
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const { mutateAsync: deleteCelulaFn, isPending } = useMutation({
    mutationFn: deleteMemberFunction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['allCelulasIbb'] })
    },
  })

  const handleDeleteCelula = async (CelulaId: string) => {
    await deleteCelulaFn(CelulaId)
  }

  const [open, setOpen] = useState(false)

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <DropdownMenuItem
            className="w-full flex items-center justify-between text-red-600"
            onSelect={(e) => e.preventDefault()}
          >
            Deletar
            <Trash size={18} />
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[580px]">
          <DialogHeader>
            <DialogTitle>Deletar Célula</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja deletar esta Célula?
            </DialogDescription>
          </DialogHeader>
          <div className="text-center my-2 py-2 text-gray-700 border rounded-md bg-gray-50">
            {celulaName}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:gap-0 sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant={'outline'} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={'destructive'}
              onClick={() => handleDeleteCelula(celulaId)}
              type="submit"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-3">
                  <Spinner className="animate-spin" />
                  Deletando...
                </div>
              ) : (
                'Deletar'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
