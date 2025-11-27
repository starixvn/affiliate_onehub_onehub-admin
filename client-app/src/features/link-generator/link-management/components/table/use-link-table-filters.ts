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

  const getHasChangedFilters = (table: Table<LinkInfo>) => {
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
  }

  const getHandleSubmit = (table: Table<LinkInfo>) => (e: React.FormEvent) => {
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

  const getHandleReset = (table: Table<LinkInfo>) => () => {
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
    getHandleSubmit,
    getHandleReset,
    getHasChangedFilters
  }
}
