"use client";

import DeleteMember from "@/app/(central)/novo-membro/DeleteMember";
import UpdateMember from "@/app/(central)/novo-membro/UpdateMember";
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
import { UserCircle } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { z } from "zod";
import { userSchemaTable } from "./schema";

export const columns: ColumnDef<z.infer<typeof userSchemaTable>>[] = [
  // NOME MEMBRO
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      row.getValue("first_name");
      const { first_name } = row.original;
      return (
        <div className="flex w-full items-center justify-start ">
          <div>
            <UserCircle weight="light" color="#555353" size={23} />
          </div>
          <p className="ml-3">{first_name}</p>
        </div>
      );
    },
  },
  // STATUS
  {
    accessorKey: "situacao_no_reino.nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      row.getValue("situacao_no_reino.nome");
      const { situacao_no_reino } = row.original;
      const process_status = situacao_no_reino?.nome?.toString();

      return process_status === "Ativo" ? (
        <Badge className="w-full sm:table-cell py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800">
          {situacao_no_reino?.nome}
        </Badge>
      ) : process_status === "Afastado" ? (
        <Badge className="w-full sm:table-cell py-1 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800">
          {situacao_no_reino?.nome}
        </Badge>
      ) : process_status === "Frio" ? (
        <Badge className="w-full sm:table-cell py-1 bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800">
          {situacao_no_reino?.nome}
        </Badge>
      ) : (
        <Badge className="w-full sm:table-cell py-1 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-8000">
          {situacao_no_reino?.nome}
        </Badge>
      );
    },
    filterFn: "includesString",
  },
  // CARGO
  {
    accessorKey: "cargo_de_lideranca.nome",
    header: ({ column }) => {
      return (
        <Button
          className="sm:flex items-center justify-between hidden"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cargo
          <ArrowUpDown className="hidden sm:table-cell ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      row.getValue("cargo_de_lideranca.nome");
      const { cargo_de_lideranca } = row.original;
      return (
        <Badge className="w-full py-1 items-center hidden sm:table-cell text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100">
          {cargo_de_lideranca?.nome}
        </Badge>
      );
    },
    filterFn: "includesString",
  },
  // OPÇÕES
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <UpdateMember member={user} />

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <DeleteMember memberId={user.id} memberName={user.first_name} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
