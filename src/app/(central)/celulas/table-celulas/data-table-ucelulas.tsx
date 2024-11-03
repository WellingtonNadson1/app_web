'use client'

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
  useReactTable,
} from '@tanstack/react-table'

import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BookOpenText } from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { TagQuantidadeCelulas } from '../_components/TagQuantidadeCelulas'
import AddNewCelula from '../AddNewCelula'
import { DataTablePagination } from './table-pagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
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

export function DataTableCelulas<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
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
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  })

  const qntCelulasSupVermelha = String(
    //@ts-ignore
    data.filter((celula) => celula?.supervisao?.nome === 'vermelha').length,
  ).padStart(2, '0')
  const qntCelulasSupAzul = String(
    //@ts-ignore
    data.filter((celula) => celula?.supervisao?.nome === 'azul').length,
  ).padStart(2, '0')
  const qntCelulasSupLaranja = String(
    //@ts-ignore
    data.filter((celula) => celula?.supervisao?.nome === 'laranja').length,
  ).padStart(2, '0')
  const qntCelulasSupVerde = String(
    //@ts-ignore
    data.filter((celula) => celula?.supervisao?.nome === 'verde').length,
  ).padStart(2, '0')
  const qntCelulasSupAmarela = String(
    //@ts-ignore
    data.filter((celula) => celula?.supervisao?.nome === 'amarela').length,
  ).padStart(2, '0')

  return (
    <div className="px-6 py-4 rounded-xl bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start w-full gap-3">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:mb-4 sm:justify-start">
          <div className="flex flex-col justify-between w-full gap-3">
            <div className="flex flex-col justify-between w-full gap-3">
              <h1 className="text-lg font-semibold text-gray-700 mt-2">
                Lista de Todas as Células da IBB
              </h1>
            </div>
            <div className="flex items-center justify-start flex-wrap gap-3">
              <Badge className="items-center justify-center px-2 py-1 text-xs font-medium text-center rounded-md ring-1 ring-inset md:block">
                <p className="flex items-center justify-between">
                  Total{' '}
                  <span className="px-1 py-1 ml-2 text-black rounded-md bg-white">
                    {data?.length}
                  </span>
                </p>
              </Badge>
              <TagQuantidadeCelulas
                key={Math.random()}
                cor="red"
                nomeSupervisao="Vermelha"
                data={qntCelulasSupVermelha}
              />
              <TagQuantidadeCelulas
                key={Math.random()}
                cor="blue"
                nomeSupervisao="Azul"
                data={qntCelulasSupAzul}
              />
              <TagQuantidadeCelulas
                key={Math.random()}
                cor="orange"
                nomeSupervisao="Laranja"
                data={qntCelulasSupLaranja}
              />
              <TagQuantidadeCelulas
                key={Math.random()}
                cor="green"
                nomeSupervisao="Verde"
                data={qntCelulasSupVerde}
              />
              <TagQuantidadeCelulas
                key={Math.random()}
                nomeSupervisao="Amarela"
                data={qntCelulasSupAmarela}
              />
            </div>
          </div>
        </div>
      </div>
      {/* FILTRO */}
      <div className="flex items-center  justify-between py-4">
        <Input
          placeholder="🔍 Filtrar por qualquer dado..."
          value={globalFilter ?? ''}
          onChange={(event) => {
            setGlobalFilter(String(event.target.value))
          }}
          className="sm:max-w-sm"
        />
        <div className="flex items-center justify-end  gap-2">
          <AddNewCelula />
          <Button
            className="flex items-center justify-between gap-2"
            type="button"
            onClick={() => router.push('/celulas/tema-licoes-celula')}
          >
            <BookOpenText /> Lições de Célula
          </Button>
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
      <div className="space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
