import { useState, useMemo } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import { type LandingPage } from '../../data/schema'
import { PageMultiDeleteDialog } from '../dialog/page-multi-delete-dialog'
import { PageBulkActions } from './page-bulk-actions'
import { getPageColumns } from './page-columns'
import { PageFilters } from '../page-filters'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className: string
    displayName?: string
  }
}

type DataTableProps = {
  data: LandingPage[]
  totalCount: number
  pageIndex: number
  pageSize: number
  search: Record<string, unknown>
  navigate: NavigateFn
  landingPageUrl?: string
}

export function PageTable({
  data,
  totalCount,
  pageIndex,
  pageSize,
  search,
  navigate,
  landingPageUrl,
}: DataTableProps) {
  const { t } = useTranslation('page-management')
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const columns = useMemo(() => getPageColumns(t, landingPageUrl), [t, landingPageUrl])

  const pageCount = Math.ceil(totalCount / pageSize)

  const table = useReactTable({
    data,
    columns,
    pageCount,
    rowCount: totalCount,
    state: {
      sorting,
      pagination: {
        pageIndex: pageIndex - 1,
        pageSize,
      },
      rowSelection,
      columnVisibility,
    },
    getRowId: (row) => row.lpCode,
    manualPagination: true,
    enableRowSelection: true,
    onPaginationChange: (updater) => {
      const nextState =
        typeof updater === 'function'
          ? updater({ pageIndex: pageIndex - 1, pageSize })
          : updater

      navigate({
        search: {
          ...search,
          pageIndex: nextState.pageIndex + 1,
          pageSize: nextState.pageSize,
        },
      })
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <PageFilters table={table} />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        header.column.columnDef.meta?.className ?? ''
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className ?? '',
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
                      )}
                    >
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
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {t('table.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      <PageBulkActions
        table={table}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
      />
      <PageMultiDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        table={table}
      />
    </div>
  )
}

