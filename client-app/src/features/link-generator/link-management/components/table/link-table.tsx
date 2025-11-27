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
import { type LinkInfo } from '../../data/schema'
import { getLinkColumns } from './link-columns'
import { useLinks } from '../link-provider'
import { useLinkTableFilters } from './use-link-table-filters'
import { useLinkFilters } from './link-filters'
import { getDefaultStartDate, getDefaultEndDate, parseDateString, formatDateToString } from '../../utils/date'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className?: string
    displayName?: string
  }
}

type DataTableProps = {
  data: LinkInfo[]
  totalCount: number
  pageIndex: number
  pageSize: number
  search: Record<string, unknown>
  navigate: NavigateFn
}


export function LinkTable({
  data,
  totalCount,
  pageIndex,
  pageSize,
  search,
  navigate,
}: DataTableProps) {
  const { t } = useTranslation('link-management')
  const { setCurrentRow, setOpen } = useLinks()
  const [sorting, setSorting] = useState<SortingState>([])
  const filters = useLinkFilters()

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      try {
        const stored = getLocalStorageItem(
          'table-column-visibility:link-management'
        )
        return stored ? JSON.parse(stored) : {}
      } catch {
        return {}
      }
    }
  )

  useEffect(() => {
    setLocalStorageItem(
      'table-column-visibility:link-management',
      JSON.stringify(columnVisibility)
    )
  }, [columnVisibility])

  const columns = useMemo(() => {
    const baseColumns = getLinkColumns(t)
    const filterColumns = [
      {
        id: 'filter_country',
        accessorFn: () => '',
        enableHiding: false,
      },
      {
        id: 'filter_channel',
        accessorFn: () => '',
        enableHiding: false,
      },
      {
        id: 'filter_status',
        accessorFn: () => '',
        enableHiding: false,
      },
    ]
    return [...baseColumns, ...filterColumns]
  }, [t])

  const pageCount = Math.ceil(totalCount / pageSize)

  const filterState = useLinkTableFilters(search, navigate)

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
      columnVisibility: {
        ...columnVisibility,
        filter_country: false,
        filter_channel: false,
        filter_status: false,
      },
      columnFilters: filterState.columnFilters,
    },
    meta: {
      linksContext: {
        setCurrentRow,
        setOpen,
      },
    },
    getRowId: (row) => String(row.linkId),
    manualPagination: true,
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
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: filterState.setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

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
        initialSearchValue={filterState.searchValue}
        defaultSearchValue=''
        submitLabel={t('searchToolbar.submit')}
        dateRange={{
          title: t('filters.createdDate'),
          value: filterState.dateRange,
          onChange: filterState.setDateRange,
          defaultValue: {
            from: parseDateString(getDefaultStartDate()),
            to: parseDateString(getDefaultEndDate()),
          },
        }}
        onSubmit={(searchValue) => filterState.handleSubmit(searchValue, table)}
        onReset={filterState.handleReset}
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
    </div>
  )
}

