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
import { cn } from "@/lib/utils";
import { MagnifyingGlass, Notepad } from "@phosphor-icons/react/dist/ssr";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import DeleteCelula from "../../DeleteCelula";
import UpdateCelula2 from "../../UpdateCelula2";
import UpdateDataOcorreCelula from "../../UpdateDataOcorreCelula";
import { celulaSchemaTable } from "./schema";

export const columns: ColumnDef<z.infer<typeof celulaSchemaTable>>[] = [
  // NOME CELULA
  {
    accessorKey: "nome",
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
      row.getValue("first_name");
      const celula = row.original;
      return (
        <div className="flex w-full items-center justify-start ">
          <div>
            <Notepad weight="light" color="#555353" size={23} />
          </div>
          <p className="ml-3">{celula?.nome}</p>
        </div>
      );
    },
    filterFn: 'includesString'
  },
  // LIDER
  {
    accessorKey: "lider.first_name",
    header: ({ column }) => {
      console.log('columnLider', column)
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Líder
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      row.getValue("lider.first_name");
      const celula = row.original;
      console.log('celula lider', celula)

      return (
        <div className="flex w-full items-center justify-start ">
          {/* <div>
            <UserCircle weight="light" color="#555353" size={23} />
          </div> */}
          <p id="lider" className="ml-3">{celula?.lider?.first_name}</p>
        </div>
      );
    },
    filterFn: 'fuzzy',
  },
  // supervisao
  {
    accessorKey: "supervisao.nome",
    header: ({ column }) => {
      return (
        <Button
          className="hidden sm:flex"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Supervisão
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      row.getValue("supervisao.nome");
      const celula = row.original;

      const supervisaoNome = celula?.supervisao?.nome as 'vermelha' | 'azul' | 'laranja' | 'amarela' | 'verde';

      // Mapeamento das cores com base no nome da supervisão
      const corBadge: { [key in 'vermelha' | 'azul' | 'laranja' | 'amarela' | 'verde']: string } = {
        vermelha: "bg-red-100 text-red-700 hover:bg-red-200",
        azul: "bg-blue-100 text-blue-700 hover:bg-blue-200",
        laranja: "bg-orange-100 text-orange-700 hover:bg-orange-200",
        amarela: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        verde: "bg-green-100 text-green-700 hover:bg-green-200",
      };

      return (
        <div className="sm:block hidden w-full items-center justify-start ">
          <Badge className={cn(corBadge[supervisaoNome] || "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
            {supervisaoNome}
          </Badge>
        </div>
      );
    },
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

              <UpdateDataOcorreCelula id={celula.id} date_que_ocorre={celula.date_que_ocorre} lider={celula.lider} membros={celula.membros} nome={celula.nome} supervisao={celula.supervisao} key={celula.id}
              />

              <DropdownMenuSeparator />
              {/* ACESSAR DADOS DA CELULA */}
              <DropdownMenuItem asChild>
                <DropdownMenuItem asChild className="w-full flex items-center justify-between gap-2 px-2 hover:bg-transparent hover:text-foreground">
                  <button
                    onClick={handleClickCelula}
                    id={celula?.id}
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    Acessar
                    <MagnifyingGlass key={celula?.id} size={18} />
                  </button>
                </DropdownMenuItem>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* UPDATE CELULA */}
              <DropdownMenuItem asChild>
                <UpdateCelula2 celulaId={celula.id} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* DELETAR CELULA */}
              <DropdownMenuItem asChild>
                <DeleteCelula celulaId={celula.id} celulaName={celula.nome} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
