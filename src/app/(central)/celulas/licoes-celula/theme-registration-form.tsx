"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { format } from "date-fns"
import dayjs from "dayjs"
import { CalendarIcon, Loader2 } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

const DATE_REQUIRED_ERROR = "Date is required.";

const formSchema = z.object({
  folderName: z.string().min(2, {
    message: "Theme must be at least 2 characters.",
  }),
  date: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }, { required_error: DATE_REQUIRED_ERROR }).refine((date) => {
    return !!date.from;
  }, DATE_REQUIRED_ERROR),
  comment: z.string().min(1, { message: "A comment is required." }),
})

type FormData = z.infer<typeof formSchema>

type Theme = {
  folderName: string
}

type ThemeRegistrationFormProps = {
  onSubmitForm: (folderName: Theme) => void
}

export function ThemeRegistrationForm({ onSubmitForm }: ThemeRegistrationFormProps) {
  const queryClient = useQueryClient()
  const URLApi = "/api/create-folder"
  const { toast } = useToast()

  const form = useForm<FormData>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      folderName: "",
      date: {
        from: undefined,
        to: undefined,
      },
      comment: ""
    },
  })

  const CreateNewCelulaFunction = async (
    values
      : z.infer<typeof formSchema>) => {

    // const date_inicio = new Date(dayjs(data.date_inicio).toISOString())
    // const date_multipicar = new Date(dayjs(data.date_multipicar).toISOString());

    const response = await axios.post(URLApi, {
      folderName: values.folderName
    },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
      ,
    )

    form.reset();
    return response.data;
  };

  const { mutateAsync: createNewCelulaFn, isPending } = useMutation({
    mutationFn: CreateNewCelulaFunction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allCelulasIbb"] });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    const { folderName } = values
    const { date } = values
    const startDate = dayjs(date.from).format('DD-MMM-YY')
    const endDate = dayjs(date.to).format('DD-MMM-YY')
    const valuesFormated = {
      ...values,
      folderName: `${folderName}-${startDate}-${endDate}`.toLocaleLowerCase()
    }
    console.log('valuesSubmit: ', valuesFormated)

    const response = await createNewCelulaFn(valuesFormated)
    console.log('responseFolder: ', response)
    if (response) {
      toast({
        variant: "default",
        title: "Successo",
        description: "TEMA Registrado com Sucesso. 😇",
      });
      form.reset();
    } else {
      toast({
        title: "Erro!!!",
        description: "Erro no Cadastro do TEMA. 😰",
        variant: "destructive",
      });
    };
  }

  return (
    <>
      <Toaster />
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
                <FormLabel>Período das licões</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value?.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                          field.value?.to ? (
                            <>
                              {format(field.value?.from, "LLL dd, y")} -{" "}
                              {format(field.value?.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(field.value?.from, "LLL dd, y")
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
                        from: field.value?.from ? new Date(field.value?.from) : undefined,
                        to: field.value?.to ? new Date(field.value?.to) : undefined,
                      }}
                      onSelect={field.onChange}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Período em que as licões serão mministradas nas células.
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
              'Cadastrar Tema'
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
