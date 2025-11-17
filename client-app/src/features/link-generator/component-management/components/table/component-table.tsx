import { useState, useMemo, useEffect } from 'react'
import {
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/local-storage'
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
import { deviceTypes, LANDING_PAGE_CATEGORY_ID, status } from '../../data/data'
import { type Component } from '../../data/schema'
import { ComponentMultiDeleteDialog } from '../dialog/component-multi-delete-dialog'
import { ComponentBulkActions } from './component-bulk-actions'
import { getComponentColumns } from './component-columns'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    () => selectedCategory === String(LANDING_PAGE_CATEGORY_ID),
    [selectedCategory]
  )

  const buildFiltersFromSearch = (
    searchParams: Record<string, unknown>
  ): ColumnFiltersState => {
    const filters: ColumnFiltersState = []

    if (searchParams.status && typeof searchParams.status === 'string') {
      filters.push({ id: 'status', value: searchParams.status.split(',') })
    } else if (searchParams.status === '') {
      filters.push({ id: 'status', value: undefined })
    }

    if (searchParams.deviceIds && typeof searchParams.deviceIds === 'string') {
      filters.push({
        id: 'deviceId',
        value: searchParams.deviceIds.split(','),
      })
    }

    return filters
  }

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    buildFiltersFromSearch(search)
  )

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      try {
        const stored = getLocalStorageItem(
          'table-column-visibility:component-management'
        )
        return stored ? JSON.parse(stored) : {}
      } catch {
        return {}
      }
    }
  )

  useEffect(() => {
    setLocalStorageItem(
      'table-column-visibility:component-management',
      JSON.stringify(columnVisibility)
    )
  }, [columnVisibility])

  const columns = useMemo(
    () => getComponentColumns(t, isLandingPage),
    [t, isLandingPage]
  )

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
      columnFilters,
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
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  useEffect(() => {
    setColumnFilters((prev) => {
      const newFilters = buildFiltersFromSearch(search)
      const hasChanged = JSON.stringify(prev) !== JSON.stringify(newFilters)
      return hasChanged ? newFilters : prev
    })
  }, [search.status, search.deviceIds])

  const filters = useMemo(
    () => [
      {
        columnId: 'status',
        title: t('filters.status'),
        options: status.map(({ label, value }) => ({
          label,
          value,
        })),
        defaultValue: ['1'],
      },
      {
        columnId: 'deviceId',
        title: t('filters.device'),
        options: deviceTypes.map(({ label, value }) => ({
          label,
          value,
        })),
        defaultValue: undefined,
        hidden: !isLandingPage,
      },
    ],
    [t, isLandingPage]
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
          const deviceFilter = table.getColumn('deviceId')?.getFilterValue() as
            | string[]
            | undefined
          navigate({
            search: {
              ...search,
              search: searchValue || undefined,
              status: statusFilter?.length ? statusFilter.join(',') : '',
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
