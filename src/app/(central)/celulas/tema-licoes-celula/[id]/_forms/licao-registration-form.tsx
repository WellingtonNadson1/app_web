"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { format } from "date-fns"
import dayjs from "dayjs"
import { CalendarIcon, Loader2, Upload } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

const DATE_REQUIRED_ERROR = "Date is required.";

const formSchema = z.object({
  titulo: z.string(),
  pdfFile: z.instanceof(FileList),
  versiculo_chave: z.string(),
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

type LicaoRegistrationFormProps = {
  folderNameId: string
}

export function LicaoRegistrationForm({ folderNameId }: LicaoRegistrationFormProps) {
  const [pdfName, setPdfName] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const URLApi = "/api/licoes-celula/create-lesson-celula"
  const { toast } = useToast()

  const form = useForm<FormData>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      folderName: "",
      date: {
        from: undefined,
        to: undefined,
      },
      comment: ""
    },
  })

  const CreateNewLessonCelulaFunction = async (
    values
      : z.infer<typeof formSchema>) => {


    if (values) {
      console.log('values', values)
    }
    const response = await axios.post(URLApi, {
      folderName: folderNameId,
      pdfFile: values.pdfFile,
      versiculo_chave: values.versiculo_chave,
      titulo: values.titulo,
      date: {
        from: values.date.from,
        to: values.date.to
      },
    },
      {
        headers: {
          // 'Content-Type': 'application/json',
          'Content-Type': 'multipart/form-data',
        }
      }
      ,
    )
    form.reset();
    return response.data;
  };

  const { mutateAsync: createNewLessonCelulaFn, isPending } = useMutation({
    mutationFn: CreateNewLessonCelulaFunction,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["temasCelulasIbb"] });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    const { titulo } = values
    const { date } = values
    const startDate = dayjs(date.from).format('DD-MMM-YY')
    const endDate = dayjs(date.to).format('DD-MMM-YY')

    const formattedTituloName = `${titulo.trim().replace(/\s+/g, '-')}-${startDate}-${endDate}`.toLowerCase();

    const folderNameId = ''

    const valuesFormated = {
      ...values,
      titulo: formattedTituloName,
      folderName: folderNameId
    }

    const response = await createNewLessonCelulaFn(valuesFormated)
    console.log('responseFolder: ', response)
    if (response) {
      toast({
        variant: "default",
        title: "Successo",
        description: "LIÇÃO Registrada com Sucesso. 😇",
      });
      form.reset();
    } else {
      toast({
        title: "Erro!!!",
        description: "Erro no Cadastro do LIÇÃO. 😰",
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
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input required placeholder="Digite o Título da Lição" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Período da lição</FormLabel>
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
                  Período de ministração da Lição na célula.
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
                  <Textarea className="h-24 overflow-y-auto flex-wrap" placeholder="Digite a base bíblica" {...field} />
                </FormControl>
                <FormDescription>
                  Digite a base bíblica para a Lição da semana.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pdfFile"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Upload Lição | PDF</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const files = e.target.files
                        if (files && files.length > 0) {
                          onChange(files)
                          setPdfName(files[0].name)
                        }
                      }}
                      {...field}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload PDF
                    </label>
                    {pdfName && (
                      <span className="text-sm text-muted-foreground">
                        {pdfName}
                      </span>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Faça o upload do PDF da Lição.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full bg-btnIbb hover:bg-btnIbb/90" type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Lição'
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
