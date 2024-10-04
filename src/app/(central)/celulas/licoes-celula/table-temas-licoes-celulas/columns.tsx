"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/toaster";
import { useSupervisaoContext } from "@/contexts/supervisao/supervisao";
import { MagnifyingGlass, Notepad } from "@phosphor-icons/react/dist/ssr";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import DeleteTemaLIcaoCelula from "../DeleteTemaLicaoCelula";
import UpdateTemaLicoesCelula from "../UpdateTemaLicoesCelula";
import { allTemaReturnSchemaTable } from "./schema";

export const columns: ColumnDef<z.infer<typeof allTemaReturnSchemaTable>>[] = [
  // NOME TEMA
  {
    accessorKey: "tema",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tema
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex w-full items-center justify-start ">
          <div>
            <Notepad weight="light" color="#555353" size={23} />
          </div>
          <p className="ml-3">{data.tema}</p>
        </div>
      );
    },
    filterFn: 'includesString'
  },
  // Data Inicial
  {
    accessorKey: "data_inicio",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data Iníc.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      const dataInicio = dayjs(data.data_inicio).format("DD/MM/YYYY")
      return (
        <div className="flex w-full items-center justify-start ">
          {/* <div>
            <UserCircle weight="light" color="#555353" size={23} />
          </div> */}
          <p className="ml-3">{dataInicio}</p>
        </div>
      );
    },
    filterFn: 'fuzzy',
  },
  // Data Final
  {
    accessorKey: "data_termino",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data Fim
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      const dataTermino = dayjs(data.data_termino).format("DD/MM/YYYY")
      return (
        <div className="flex w-full items-center justify-start ">
          {/* <div>
            <UserCircle weight="light" color="#555353" size={23} />
          </div> */}
          <p className="ml-3">{dataTermino}</p>
        </div>
      );
    },
    filterFn: 'fuzzy',
  },
  // OPÇÕES
  {
    id: "actions",
    cell: ({ row }) => {
      const celula = row.original;
      const router = useRouter();
      const contextParamsSupervisaoId = useSupervisaoContext();
      const handleClickCelula = (event: React.MouseEvent<HTMLElement>) => {
        const idCelula = event.currentTarget.id;
        router.push(
          `/supervisoes/${contextParamsSupervisaoId}/celulas/${idCelula}`,
        );
      };

      return (
        <>
          <Toaster />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* ACESSAR DADOS DA CELULA */}
              <DropdownMenuItem asChild>
                <DropdownMenuItem asChild className="w-full flex items-center justify-between gap-2 px-2 hover:bg-transparent hover:text-foreground">
                  <button
                    onClick={handleClickCelula}
                    // id={celula?.id}
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    Acessar
                    <MagnifyingGlass key={1221} size={18} />
                  </button>
                </DropdownMenuItem>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* UPDATE CELULA */}
              <DropdownMenuItem asChild>
                <UpdateTemaLicoesCelula temaData={celula} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* DELETAR CELULA */}
              <DropdownMenuItem asChild>
                <DeleteTemaLIcaoCelula temaLicaoCelulaId={celula.id} TemaLicaoName={celula.tema} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
