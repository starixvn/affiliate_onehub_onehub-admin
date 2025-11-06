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
import { status, deviceTypes } from '../../data/data'
import { type Component } from '../../data/schema'
import { ComponentBulkActions } from './component-bulk-actions'
import { getComponentColumns } from './component-columns'
import { ComponentMultiDeleteDialog } from './component-multi-delete-dialog'

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
  const isLandingPage = useMemo(
    () => selectedCategory === '6',
    [selectedCategory]
  )

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    deviceIds: isLandingPage,
  })

  useEffect(() => {
    setColumnVisibility((prev) => ({
      ...prev,
      deviceIds: isLandingPage,
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
    const deviceColumn = table.getColumn('deviceIds')
    if (deviceColumn && search.deviceIds) {
      const deviceValues = (search.deviceIds as string).split(',')
      deviceColumn.setFilterValue(deviceValues)
    } else if (deviceColumn && !search.deviceIds) {
      deviceColumn.setFilterValue(undefined)
    }
  }, [search.deviceIds, table])

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
        defaultValue: search.status
          ? (search.status as string).split(',')
          : undefined,
      },
      {
        columnId: 'deviceIds',
        title: 'Device',
        options: deviceTypes.map(({ label, value }) => ({
          label,
          value,
        })),
        defaultValue: search.deviceIds
          ? (search.deviceIds as string).split(',')
          : undefined,
        hidden: !isLandingPage,
      },
    ],
    [isLandingPage, search.status, search.deviceIds]
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
          const statusFilter = table.getColumn('status')?.getFilterValue() as
            | string[]
            | undefined
          const deviceFilter = table
            .getColumn('deviceIds')
            ?.getFilterValue() as string[] | undefined
          navigate({
            search: {
              ...search,
              search: searchValue || undefined,
              status: statusFilter?.join(',') || undefined,
              deviceIds: deviceFilter?.join(',') || undefined,
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
