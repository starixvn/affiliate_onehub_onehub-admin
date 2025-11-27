import { useState, useEffect } from 'react'
import { type Table, type ColumnFiltersState } from '@tanstack/react-table'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { getDefaultStartDate, getDefaultEndDate, parseDateString, formatDateToString } from '../../utils/date'
import { type LinkInfo } from '../../data/schema'

export function useLinkTableFilters(
  search: Record<string, unknown>,
  navigate: NavigateFn
) {
  const [searchValue, setSearchValue] = useState((search.search as string) ?? '')

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

  useEffect(() => {
    setColumnFilters((prev) => {
      const newFilters = buildFiltersFromSearch(search)
      const hasChanged = JSON.stringify(prev) !== JSON.stringify(newFilters)
      return hasChanged ? newFilters : prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.countryCodes, search.channelIds, search.statusIds])

  useEffect(() => {
    setDateRange({
      from: parseDateString((search.startDate as string) ?? getDefaultStartDate()),
      to: parseDateString((search.endDate as string) ?? getDefaultEndDate()),
    })
  }, [search.startDate, search.endDate])

  useEffect(() => {
    setSearchValue((search.search as string) ?? '')
  }, [search.search])

  const handleSubmit = (searchValueFromToolbar: string, table: Table<LinkInfo>) => {
    const countryFilter = table.getColumn('filter_country')?.getFilterValue() as string[] | undefined
    const channelFilter = table.getColumn('filter_channel')?.getFilterValue() as string[] | undefined
    const statusFilter = table.getColumn('filter_status')?.getFilterValue() as string[] | undefined
    navigate({
      search: {
        ...search,
        search: searchValueFromToolbar || undefined,
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
    navigate({
      search: {
        ...search,
        search: undefined,
        countryCodes: undefined,
        channelIds: undefined,
        statusIds: '1',
        startDate: getDefaultStartDate(),
        endDate: getDefaultEndDate(),
        pageIndex: 1,
      },
    })
  }

  return {
    searchValue,
    setSearchValue,
    dateRange,
    setDateRange,
    columnFilters,
    setColumnFilters,
    handleSubmit,
    handleReset,
  }
}
