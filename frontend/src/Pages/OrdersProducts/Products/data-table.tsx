import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"

import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,

} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  action: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  action,
}: DataTableProps<TData, TValue>) {



  const [rowSelection, setRowSelection] = React.useState({})
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
   
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    enableColumnFilters: true,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
  })
  const searchRef = React.useRef<HTMLInputElement>(null)
 return (
  <div className="flex flex-col w-full gap-4  overflow-x-auto">
    
      <h1 className="text-xl font-semibold">Products</h1>

      <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
        <Input
        ref={searchRef}
          placeholder="Filter by product name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="flex-1"
          id="name"
      autoComplete="off"
        />

        {action}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-primary   ">Columns</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      
    </div>

    <div className="text-sm text-muted-foreground">
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s selected.
    </div>

    <div className="w-full overflow-x-auto rounded-xl border">
      <Table className="w-full min-w-[640px] md:min-w-[700px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full">
      <Button
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  </div>
)
}