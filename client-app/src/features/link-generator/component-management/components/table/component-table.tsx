import { useState, useMemo, useEffect } from 'react'
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
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { type Component } from '../../data/schema'
import { ComponentMultiDeleteDialog } from './component-multi-delete-dialog'
import { ComponentBulkActions } from './component-bulk-actions'
import { getComponentColumns } from './component-columns'
import { status, deviceTypes } from '../../data/data'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className: string
    displayName?: string
  }
}

type DataTableProps = {
  data: Component[]
  totalCount: number
  pageIndex: number
  pageSize: number
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function ComponentTable({
  data,
  totalCount,
  pageIndex,
  pageSize,
  search,
  navigate,
}: DataTableProps) {
  const { t } = useTranslation('component-management')
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const selectedCategory = (search.category as string) ?? '1'
  const isLandingPage = useMemo(() => selectedCategory === '6', [selectedCategory])

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    deviceType: isLandingPage,
  })

  useEffect(() => {
    setColumnVisibility((prev) => ({
      ...prev,
      deviceType: isLandingPage,
    }))
  }, [isLandingPage])

  const columns = useMemo(() => getComponentColumns(t), [t])

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
    getRowId: (row) => row.componentCode,
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

  useEffect(() => {
    const deviceColumn = table.getColumn('deviceType')
    if (deviceColumn && search.device) {
      const deviceValues = (search.device as string).split(',')
      deviceColumn.setFilterValue(deviceValues)
    } else if (deviceColumn && !search.device) {
      deviceColumn.setFilterValue(undefined)
    }
  }, [search.device, table])

  useEffect(() => {
    const statusColumn = table.getColumn('status')
    if (statusColumn && search.status) {
      const statusValues = (search.status as string).split(',')
      statusColumn.setFilterValue(statusValues)
    } else if (statusColumn && !search.status) {
      statusColumn.setFilterValue(undefined)
    }
  }, [search.status, table])

  const filters = useMemo(
    () => [
      {
        columnId: 'status',
        title: 'Status',
        options: status.map(({ label, value }) => ({
          label,
          value,
        })),
        defaultValue: undefined,
      },
      {
        columnId: 'deviceType',
        title: 'Device',
        options: deviceTypes.map(({ label, value }) => ({
          label,
          value,
        })),
        defaultValue: undefined,
        hidden: !isLandingPage,
      },
    ],
    [isLandingPage]
  )

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder={t('table.search')}
        searchClassName='w-[250px] lg:w-[350px]'
        filters={filters}
        submitLabel={t('searchToolbar.submit')}
        initialSearchValue={(search.search as string) ?? ''}
        defaultSearchValue=''
        onSubmit={(searchValue) => {
          const statusFilter = table.getColumn('status')?.getFilterValue() as string[] | undefined
          const deviceFilter = table.getColumn('deviceType')?.getFilterValue() as string[] | undefined
          navigate({
            search: {
              ...search,
              search: searchValue || undefined,
              status: statusFilter?.join(',') || undefined,
              device: deviceFilter?.join(',') || undefined,
              pageIndex: 1,
            },
          })
        }}
      />
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
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className ?? ''
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
      <ComponentBulkActions
        table={table}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
      />
      <ComponentMultiDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        table={table}
      />
    </div>
  )
}
