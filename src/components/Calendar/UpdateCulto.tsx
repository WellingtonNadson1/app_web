"use client";
import { CultoDaSemana, NewCulto } from "@/app/(central)/cultos/schemaNewCulto";
import { BASE_URL, errorCadastro, success } from "@/functions/functions";
import { UserMinusIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ModalCalendar from "./ModalCalendar";
import useAxiosAuthToken from "@/lib/hooks/useAxiosAuthToken";
import { useQuery } from "@tanstack/react-query";
import FormUpdateCulto from "@/app/(central)/cultos/form-update-culto";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { PencilSimple } from "@phosphor-icons/react/dist/ssr";
import { Button } from "../ui/button";

export default function UpdateCulto({
  cultoId,
}: // shouldFetch,
{
  cultoId: string;
  // shouldFetch: boolean
}) {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuthToken(session?.user.token as string);

  // const URLCultosIndividuais = `${BASE_URL}/cultosindividuais`;
  // const URLCultosSemanais = `${BASE_URL}/cultossemanais`;
  // const [isLoadingSubmitForm, setIsLoadingSubmitForm] = useState(false);
  // const [formSuccess, setFormSuccess] = useState(false);
  // const [dataCultos, setDataCultos] = useState<NewCulto[]>();
  // const router = useRouter();
  // const { register, handleSubmit, reset } = useForm<NewCulto>({
  //   defaultValues: async () => {
  //     if (!cultoId) return {};

  //     const response = await fetch(URLCultosIndividuais, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${session?.user.token}`,
  //       },
  //     });
  //     const data = await response.json();
  //     console.log("Data in the Update Culto", data);
  //     return data;
  //   },
  // });

  // const onSubmit: SubmitHandler<NewCulto> = async (data) => {
  //   try {
  //     setIsLoadingSubmitForm(true);

  //     const formatDatatoISO8601 = (dataString: string) => {
  //       const dataObj = new Date(dataString);
  //       return dataObj.toISOString();
  //     };

  // data.data_inicio_culto = formatDatatoISO8601(data.data_inicio_culto)
  // data.data_termino_culto = formatDatatoISO8601(data.data_termino_culto)

  //     const response = await fetch(URLCultosIndividuais, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${session?.user.token}`,
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (response.ok) {
  //       setIsLoadingSubmitForm(false);
  //       setFormSuccess(true);
  //       router.refresh();
  //       success("Culto Cadastrado");
  //     } else {
  //       errorCadastro("Erro ao cadastrar Culto");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     errorCadastro("Erro ao cadastrar Culto");
  //   }
  //   reset();
  // };

  // const { data: cultosSemanais, isLoading } = useQuery<CultoDaSemana[]>({
  //   queryKey: ["cultossemanais"],
  //   queryFn: async () => {
  //     const response = await axiosAuth.get(URLCultosSemanais);
  //     return await response.data;
  //   },
  // });

  // const fetchCultos = useCallback(async () => {
  //   try {
  //     const response = await fetch(URLCultosIndividuais, {
  //       headers: {
  //         Authorization: `Bearer ${session?.user.token}`,
  //       },
  //     });
  //     if (!response.ok) {
  //       console.log("Failed to fetch get Cultos.");
  //     }
  //     const cultos = await response.json();
  //     setDataCultos(cultos);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [URLCultosIndividuais, session?.user.token]);

  // // UseEffect para buscar as células quando a página é carregada
  // useEffect(() => {
  //   fetchCultos();
  // }, [fetchCultos]);

  // // UseEffect para buscar as células após o envio do formulário
  // useEffect(() => {
  //   if (formSuccess) {
  //     fetchCultos();
  //   }
  // }, [formSuccess, fetchCultos]);

  // if (dataCultos) {
  //   console.log("data Cultos Modal Eventos", dataCultos);
  // }
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem
          className="w-full flex items-center justify-between"
          onSelect={(e) => e.preventDefault()}
        >
          Editar
          <PencilSimple size={18} />
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>Editar Culto</DialogTitle>
          <DialogDescription>
            Edite o culto preenchendo o formulário?
          </DialogDescription>
        </DialogHeader>
        <div className="text-center py-2">
          {/* {meeting.culto_semana.nome} */}
        </div>
        {/* FORMULARIO CADASTRO CULTO */}
        {/* <FormUpdateCulto cultoId="" /> */}

        <div className="flex flex-col-reverse gap-2 sm:gap-0 sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant={"outline"} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 hover:opacity-95"
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    // <ModalCalendar
    //   buttonIcon={
    //     <EditActiveIcon className="w-5 h-5 mr-2" aria-hidden="true" />
    //   }
    //   icon={UserMinusIcon}
    //   titleModal="Atualizar Culto"
    //   titleButton="Atualizar"
    //   buttonProps={{
    //     className:
    //       "group flex w-full cursor-pointer items-center rounded-md bg-white px-2 py-2 text-sm text-gray-900 hover:bg-slate-500 hover:text-white",
    //   }}
    // >
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <div className="pb-10">
    //       <div className="grid grid-cols-1 mt-10 gap-x-2 gap-y-4 sm:grid-cols-8">
    //         <div className="sm:col-span-4">
    //           <label
    //             htmlFor="data_inicio_culto"
    //             className="block text-sm font-medium leading-6 text-slate-700"
    //           >
    //             Data Início
    //           </label>
    //           <div className="mt-3">
    //             <input
    //               {...register("data_inicio_culto")}
    //               type="datetime-local"
    //               name="data_inicio_culto"
    //               id="data_inicio_culto"
    //               className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
    //             />
    //           </div>
    //         </div>

    //         <div className="sm:col-span-4">
    //           <label
    //             htmlFor="data_termino_culto"
    //             className="block text-sm font-medium leading-6 text-slate-700"
    //           >
    //             Data Término
    //           </label>
    //           <div className="mt-3">
    //             <input
    //               {...register("data_termino_culto")}
    //               type="datetime-local"
    //               name="data_termino_culto"
    //               id="data_termino_culto"
    //               className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
    //             />
    //           </div>
    //         </div>
    //       </div>

    //       {/* INFORMAÇÕES DO REINO */}
    //       <div className="grid grid-cols-1 mt-10 gap-x-2 gap-y-4 sm:grid-cols-6">
    //         <div className="sm:col-span-3">
    //           <label
    //             htmlFor="culto_semana"
    //             className="block text-sm font-medium leading-6 text-slate-700"
    //           >
    //             Culto da Semana
    //           </label>
    //           <div className="mt-3">
    //             <select
    //               {...register("culto_semana")}
    //               id="culto_semana"
    //               name="culto_semana"
    //               className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
    //             >
    //               {isLoading ? (
    //                 <option value="">Carregando cultos...</option>
    //               ) : (
    //                 <option value="">Selecione</option>
    //               )}
    //               {cultosSemanais &&
    //                 cultosSemanais?.map((cultoDaSemana) => (
    //                   <option key={cultoDaSemana.id} value={cultoDaSemana.id}>
    //                     {cultoDaSemana.nome}
    //                   </option>
    //                 ))}
    //             </select>
    //           </div>
    //         </div>
    //         <div className="sm:col-span-3">
    //           <label
    //             htmlFor="status"
    //             className="block text-sm font-medium leading-6 text-slate-700"
    //           >
    //             Status do Culto
    //           </label>
    //           <div className="mt-3">
    //             <select
    //               {...register("status")}
    //               id="status"
    //               name="status"
    //               className="block w-full rounded-md border-0 py-1.5 text-slate-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
    //             >
    //               {isLoading ? (
    //                 <option value="">Carregando status...</option>
    //               ) : (
    //                 <>
    //                   <option value="">Selecione</option>
    //                   <option value="Agendado">Agendado</option>
    //                   <option value="Cancelado">Cancelado</option>
    //                   <option value="Realizado">Realizado</option>
    //                 </>
    //               )}
    //             </select>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Botões para submeter Forms */}
    //       <div className="flex items-center justify-end mt-6 gap-x-6">
    //         <button
    //           type="button"
    //           onClick={() => reset()}
    //           className="px-3 py-2 text-sm font-semibold text-slate-700 hover:rounded-md hover:bg-red-500 hover:px-3 hover:py-2 hover:text-white"
    //         >
    //           Cancelar
    //         </button>
    //         {isLoadingSubmitForm ? (
    //           <div>
    //             <button
    //               type="submit"
    //               disabled={isLoadingSubmitForm}
    //               className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
    //             >
    //               <svg
    //                 className="w-5 h-5 mr-3 text-gray-400 animate-spin"
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //               >
    //                 <circle
    //                   className="opacity-25"
    //                   cx="12"
    //                   cy="12"
    //                   r="10"
    //                   stroke="currentColor"
    //                   strokeWidth="4"
    //                 ></circle>
    //                 <path
    //                   className="opacity-75"
    //                   fill="currentColor"
    //                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    //                 ></path>
    //               </svg>
    //               <span>Atualizando...</span>
    //             </button>
    //           </div>
    //         ) : (
    //           <button
    //             type="submit"
    //             className="px-3 py-2 text-sm font-semibold text-white bg-green-700 rounded-md shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
    //           >
    //             <span>Atualizar</span>
    //           </button>
    //         )}
    //       </div>
    //     </div>
    //   </form>
    // </ModalCalendar>
  );
}
