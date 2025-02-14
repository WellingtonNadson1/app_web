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
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'

const DATE_REQUIRED_ERROR = 'Date is required.'

const formSchema = z.object({
  title: z.string(),
  description: z.string().min(1, { message: 'A comment is required.' }),
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
})

type FormData = z.infer<typeof formSchema>

export function AgendaRegistrationForm() {
  const queryClient = useQueryClient()
  const URLApi = '/api/agenda-ibb-service/create-evento-agenda'
  const { toast } = useToast()

  const form = useForm<FormData>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      date: {
        from: undefined,
        to: undefined,
      },
    },
  })

  const CreateNewCelulaFunction = async (
    values: z.infer<typeof formSchema>,
  ) => {
    console.log('values', values)
    const { data: session } = useSession()
    const token = session?.user?.token as string
    const axiosAuth = useAxiosAuth(token)
    const response = await axiosAuth.post(
      URLApi,
      {
        title: values.title,
        description: values.description,
        date: {
          from: values.date.from,
          to: values.date.to,
        },
      },
      {
        headers: {
          // 'Content-Type': 'application/json',
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
      queryClient.invalidateQueries({ queryKey: ['eventosAgendaIbb'] })
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values,
  ) => {
    const response = await createNewCelulaFn(values)
    console.log('responseFolder: ', response)
    if (response) {
      toast({
        variant: 'default',
        title: 'Successo',
        description: 'Evento Registrado com Sucesso. 😇',
      })
      form.reset()
    } else {
      toast({
        title: 'Erro!!!',
        description: 'Erro no Cadastro do Evento. 😰',
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input required placeholder="Digite o título" {...field} />
                </FormControl>
                <FormDescription>
                  Digite o título proposto para o evento.
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
                <FormLabel>Período do evento</FormLabel>
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
                  Período proposto para o evento.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do Evento</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-24 overflow-y-auto flex-wrap"
                    placeholder="Digite a descrição aqui"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Digite uma breve descrição do evento.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Evento'
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
