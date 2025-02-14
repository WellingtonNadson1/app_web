'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'

const DATE_REQUIRED_ERROR = 'Date is required.'

const formSchema = z.object({
  tema: z.string(),
  versiculo_chave: z.string(),
  folderName: z.string().min(2, {
    message: 'Theme must be at least 2 characters.',
  }),
  date: z
    .object(
      {
        from: z.date().optional(),
        to: z.date().optional(),
      },
      { required_error: DATE_REQUIRED_ERROR },
    )
    .refine((date) => {
      return !!date.from
    }, DATE_REQUIRED_ERROR),
  comment: z.string().min(1, { message: 'A comment is required.' }),
})

type FormData = z.infer<typeof formSchema>

type Theme = {
  tema: string
  versiculo_chave: string
  id: string
  data_inicio: string
  data_termino: string
}

type ThemeUpdateFormProps = {
  temaData: Theme
}

export function ThemeUpdateForm({ temaData }: ThemeUpdateFormProps) {
  const queryClient = useQueryClient()
  const URLApi = '/api/licoes-celula/create-tema-folder'
  const { toast } = useToast()
  const { data: session } = useSession()
  const token = session?.user?.token as string
  const axiosAuth = useAxiosAuth(token)

  const form = useForm<FormData>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      tema: temaData.tema,
      versiculo_chave: temaData.versiculo_chave,
      folderName: temaData.tema,
      date: {
        from: new Date(temaData.data_inicio),
        to: new Date(temaData.data_termino),
      },
      comment: '',
    },
  })

  const CreateNewCelulaFunction = async (
    values: z.infer<typeof formSchema>,
  ) => {
    console.log('values', values)
    const response = await axiosAuth.put(
      URLApi,
      {
        id: temaData.id,
        tema: values.tema,
        versiculo_chave: values.versiculo_chave,
        folderName: values.folderName,
        date: {
          from: values.date.from,
          to: values.date.to,
        },
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    form.reset()
    return response.data
  }

  const { mutateAsync: createNewCelulaFn, isPending } = useMutation({
    mutationFn: CreateNewCelulaFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['temasCelulasIbb'] })
      queryClient.invalidateQueries({ queryKey: ['licoesCelulasIbb'] })
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values,
  ) => {
    const { folderName } = values
    const { date } = values
    const startDate = dayjs(date.from).format('DD-MMM-YY')
    const endDate = dayjs(date.to).format('DD-MMM-YY')

    const formattedFolderName =
      `${folderName.trim().replace(/\s+/g, '-')}-${startDate}-${endDate}`.toLowerCase()

    const valuesFormated = {
      ...values,
      tema: folderName,
      folderName: formattedFolderName,
    }

    const response = await createNewCelulaFn(valuesFormated)
    console.log('responseFolder: ', response)
    if (response) {
      toast({
        variant: 'default',
        title: 'Successo',
        description: 'TEMA Atualizado com Sucesso. 😇',
      })
      form.reset()
    } else {
      toast({
        title: 'Erro!!!',
        description: 'Erro na Atualização do TEMA. 😰',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="folderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tema</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o tema" {...field} />
                </FormControl>
                <FormDescription>
                  Aqui você digita o tema proposto para o mês.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Período das lições</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value?.from && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                          field.value?.to ? (
                            <>
                              {format(field.value?.from, 'LLL dd, y')} -{' '}
                              {format(field.value?.to, 'LLL dd, y')}
                            </>
                          ) : (
                            format(field.value?.from, 'LLL dd, y')
                          )
                        ) : (
                          <span>Defina o príodo</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      // defaultMonth={field.value?.from ? new Date(field.value?.from) : new Date()}
                      selected={{
                        from: field.value?.from
                          ? new Date(field.value?.from)
                          : undefined,
                        to: field.value?.to
                          ? new Date(field.value?.to)
                          : undefined,
                      }}
                      onSelect={field.onChange}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Período em que as lições serão mministradas nas células.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="versiculo_chave"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Bíblica</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-24 overflow-y-auto flex-wrap"
                    placeholder="Digite a base bíblica"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Digite a base bíblica para o tema proposto do mês.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              'Atualizar Tema'
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
