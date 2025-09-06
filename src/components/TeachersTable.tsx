'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal, Pen, Trash2, View } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Teacher } from '@/lib/definitions';
import Link from 'next/link';
import { DeleteTeacherButton } from './DeleteTeacherButton';

export const columns: ColumnDef<Teacher>[] = [
  {
    accessorKey: 'nombre_completo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue('nombre_completo')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'curso',
    header: 'Curso',
    cell: ({ row }) => <div>{row.getValue('curso')}</div>,
  },
  {
    accessorKey: 'asignaturas',
    header: 'Asignaturas',
    cell: ({ row }) => {
      const asignaturas = row.getValue('asignaturas') as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {asignaturas.map((asignatura) => (
            <Badge key={asignatura} variant="secondary">
              {asignatura}
            </Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
        const asignaturas = row.getValue(id) as string[];
        return value.some((val: string) => asignaturas.includes(val));
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const teacher = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/profesores/${teacher.id}`}>
                  <View className="mr-2 h-4 w-4" /> Ver Detalles
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/profesores/${teacher.id}/edit`}>
                  <Pen className="mr-2 h-4 w-4" /> Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <div>
                  <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                  <DeleteTeacherButton id={teacher.id} variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 justify-start w-full p-0 h-auto font-normal">Eliminar</DeleteTeacherButton>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export function TeachersTable({ teachers }: { teachers: Teacher[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const allAsignaturas = React.useMemo(() => {
    const all = new Set<string>();
    teachers.forEach(teacher => {
        teacher.asignaturas.forEach(asignatura => all.add(asignatura));
    });
    return Array.from(all);
  }, [teachers]);

  const table = useReactTable({
    data: teachers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedAsignaturas = (table.getColumn('asignaturas')?.getFilterValue() as string[]) || [];

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn('nombre_completo')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nombre_completo')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Asignaturas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por asignatura</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allAsignaturas.map(asignatura => (
              <DropdownMenuCheckboxItem
                key={asignatura}
                className="capitalize"
                checked={selectedAsignaturas.includes(asignatura)}
                onCheckedChange={(value) => {
                  let currentFilter = [...selectedAsignaturas];
                  if(value) {
                    currentFilter.push(asignatura);
                  } else {
                    currentFilter = currentFilter.filter(s => s !== asignatura);
                  }
                  table.getColumn('asignaturas')?.setFilterValue(currentFilter.length > 0 ? currentFilter : undefined);
                }}
              >
                {asignatura}
              </DropdownMenuCheckboxItem>
            ))}
             <DropdownMenuSeparator />
             <DropdownMenuItem onSelect={() => table.getColumn('asignaturas')?.setFilterValue(undefined)}>
                Limpiar filtros
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Columnas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
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
        </DropdownMenu>
      </div>
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
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="space-x-2">
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
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
