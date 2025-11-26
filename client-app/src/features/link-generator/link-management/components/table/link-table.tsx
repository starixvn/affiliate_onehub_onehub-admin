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
import { format, parse } from 'date-fns'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Search } from 'lucide-react'
import { DataTablePagination, DataTableFacetedFilter, DataTableViewOptions } from '@/components/data-table'
import { DateRangeFilter } from '@/components/date-range-filter'
import { useGetCountries, useGetChannels } from '../../api/queries'
import { statuses } from '../../data/link'
import { type LinkInfo } from '../../data/schema'
import { getLinkColumns } from './link-columns'
import { useLinks } from '../link-provider'

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

const getDefaultStartDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

const getDefaultEndDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseDateString = (dateStr: string | undefined): Date | undefined => {
  if (!dateStr) return undefined
  try {
    return parse(dateStr, 'yyyy-MM-dd', new Date())
  } catch {
    return undefined
  }
}

const formatDateToString = (date: Date | undefined): string => {
  if (!date) return ''
  return format(date, 'yyyy-MM-dd')
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
  const [searchValue, setSearchValue] = useState((search.search as string) ?? '')

  const { data: countries } = useGetCountries()
  const { data: channels } = useGetChannels()

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>(() => ({
    from: parseDateString((search.startDate as string) ?? getDefaultStartDate()),
    to: parseDateString((search.endDate as string) ?? getDefaultEndDate()),
  }))

  const buildFiltersFromSearch = (
    searchParams: Record<string, unknown>
  ): ColumnFiltersState => {
    const filters: ColumnFiltersState = []

    if (searchParams.countryCodes && typeof searchParams.countryCodes === 'string') {
      filters.push({ id: 'filter_country', value: searchParams.countryCodes.split(',') })
    } else if (searchParams.countryCodes === '') {
      filters.push({ id: 'filter_country', value: undefined })
    }

    if (searchParams.channelIds && typeof searchParams.channelIds === 'string') {
      filters.push({ id: 'filter_channel', value: searchParams.channelIds.split(',') })
    } else if (searchParams.channelIds === '') {
      filters.push({ id: 'filter_channel', value: undefined })
    }

    if (searchParams.statusIds && typeof searchParams.statusIds === 'string') {
      filters.push({ id: 'filter_status', value: searchParams.statusIds.split(',') })
    } else if (searchParams.statusIds === '') {
      filters.push({ id: 'filter_status', value: undefined })
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
      columnFilters,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.countryCodes, search.channelIds, search.status])

  useEffect(() => {
    setDateRange({
      from: parseDateString((search.startDate as string) ?? getDefaultStartDate()),
      to: parseDateString((search.endDate as string) ?? getDefaultEndDate()),
    })
  }, [search.startDate, search.endDate])

  useEffect(() => {
    setSearchValue((search.search as string) ?? '')
  }, [search.search])

  const hasChangedFilters = useMemo(() => {
    const searchDiffers = searchValue !== ''
    const countryFilter = table.getColumn('filter_country')?.getFilterValue() as string[] | undefined
    const channelFilter = table.getColumn('filter_channel')?.getFilterValue() as string[] | undefined
    const statusFilter = table.getColumn('filter_status')?.getFilterValue() as string[] | undefined
    const countryDiffers = countryFilter && countryFilter.length > 0
    const channelDiffers = channelFilter && channelFilter.length > 0
    const statusDiffers = statusFilter && (statusFilter.length === 0 || statusFilter.join(',') !== '1')
    const dateDiffers =
      formatDateToString(dateRange.from) !== getDefaultStartDate() ||
      formatDateToString(dateRange.to) !== getDefaultEndDate()

    return searchDiffers || countryDiffers || channelDiffers || statusDiffers || dateDiffers
  }, [searchValue, dateRange, table])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const countryFilter = table.getColumn('filter_country')?.getFilterValue() as string[] | undefined
    const channelFilter = table.getColumn('filter_channel')?.getFilterValue() as string[] | undefined
    const statusFilter = table.getColumn('filter_status')?.getFilterValue() as string[] | undefined
    navigate({
      search: {
        ...search,
        search: searchValue || undefined,
        countryCodes: countryFilter?.length ? countryFilter.join(',') : '',
        channelIds: channelFilter?.length ? channelFilter.join(',') : '',
        statusIds: statusFilter?.length ? statusFilter.join(',') : '',
        startDate: formatDateToString(dateRange.from) || getDefaultStartDate(),
        endDate: formatDateToString(dateRange.to) || getDefaultEndDate(),
        pageIndex: 1,
      },
    })
  }

  const handleReset = () => {
    setSearchValue('')
    setDateRange({
      from: parseDateString(getDefaultStartDate()),
      to: parseDateString(getDefaultEndDate()),
    })
    table.getColumn('filter_country')?.setFilterValue([])
    table.getColumn('filter_channel')?.setFilterValue([])
    table.getColumn('filter_status')?.setFilterValue(['1'])
    navigate({
      search: {
        ...search,
        search: undefined,
        countryCodes: undefined,
        channelIds: undefined,
        status: '1',
        startDate: getDefaultStartDate(),
        endDate: getDefaultEndDate(),
        pageIndex: 1,
      },
    })
  }

  const filters = useMemo(
    () => [
      {
        columnId: 'filter_country',
        title: t('filters.country'),
        options: (countries || []).map((country) => ({
          label: country.targetCountryName,
          value: country.targetCountryCode,
        })),
        defaultValue: [],
      },
      {
        columnId: 'filter_channel',
        title: t('filters.channel'),
        options: (channels || []).map((channel) => ({
          label: channel.componentName,
          value: String(channel.componentId),
        })),
        defaultValue: [],
      },
      {
        columnId: 'filter_status',
        title: t('filters.status'),
        options: statuses.map(({ label, value }) => ({
          label,
          value,
        })),
        defaultValue: ['1'],
      },
    ],
    [t, countries, channels]
  )

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
          <form onSubmit={handleSubmit} className='flex flex-wrap items-center gap-2'>
            <div className='relative'>
              <Input
                placeholder={t('table.search')}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={cn('h-8 w-[150px] pe-8 lg:w-[250px]', 'w-[250px] lg:w-[350px]')}
              />
              {searchValue.length > 0 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => setSearchValue('')}
                  className='absolute end-1 top-1 h-6 w-6 rounded-full'
                  aria-label='Clear'
                >
                  <Cross2Icon className='h-3 w-3' />
                </Button>
              )}
            </div>
            {filters.map((filter) => {
              const column = table.getColumn(filter.columnId)
              if (!column) return null
              return (
                <DataTableFacetedFilter
                  key={filter.columnId}
                  column={column}
                  title={filter.title}
                  options={filter.options}
                />
              )
            })}
            <DateRangeFilter
              title={t('filters.createdDate')}
              from={dateRange.from}
              to={dateRange.to}
              onSelect={(range) => setDateRange(range)}
            />
            <Button type='submit' size='sm' className='h-8'>
              <Search className='me-2 h-4 w-4' />
              {t('searchToolbar.submit')}
            </Button>
            {hasChangedFilters && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-8'
                onClick={handleReset}
              >
                {t('common:dataTable.reset') || 'Reset'}
              </Button>
            )}
          </form>
        </div>
        <DataTableViewOptions table={table} />
      </div>
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

