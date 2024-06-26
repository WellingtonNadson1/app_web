"use client";
import { BASE_URL, errorCadastro, success } from "@/functions/functions";
import { CalendarIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CultoDaSemana, CultoSchema, NewCulto } from "./schemaNewCulto";
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useUserDataStore } from "@/store/UserDataStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCombinetedStore } from "@/store/DataCombineted";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import format from "date-fns/format";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import MyCalendar from "@/components/Calendar/Calendar";
import { Calendar } from "@/components/ui/calendar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimePicker } from "@/components/timer-picker-input/time-picker";

const statusCulto = ["Agendado", "Realizado", "Cancelado"];
const cultosSemanais = [
  {
    id: "10875852-929b-4e81-a8cb-34721362c7c3",
    nome: "Culto de Ceia",
    descricao: "Culto Em Memória de Cristo",
  },
  {
    id: "4064be1d-bf55-4851-9f76-99c4554a6265",
    nome: "Culto de Edificação",
    descricao: "Culto de Edificação as quartas-feiras",
  },
  {
    id: "84acfbe4-c7e0-4841-813c-04731ffa9c67",
    nome: "Capacitação Para Discípulos - CPD",
    descricao: "Culto aos Sábados",
  },
  {
    id: "bffb62af-8d03-473a-ba20-ab5a9d7dafbe",
    nome: "Culto de Primícias",
    descricao: "Culto de Primícias ao Senhor",
  },
  {
    id: "cab02f30-cade-46ca-b118-930461013d53",
    nome: "Culto de Celebração - Manhã",
    descricao: "Culto aos Domingos pela manhã",
  },
  {
    id: "ea08ec9b-3d1b-42f3-818a-ec53ef99b78f",
    nome: "Culto de Celebração - Tarde",
    descricao: "Culto aos Domingos pela tarde",
  },
  {
    id: "e7bc72d1-8faa-4bbe-9c24-475b64f956cf",
    nome: "Domingo de Sacrifício",
    descricao: "Culto de 12h de relacionamento com Deus",
  },
];

export default function Cultos() {
  const { token } = useUserDataStore.getState();
  const { supervisoes } = useCombinetedStore.getState().state;

  const form = useForm<z.infer<typeof CultoSchema>>({
    resolver: zodResolver(CultoSchema),
  });

  // const { register, handleSubmit, reset } = useForm<NewCulto>();
  const URLCultosIndividuais = `${BASE_URL}/cultosindividuais`;
  const URLCultosSemanais = `${BASE_URL}/cultossemanais`;
  const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [dataCultos, setDataCultos] = useState<NewCulto[]>();
  const axiosAuth = useAxiosAuthToken(token);

  const onSubmit = async (data: z.infer<typeof CultoSchema>) => {
    return console.log(data);
    try {
      setIsLoadingSubmitForm(true);

      // const formatDatatoISO8601 = (dataString: string) => {
      //   const dataObj = new Date(dataString);
      //   return dataObj.toISOString();
      // };

      const response = await axiosAuth.post(URLCultosIndividuais, {
        data,
      });
      const cultoIsRegister = response.data;

      if (cultoIsRegister) {
        setIsLoadingSubmitForm(false);
        setFormSuccess(true);
        success("😉 Culto Cadastrado");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setIsLoadingSubmitForm(false);

        errorCadastro("Erro ao cadastrar Culto");
      }
    } catch (error) {
      console.log(error);
      setIsLoadingSubmitForm(false);

      errorCadastro("😰 Erro ao cadastrar Culto");
    }
    // reset();
  };

  const fetchCultos = useCallback(async () => {
    try {
      if (token) {
        const response = await axiosAuth.get(URLCultosIndividuais);
        const cultosIndividuais = response.data;
        if (!cultosIndividuais) {
          console.log("Failed to fetch get Cultos.");
        }
        setDataCultos(cultosIndividuais);
      }
    } catch (error) {
      console.log(error);
    }
  }, [URLCultosIndividuais, token]);

  // UseEffect para buscar as células quando a página é carregada
  useEffect(() => {
    fetchCultos();
  }, [fetchCultos]);

  // UseEffect para buscar as células após o envio do formulário
  useEffect(() => {
    if (formSuccess) {
      fetchCultos();
    }
  }, [formSuccess, fetchCultos]);

  return (
    <>
      <ToastContainer />

      <div className="relative w-full px-2 py-2 mx-auto">
        <Card className="relative w-full mx-auto mt-3 mb-4 grid grid-cols-1 gap-3 justify-between sm:justify-center items-center">
          <MyCalendar />

          {/* FORMS DIALOG */}
          <div className="px-2 py-3">
            {/* FORMS */}

            <Dialog>
              <DialogTrigger asChild>
                <div className="sm:flex sm:justify-end sm:items-end">
                  <Button
                    className="sm:w-auto w-full  bg-btnIbb hover:bg-btnIbb hover:opacity-90"
                    variant="default"
                  >
                    Cadastrar
                  </Button>
                </div>
              </DialogTrigger>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <DialogContent className="sm:max-w-[580px]">
                    <DialogHeader>
                      <DialogTitle>Cadastro de Culto</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 items-center justify-center mt-10 gap-2 gap-y-6 sm:grid-cols-4">
                      {/* DATA INICIAL */}
                      <div className="sm:col-span-2">
                        <FormField
                          control={form.control}
                          name="data_inicio_culto"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Data de início</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        " pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? (
                                        // format(field.value, "P HH:mm:ss", {
                                        format(field.value, "P", {
                                          locale: ptBR,
                                        })
                                      ) : (
                                        <span>Selecione uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={
                                      (date) => date < new Date()
                                      // ||
                                      // date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                  {/* <div className="p-3 border-t border-border">
                                    <TimePicker
                                      setDate={field.onChange}
                                      date={field.value}
                                    />
                                  </div> */}
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* DATA FINAL */}
                      <div className="sm:col-span-2">
                        <FormField
                          control={form.control}
                          name="data_termino_culto"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Data final</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        " pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground",
                                      )}
                                    >
                                      {field.value ? (
                                        // format(field.value, "P HH:mm:ss", {
                                        format(field.value, "P", {
                                          locale: ptBR,
                                        })
                                      ) : (
                                        <span>Selecione uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    // disabled={(date) =>
                                    //   date > new Date() ||
                                    //   date < new Date("1900-01-01")
                                    // }
                                    initialFocus
                                  />
                                  {/* <div className="p-3 border-t border-border">
                                    <TimePicker
                                      setDate={field.onChange}
                                      date={field.value}
                                    />
                                  </div> */}
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* SELECAO CULTOS */}
                      <div className="sm:col-span-2">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Tipo de Culto</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um culto" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {cultosSemanais &&
                                    cultosSemanais?.map((culto) => (
                                      <SelectItem
                                        key={culto.id}
                                        value={culto.id}
                                      >
                                        {culto.nome}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* SELECAO CULTOS */}
                      <div className="sm:col-span-2">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {statusCulto &&
                                    statusCulto?.map((status) => (
                                      <SelectItem
                                        key={status + 1}
                                        value={status}
                                      >
                                        {status}
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
                    <DialogFooter>
                      <Button
                        className="bg-green-700 hover:bg-green-700 hover:opacity-95 transition ease-in"
                        type="submit"
                      >
                        Salvar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Form>
            </Dialog>
          </div>
        </Card>
      </div>
    </>
  );
}

// <div className="p-2">
//   <Modal
//     titleButton="Cadastrar"
//     icon={PencilSquareIcon}
//     titleModal="Cadastro de Culto"
//     buttonProps={{
//       className:
//         "bg-btnIbb text-sm mt-3 shadow-sm font-medium text-white hover:bg-[#1D70B6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#014874] sm:w-2/5",
//     }}
//   >
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <div className="pb-10">
//         <div className="grid grid-cols-1 mt-10 gap-x-2 gap-y-4 sm:grid-cols-8">
//           <div className="sm:col-span-4">
//             <label
//               htmlFor="data_inicio_culto"
//               className="block text-sm font-medium leading-6 text-slate-700"
//             >
//               Data Início
//             </label>
//             <div className="mt-3">
//               <Input
//                 {...register("data_inicio_culto")}
//                 type="datetime-local"
//                 name="data_inicio_culto"
//                 id="data_inicio_culto"
//                 className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
//               />
//             </div>
//           </div>

//           <div className="sm:col-span-4">
//             <label
//               htmlFor="data_termino_culto"
//               className="block text-sm font-medium leading-6 text-slate-700"
//             >
//               Data Término
//             </label>
//             <div className="mt-3">
//               <Input
//                 {...register("data_termino_culto")}
//                 type="datetime-local"
//                 name="data_termino_culto"
//                 id="data_termino_culto"
//                 className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
//               />
//             </div>
//           </div>
//         </div>

//         {/* INFORMAÇÕES DO REINO */}
//         <div className="grid grid-cols-1 mt-10 gap-x-2 gap-y-4 sm:grid-cols-6">
//           <div className="sm:col-span-3">
//             <label
//               htmlFor="culto_semana"
//               className="block text-sm font-medium leading-6 text-slate-700"
//             >
//               Culto da Semana
//             </label>
//             <div className="mt-3">
//               <Select {...register("culto_semana")}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Selecione um culto" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     {!cultosSemanais ? (
//                       <SelectItem value="u">
//                         Carregando cultos...
//                       </SelectItem>
//                     ) : (
//                       <SelectItem value="i">Selecione</SelectItem>
//                     )}
//                     {cultosSemanais &&
//                       cultosSemanais?.map((cultoDaSemana) => (
//                         <SelectItem
//                           key={cultoDaSemana.id}
//                           value={cultoDaSemana.id}
//                         >
//                           {cultoDaSemana.nome}
//                         </SelectItem>
//                       ))}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="sm:col-span-3">
//             <label
//               htmlFor="status"
//               className="block text-sm font-medium leading-6 text-slate-700"
//             >
//               Status do Culto
//             </label>
//             <div className="mt-3">
//               <Select {...register("status")}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Selecione um status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     {isLoading ? (
//                       <SelectItem value="t">
//                         Carregando status...
//                       </SelectItem>
//                     ) : (
//                       <>
//                         <SelectItem value="y">Selecione</SelectItem>
//                         <SelectItem value="Agendado">
//                           Agendado
//                         </SelectItem>
//                         <SelectItem value="Cancelado">
//                           Cancelado
//                         </SelectItem>
//                         <SelectItem value="Realizado">
//                           Realizado
//                         </SelectItem>
//                       </>
//                     )}
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>

//         {/* Botões para submeter Forms */}
//         <div className="flex items-center justify-end mt-6 gap-x-6">
//           <Button
//             type="button"
//             variant={"destructive"}
//             onClick={() => reset()}
//             className="px-3 py-2 text-sm font-semibold hover:rounded-md hover:px-3 hover:py-2 "
//           >
//             Cancelar
//           </Button>
//           {isLoadingSubmitForm ? (
//             <div>
//               <Button
//                 type="submit"
//                 disabled={isLoadingSubmitForm}
//                 className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
//               >
//                 <svg
//                   className="w-5 h-5 mr-3 text-gray-400 animate-spin"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 <span>Cadastrando...</span>
//               </Button>
//             </div>
//           ) : (
//             <Button
//               type="submit"
//               className="px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
//             >
//               <span>Cadastrar</span>
//             </Button>
//           )}
//         </div>
//       </div>
//     </form>
//   </Modal>
// </div>
