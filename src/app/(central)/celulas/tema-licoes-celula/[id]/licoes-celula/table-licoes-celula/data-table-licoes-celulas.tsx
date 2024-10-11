"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem
} from "@tanstack/match-sorter-utils";

import { TagQuantidadeCelulas } from "@/app/(central)/celulas/_components/TagQuantidadeCelulas";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddNewLicaoCelula from "../../AddNewLicaoCelula";
import { DataTablePaginationLicoes } from "./table-licoes-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[]
}

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export function DataTableLicoesCelulas<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter()

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  console.log('data Front', data)
  //@ts-ignore
  const qntCelulasSupVerde = String(data?.length).padStart(2, '0')

  return (
    <div className="px-6 py-4 rounded-xl bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start w-full gap-3">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:mb-4 sm:justify-start">
          <div className="flex flex-col justify-between w-full gap-3">
            <div className="flex flex-col justify-between w-full gap-3">
              <h1 className="text-lg font-semibold text-gray-700 mt-2">
                Licões de Célula
              </h1>
            </div>
            <div className="flex items-center justify-start flex-wrap gap-3">
              <TagQuantidadeCelulas key={Math.random()} cor="sky" nomeSupervisao="Total" data={qntCelulasSupVerde} />
            </div>
          </div>
        </div>
      </div>
      {/* FILTRO */}
      <div className="flex items-center  justify-between py-4">
        <Input
          placeholder="🔍 Filtrar pelo título..."
          value={globalFilter ?? ""}
          onChange={(event) => {
            setGlobalFilter(String(event.target.value));
          }}
          className="sm:max-w-sm"
        />
        <div className="flex items-center justify-end  gap-2">
          <AddNewLicaoCelula />
        </div>
      </div>
      {/* TABELA */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="space-x-2 py-4">
        <DataTablePaginationLicoes table={table} />
      </div>
    </div>
  );
}
