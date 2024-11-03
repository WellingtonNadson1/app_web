'use client'
import { BASE_URL } from '@/functions/functions'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Spinner, Trash } from '@phosphor-icons/react/dist/ssr'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { Toaster } from '../ui/toaster'
import { toast } from '../ui/use-toast'

function DeleteCulto({
  culto,
  cultoName,
}: {
  culto: string
  cultoName: string
}) {
  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth(session?.user.token as string)

  const deleteCultoFunction = async (cultoId: string) => {
    const URLCultosInd = `${BASE_URL}/cultosindividuais/${cultoId}`
    try {
      const response = await axiosAuth.delete(URLCultosInd)
      toast({
        title: 'Sucesso!!!',
        description: 'Culto DELETADO com Sucesso!!! 🥳',
      })
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const { mutateAsync: deleteCultoFn, isPending } = useMutation({
    mutationFn: deleteCultoFunction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cultosMarcados'] })
    },
  })

  const handleDelete = async (cultoId: string) => {
    await deleteCultoFn(cultoId)
  }

  const [open, setOpen] = useState(false)

  return (
    <>
      <Toaster />
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
            <DialogTitle>Deletar Culto</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja deletar este culto?
            </DialogDescription>
          </DialogHeader>
          <div className="text-center my-2 py-2 text-gray-700 border rounded-md bg-gray-50">
            {cultoName}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:gap-0 sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant={'outline'} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={'destructive'}
              onClick={() => handleDelete(culto)}
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

export default DeleteCulto
