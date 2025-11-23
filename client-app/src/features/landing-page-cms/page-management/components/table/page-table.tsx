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
import { format } from 'date-fns'
import { CalendarIcon, Search } from 'lucide-react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/local-storage'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DataTablePagination, DataTableFacetedFilter, DataTableViewOptions } from '@/components/data-table'
import { DateRangePicker } from '@/components/date-range-picker'
import { type LandingPage } from '../../data/schema'
import { PageMultiDeleteDialog } from '../dialog/page-multi-delete-dialog'
import { PageBulkActions } from './page-bulk-actions'
import { getPageColumns } from './page-columns'
import { useLandingPages } from '../page-provider'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const DEFAULT_STATUS = '0,1'

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
  const { countries, languages, pageStatus, defaultFromDate, defaultToDate } = useLandingPages()

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    try {
      const stored = getLocalStorageItem('table-column-visibility:page-management')
      return stored ? JSON.parse(stored) : { countryCode: false, languageCode: false }
    } catch {
      return { countryCode: false, languageCode: false }
    }
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [datePopoverOpen, setDatePopoverOpen] = useState(false)
  const [searchValue, setSearchValue] = useState((search.search as string) ?? '')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  const [fromDate, setFromDate] = useState<Date | undefined>(
    search.fromDate ? new Date(search.fromDate as string) : defaultFromDate
  )
  const [toDate, setToDate] = useState<Date | undefined>(
    search.toDate ? new Date(search.toDate as string) : defaultToDate
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

    if (searchParams.countryCode && typeof searchParams.countryCode === 'string') {
      filters.push({
        id: 'countryCode',
        value: searchParams.countryCode.split(','),
      })
    } else if (searchParams.countryCode === '') {
      filters.push({ id: 'countryCode', value: undefined })
    }

    if (searchParams.languageCode && typeof searchParams.languageCode === 'string') {
      filters.push({
        id: 'languageCode',
        value: searchParams.languageCode.split(','),
      })
    } else if (searchParams.languageCode === '') {
      filters.push({ id: 'languageCode', value: undefined })
    }

    return filters
  }

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    buildFiltersFromSearch(search)
  )

  useEffect(() => {
    setColumnFilters((prev) => {
      const newFilters = buildFiltersFromSearch(search)
      const hasChanged = JSON.stringify(prev) !== JSON.stringify(newFilters)
      return hasChanged ? newFilters : prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.status, search.countryCode, search.languageCode])

  useEffect(() => {
    setFromDate(search.fromDate ? new Date(search.fromDate as string) : defaultFromDate)
    setToDate(search.toDate ? new Date(search.toDate as string) : defaultToDate)
  }, [search.fromDate, search.toDate, defaultFromDate, defaultToDate])

  useEffect(() => {
    setSearchValue((search.search as string) ?? '')
  }, [search.search])

  useEffect(() => {
    setLocalStorageItem('table-column-visibility:page-management', JSON.stringify(columnVisibility))
  }, [columnVisibility])

  const columns = useMemo(() => getPageColumns(t, landingPageUrl), [t, landingPageUrl])

  const pageCount = Math.ceil(totalCount / pageSize)

  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country.targetCountryCode,
        label: country.targetCountryName,
      })),
    [countries]
  )

  const languageOptions = useMemo(() => {
    const countryFilter = columnFilters.find((f) => f.id === 'countryCode')
      ?.value as string[] | undefined

    const filteredLanguages =
      countryFilter && countryFilter.length > 0
        ? languages.filter((lang) =>
          countryFilter.includes(lang.targetCountryCode)
        )
        : languages

    return [
      ...new Map(
        filteredLanguages.map((language) => [language.languageCode, language])
      ).values(),
    ].map((language) => ({
      value: language.languageCode,
      label: language.languageName,
    }))
  }, [languages, columnFilters])

  const statusOptions = useMemo(
    () =>
      pageStatus.map((status) => ({
        value: status.statusId.toString(),
        label: status.status,
      })),
    [pageStatus]
  )

  const filters = useMemo(
    () => [
      {
        columnId: 'countryCode',
        title: t('filters.country', 'Country'),
        options: countryOptions,
        defaultValue: undefined,
      },
      {
        columnId: 'languageCode',
        title: t('filters.language', 'Language'),
        options: languageOptions,
        defaultValue: undefined,
      },
      {
        columnId: 'status',
        title: t('filters.status', 'Status'),
        options: statusOptions,
        defaultValue: DEFAULT_STATUS.split(','),
      },
    ],
    [t, countryOptions, languageOptions, statusOptions]
  )

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
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const statusFilter = columnFilters.find(f => f.id === 'status')?.value as string[] | undefined
    const countryFilter = columnFilters.find(f => f.id === 'countryCode')?.value as string[] | undefined
    const languageFilter = columnFilters.find(f => f.id === 'languageCode')?.value as string[] | undefined

    navigate({
      search: {
        ...search,
        search: searchValue || undefined,
        status: statusFilter?.length ? statusFilter.join(',') : DEFAULT_STATUS,
        countryCode: countryFilter?.join(',') || undefined,
        languageCode: languageFilter?.join(',') || undefined,
        fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
        toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
        pageIndex: 1,
      },
    })
  }

  const handleReset = () => {
    setSearchValue('')
    setFromDate(defaultFromDate)
    setToDate(defaultToDate)
    setSelectedPreset(null)
    filters.forEach((filter) => {
      const column = table.getColumn(filter.columnId)
      column?.setFilterValue(filter.defaultValue)
    })
  }

  const handleClearSearch = () => {
    setSearchValue('')
  }

  const hasChangedFilters = useMemo(() => {
    const searchDiffers = searchValue !== ''

    const fromDateDiffers = fromDate?.setHours(0, 0, 0, 0) !== defaultFromDate?.setHours(0, 0, 0, 0)
    const toDateDiffers = toDate?.setHours(0, 0, 0, 0) !== defaultToDate?.setHours(0, 0, 0, 0)

    const filterDiffers = filters.some((filter) => {
      const currentValue = columnFilters.find(f => f.id === filter.columnId)?.value
      const defaultValue = filter.defaultValue

      const normalizedCurrent =
        Array.isArray(currentValue) && currentValue.length === 0
          ? undefined
          : currentValue
      const normalizedDefault =
        Array.isArray(defaultValue) && defaultValue.length === 0
          ? undefined
          : defaultValue

      if (normalizedCurrent === undefined && normalizedDefault === undefined) {
        return false
      }

      if (
        Array.isArray(normalizedCurrent) &&
        Array.isArray(normalizedDefault)
      ) {
        if (normalizedCurrent.length !== normalizedDefault.length) return true
        return normalizedCurrent.some(
          (val, idx) => val !== normalizedDefault[idx]
        )
      } else if (
        Array.isArray(normalizedCurrent) ||
        Array.isArray(normalizedDefault)
      ) {
        return true
      } else {
        return normalizedCurrent !== normalizedDefault
      }
    })

    return searchDiffers || filterDiffers || fromDateDiffers || toDateDiffers
  }, [searchValue, filters, columnFilters, fromDate, toDate, defaultFromDate, defaultToDate])

  return (
    <div className={cn('max-sm:has-[div[role="toolbar"]]:mb-16', 'flex flex-1 flex-col gap-4')}>
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 items-center'>
          <form onSubmit={handleSubmit} className='flex items-center gap-2'>
            <div className='relative'>
              <Input
                placeholder={t('filters.searchPlaceholder', 'Search by campaign or landing page...')}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='h-8 w-[250px] pe-8 lg:w-[350px]'
              />
              {searchValue.length > 0 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={handleClearSearch}
                  className='absolute end-1 top-1 h-6 w-6 rounded-full'
                  aria-label={t('filters.clear')}
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
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className={cn(
                    'h-8 justify-start text-left font-normal',
                    !fromDate && !toDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  <span className='font-medium'>{t('filters.createdDate', 'Created Date')}</span>
                  {selectedPreset === 'entirePeriod' ? (
                    <>
                      <span className='mx-2'>|</span>
                      <span>{t('filters.entirePeriod', 'Entire Period')}</span>
                    </>
                  ) : fromDate && toDate ? (
                    <>
                      <span className='mx-2'>|</span>
                      {format(fromDate, 'MMM dd, yyyy')} - {format(toDate, 'MMM dd, yyyy')}
                    </>
                  ) : (
                    <>
                      <span className='mx-2'>|</span>
                      <span>{t('filters.selectDateRange', 'Select date range')}</span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <DateRangePicker
                  from={fromDate}
                  to={toDate}
                  onSelect={({ from, to, preset }) => {
                    setFromDate(from)
                    setToDate(to)
                    setSelectedPreset(preset ?? null)
                  }}
                  minDate={defaultFromDate}
                  maxDate={defaultToDate}
                  disabledPresets={searchValue.trim() === '' ? ['entirePeriod'] : []}
                />
              </PopoverContent>
            </Popover>
            {hasChangedFilters && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-8 px-2 lg:px-3'
                onClick={handleReset}
              >
                {t('filters.reset', 'Reset')}
                <Cross2Icon className='ml-2 h-4 w-4' />
              </Button>
            )}
            <Button type='submit' size='sm' className='h-8'>
              <Search className='me-2 h-4 w-4' />
              {t('filters.search', 'Search')}
            </Button>
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

