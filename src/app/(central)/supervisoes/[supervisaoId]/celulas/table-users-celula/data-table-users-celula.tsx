'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
} from '@tanstack/react-table'

// A TanStack fork of Kent C. Dodds' match-sorter library that provides ranking information
import {
  RankingInfo,
  compareItems,
  rankItem,
} from '@tanstack/match-sorter-utils'

import AddNewMember from '@/app/(central)/novo-membro/AddNewMember'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { DataTablePagination } from './table-pagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  nomeCelula: string
  nomeSupervisao: string
}

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!,
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export function DataTableUsersCelula<TData, TValue>({
  columns,
  data,
  nomeCelula,
  nomeSupervisao,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

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
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  })

  const situationNormal = data?.filter(
    // @ts-ignore
    (situatio) => situatio?.situacao_no_reino?.nome === 'Normal',
  )
  const situationAtivo = data?.filter(
    // @ts-ignore
    (situatio) => situatio?.situacao_no_reino?.nome === 'Ativo',
  )

  const supervisaoNome = nomeSupervisao as
    | 'vermelha'
    | 'azul'
    | 'laranja'
    | 'amarela'
    | 'verde'

  // Mapeamento das cores com base no nome da supervisão
  const corBadge: {
    [key in 'vermelha' | 'azul' | 'laranja' | 'amarela' | 'verde']: string
  } = {
    vermelha: 'uppercase bg-red-100 text-red-700 hover:bg-red-200',
    azul: 'uppercase bg-blue-100 text-blue-700 hover:bg-blue-200',
    laranja: 'uppercase bg-orange-100 text-orange-700 hover:bg-orange-200',
    amarela: 'uppercase bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    verde: 'uppercase bg-green-100 text-green-700 hover:bg-green-200',
  }

  return (
    <div className="px-6 py-4 rounded-xl bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start w-full gap-3">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:mb-4 sm:justify-start">
          <div className="flex flex-col justify-between w-full gap-3">
            <div className="flex flex-col justify-between w-full gap-3">
              <h1 className="flex items-center justify-start gap-2 text-lg font-semibold text-gray-700 mt-2">
                Supervisão:{' '}
                <Badge
                  className={cn(
                    corBadge[supervisaoNome] ||
                      'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  )}
                >
                  {supervisaoNome}
                </Badge>
              </h1>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Membros da célula:{' '}
                <span className="uppercase">{nomeCelula}</span>
              </h2>
            </div>
            <div className="flex items-center justify-start gap-2">
              <div className="items-center justify-center hidden px-2 py-1 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-zinc-50 text-zinc-700 ring-zinc-600/20 md:block">
                <p className="flex items-center justify-between">
                  Total{' '}
                  <span className="px-1 py-1 ml-2 text-white rounded-md bg-gray-700">
                    {data?.length}
                  </span>
                </p>
              </div>
              <div className="items-center justify-center hidden px-2 py-1 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-blue-50 text-sky-700 ring-blue-600/20 sm:block">
                <p className="flex items-center justify-between">
                  Ativos{' '}
                  <span className="px-1 py-1 ml-2 text-white rounded-md bg-sky-700">
                    {situationAtivo?.length}
                  </span>
                </p>
              </div>
              <div className="items-center justify-center hidden px-2 py-1 text-xs font-medium text-center rounded-md ring-1 ring-inset bg-green-50 text-sky-700 ring-blue-600/20 sm:block">
                <p className="flex items-center justify-between">
                  Normal{' '}
                  <span className="px-1 py-1 ml-2 text-white bg-green-700 rounded-md">
                    {situationNormal?.length}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex mb-4 sm:w-2/5">
          <AddNewMember />
        </div>
      </div>
      {/* FILTRO */}
      <div className="flex items-center py-4">
        <Input
          placeholder="🔍 Filtrar por qualquer dado..."
          // value={(table.getColumn("cnpj")?.getFilterValue() as string) ?? ""}
          value={globalFilter ?? ''}
          onChange={(event) => {
            // table.getColumn("empresa_vistoriada.cnpj")?.setFilterValue(event.target.value)
            setGlobalFilter(String(event.target.value))
          }}
          className="sm:max-w-sm"
        />
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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
      {/* Pagination Control */}
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div> */}
      <div className="space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
