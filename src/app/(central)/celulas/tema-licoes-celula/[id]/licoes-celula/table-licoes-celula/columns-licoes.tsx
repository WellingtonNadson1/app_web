"use client";

import { Badge } from "@/components/ui/badge";
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
import { Notepad } from "@phosphor-icons/react/dist/ssr";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import UpdateLicoesCelula from "../../UpdateLicoesCelula";
import { allLicaoReturnSchemaTable } from "./schema-licoes";

export const columnsLicoes: ColumnDef<z.infer<typeof allLicaoReturnSchemaTable>>[] = [
  // LANCANDO AS REDES
  {
    accessorKey: "licao_lancando_redes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          L. Redes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex w-full items-center justify-start mx-auto">
          {data.licao_lancando_redes ?
            <Badge className={`bg-green-400 hover:bg-green-300`}> lançando </Badge> :
            <Badge className={`bg-sky-400 hover:bg-sky-300`}> normal </Badge>}

        </div>
      );
    },
    filterFn: 'includesString'
  },
  // Titulo
  {
    accessorKey: "titulo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Titulo
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
          {data.link_objeto_aws ? (
            <Link href={data.link_objeto_aws} target="_blank">
              <p className="ml-3">{data.titulo}</p>
            </Link>
          ) : (
            <p className="ml-3">{data.titulo}</p> // Renderiza o título mesmo sem o link
          )}
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
      const handleClickLicaoCelula = (event: React.MouseEvent<HTMLElement>) => {
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
              {/* UPDATE LICAO */}
              <DropdownMenuItem asChild>
                <UpdateLicoesCelula temaData={celula} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* DELETAR LICAO */}
              <DropdownMenuItem asChild>
                {/* <DeleteTemaLIcaoCelula temaLicaoCelulaId={celula.id} TemaLicaoName={celula.titulo} /> */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
