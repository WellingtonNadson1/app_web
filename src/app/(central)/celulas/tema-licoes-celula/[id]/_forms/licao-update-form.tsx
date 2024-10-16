"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { format } from "date-fns"
import dayjs from "dayjs"
import { CalendarIcon, Loader2, Upload } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  titulo: z.string(),
  pdfFile: z.instanceof(FileList).refine((files) => files.length > 0 && files !== undefined, {
    message: "O arquivo PDF é obrigatório.",
  }),
  licao_lancando_redes: z.boolean().default(false).optional(),
  versiculo_chave: z.string(),
  folderName: z.string().min(2, {
    message: "O tema deve ter pelo menos 2 caracteres.",
  }),
  date: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }, { required_error: "A data é obrigatória." }).refine((date) => {
    return !!date.from;
  }, "A data inicial é obrigatória."),
});

type FormData = z.infer<typeof formSchema>

type Licao = {
  licao_lancando_redes: boolean | undefined
  id: string;
  titulo: string;
  versiculo_chave: string;
  data_inicio: string;
  data_termino: string;
  link_objeto_aws: string;
}

type LicaoUpdateFormProps = {
  licaoData: Licao
}

export function LicaoUpdateForm({ licaoData }: LicaoUpdateFormProps) {
  const [pdfName, setPdfName] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const URLApi = "/api/licoes-celula/create-lesson-celula"
  const { toast } = useToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: licaoData.titulo,
      licao_lancando_redes: licaoData.licao_lancando_redes,
      versiculo_chave: licaoData.versiculo_chave,
      folderName: licaoData.titulo,
      date: {
        from: new Date(licaoData.data_inicio),
        to: new Date(licaoData.data_termino),
      },
    },
  })

  const CreateNewCelulaFunction = async (
    values
      : z.infer<typeof formSchema>) => {

    console.log('values', values)
    const response = await axios.put(URLApi, {
      ...values
    },
      {
        responseType: 'stream',
        headers: {
          'Content-Type': 'multipart/form-data',
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
      queryClient.invalidateQueries({ queryKey: ["licoesCelulasIbb"] });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    const { titulo } = values
    const { date } = values
    const startDate = dayjs(date.from).format('DD-MMM-YY')
    const endDate = dayjs(date.to).format('DD-MMM-YY')

    const formattedTituloName = `${titulo.trim().replace(/\s+/g, '-')}-${startDate}-${endDate}`.toLowerCase();

    console.log('formattedTituloName', formattedTituloName)
    console.log('values', values)

    const valuesFormated = {
      ...values,
      titulo: titulo,
      id: licaoData.id,
      temaLicaoCelulaId: licaoData.id,
      folderName: formattedTituloName
    }


    const response = await createNewCelulaFn(valuesFormated)
    console.log('responseFolder: ', response)
    if (response) {
      toast({
        variant: "default",
        title: "Successo",
        description: "LIÇÀO Atualizado com Sucesso. 😇",
      });
      form.reset();
    } else {
      toast({
        title: "Erro!!!",
        description: "Erro na Atualização do LIÇÀO. 😰",
        variant: "destructive",
      });
    };
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log('Validation errors:', errors);
        })} className="space-y-8">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o título" {...field} />
                </FormControl>
                <FormDescription>
                  Digite o título da lição.
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
                  Período em que a lição será mministrada nas células.
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
                  Digite a base bíblica para a lição da semana.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pdfFile"
            render={({ field: { onChange, value, ...field }, fieldState }) => (
              <FormItem>
                <FormLabel>Upload Lição | PDF</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2 w-full">
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
                      className="cursor-pointer w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
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
                {/* Exibe a mensagem de erro se houver */}
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licao_lancando_redes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Lição Lançando as Redes</FormLabel>
                  <FormDescription>
                    Selecione caso está seja a Lição do Lançando as Redes.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    className="data-[state=checked]:bg-green-300 data-[state=unchecked]:bg-red-300"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
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
