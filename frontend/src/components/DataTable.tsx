import { ChangeEvent, useState } from 'react';
import notFound from '@/assets/not-found.png';
import Button from '@/components/Button';
// import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/DropdownMenu';
import Input from '@/components/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table';
import { cn } from '@/utils/classes';
import Icon from './Icon';
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  Table as TableType
} from '@tanstack/react-table';

interface TableContentProps<TData> {
  table: TableType<TData>;
  data: TData[];
  noDataText?: string;
  loading?: boolean;
}

function TableContent<TData>({ table, data, loading, noDataText }: TableContentProps<TData>) {
  const headerColumns = table.getHeaderGroups()[0].headers.length;
  if (loading) {
    // TODO : Add Table Skeleton
    return (
      <tr>
        <td colSpan={headerColumns}>
          <div className="flex justify-center items-center p-10">
            <Icon name="CircleNotch" size={24} className="animate-spin" />
          </div>
        </td>
      </tr>
    );
  }

  if (!table || data.length === 0) {
    return (
      <tr>
        <td colSpan={headerColumns}>
          <div className="flex flex-col justify-center items-center p-10 space-y-4">
            <img src={notFound} alt="" className="w-16" />
            <p>{noDataText || 'No data'}</p>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="even:bg-primary-100 even:dark:bg-neutrals-950">
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  noDataText?: string;
  loading?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, noDataText, loading = false }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const tableData = data || [];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });
  table.getVisibleFlatColumns;
  return (
    <div className="w-full">
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide() && column.id !== 'actions')
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu> */}
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) => table.getColumn('email')?.setFilterValue(event.target.value)}
          className="max-w-[160px]"
        />
        <p className={cn((loading || !tableData.length) && 'hidden')}>
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </p>
      </div>
      <div className="rounded-md border">
        <Table className="overflow-hidden">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          {/* {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )} */}
          <TableContent data={tableData} table={table} loading={loading} noDataText={noDataText} />
        </Table>

        <div className="flex items-center justify-end p-4 gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
