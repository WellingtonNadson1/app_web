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
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { CalendarCheck, Spinner } from '@phosphor-icons/react/dist/ssr'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'
import { z } from 'zod'
import { celulaDtaUpdate, celulaSchemaTableDateUpdate } from './schema'
import { celulaSchemaTable } from './table-celulas/schema'
import { BASE_URL } from '@/lib/axios'
import { useSession } from 'next-auth/react'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'

export default function UpdateDataOcorreCelula({
  date_que_ocorre,
  id,
  nome,
}: z.infer<typeof celulaSchemaTable>) {
  const queryClient = useQueryClient()
  const celulaId = id
  const URLCelulas = `${BASE_URL}/celulas`
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const token = session?.user?.token as string
  const axiosAuth = useAxiosAuth(token)

  const daysWeek = [
    { label: 'Domingo', value: '0' },
    { label: 'Segunda-feira', value: '1' },
    { label: 'Terça-feira', value: '2' },
    { label: 'Quarta-feira', value: '3' },
    { label: 'Quinta-feira', value: '4' },
    { label: 'Sexta-feira', value: '5' },
    { label: 'Sábado', value: '6' },
  ]

  const form = useForm<celulaDtaUpdate>({
    defaultValues: {
      id,
      date_que_ocorre,
    },
  })

  const updateDataQueOcorreCelulaFunction = async ({
    date_que_ocorre,
  }: z.infer<typeof celulaSchemaTableDateUpdate>) => {
    const response = await axiosAuth.put(URLCelulas, {
      id,
      date_que_ocorre,
    })
    form.reset()
    return response.data
  }

  const { mutateAsync: updateDataQueOcorreCelulaFn, isPending } = useMutation({
    mutationFn: updateDataQueOcorreCelulaFunction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['allCelulasIbb'] })
    },
  })

  const onSubmit: SubmitHandler<
    z.infer<typeof celulaSchemaTableDateUpdate>
  > = async ({ date_que_ocorre }) => {
    const id = celulaId
    try {
      await updateDataQueOcorreCelulaFn({ id, date_que_ocorre })
      toast({
        title: 'Sucesso!!!',
        description: 'Data Atualizada!!! 🥳',
      })
      form.reset()
    } catch (error) {
      toast({
        title: 'Erro!!!',
        description: 'Erro na Atualização da Data. 😰',
        variant: 'destructive',
      })
      console.error(error)
    }
  }

  return (
    <>
      {/* Vou preciar add scroll y para conseguir exibir todo o forms */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DropdownMenuItem className="w-full flex items-center justify-between gap-2 px-2 hover:bg-transparent hover:text-foreground">
                Data
                <CalendarCheck size={18} />
              </DropdownMenuItem>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </DialogTrigger>
        <DialogContent className="lg:max-w-screen-md overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Editar Data que Ocorre a Célula</DialogTitle>
            <DialogDescription>
              Edite os dados preenchendo o formulário
            </DialogDescription>
          </DialogHeader>

          {/* Incio do Forms */}
          <div className="relative w-full mx-auto ">
            <div className="flex justify-between">
              <div className="relative mx-auto py-4">
                <div className="p-2 mx-auto bg-white rounded-lg">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="pb-3">
                        {/* Nome da Celula */}
                        <div className="grid grid-cols-1 mt-6 gap-x-4 gap-y-6 sm:grid-cols-8">
                          <div className="space-y-2 sm:col-span-4">
                            <Label>Nome da Célula</Label>
                            <Input disabled value={nome} />
                          </div>
                          {/* Dia que a Celula Ocorre */}
                          <div className="sm:col-span-4">
                            <FormField
                              control={form.control}
                              name="date_que_ocorre"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Data que Ocorre</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma data" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {daysWeek?.map((day) => (
                                        <SelectItem
                                          key={day.value}
                                          value={day.value}
                                        >
                                          {day.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        {/* Botões para submeter Forms */}
                        <div className="flex items-center w-full sm:justify-end mt-6 gap-x-6">
                          <Button
                            type="submit"
                            className="px-3 py-2 text-sm w-full font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                          >
                            {isPending ? (
                              <div className="flex justify-between items-center gap-2">
                                Atualizando
                                <Spinner />
                              </div>
                            ) : (
                              <span>Atualizar</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
