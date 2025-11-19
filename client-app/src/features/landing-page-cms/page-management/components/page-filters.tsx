import { useState, useEffect } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { type Table } from '@tanstack/react-table'
import { Search, X, Settings2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { MultiSelectFilter } from '@/components/multi-select-filter'
import { DatePicker } from '@/components/date-picker'
import type { LandingPage } from '../data/schema'
import { useLandingPages } from './page-provider'

const DEFAULT_STATUS = '0,1'

interface PageFiltersProps {
  table?: Table<LandingPage> | null
}

export function PageFilters({ table }: PageFiltersProps) {
  const { t } = useTranslation('page-management')
  const { countries, languages, pageStatus, navigate, search, defaultFromDate, defaultToDate } = useLandingPages()

  const countryOptions = countries.map((country) => ({
    value: country.targetCountryCode,
    label: country.targetCountryName,
  }))
  
  const languageOptions = [
    ...new Map(
      languages.map((language) => [language.languageCode, language])
    ).values(),
  ].map((language) => ({
    value: language.languageCode,
    label: language.languageName,
  }))
  
  const statusOptions = pageStatus.map((status) => ({
    value: status.statusId.toString(),
    label: status.status,
  }))

  const [searchValue, setSearchValue] = useState((search.search as string) || '')
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    typeof search.countryCode === 'string' && search.countryCode
      ? search.countryCode.split(',').filter(Boolean)
      : []
  )
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    typeof search.languageCode === 'string' && search.languageCode
      ? search.languageCode.split(',').filter(Boolean)
      : []
  )
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    typeof search.status === 'string' && search.status
      ? search.status.split(',').filter(Boolean)
      : DEFAULT_STATUS.split(',')
  )
  const [fromDate, setFromDate] = useState<Date | undefined>(
    search.fromDate ? new Date(search.fromDate as string) : defaultFromDate
  )
  const [toDate, setToDate] = useState<Date | undefined>(
    search.toDate ? new Date(search.toDate as string) : defaultToDate
  )

  const [localColumnVisibility, setLocalColumnVisibility] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    setSearchValue((search.search as string) || '')
    setSelectedCountries(
      typeof search.countryCode === 'string' && search.countryCode
        ? search.countryCode.split(',').filter(Boolean)
        : []
    )
    setSelectedLanguages(
      typeof search.languageCode === 'string' && search.languageCode
        ? search.languageCode.split(',').filter(Boolean)
        : []
    )
    setSelectedStatuses(
      typeof search.status === 'string' && search.status
        ? search.status.split(',').filter(Boolean)
        : DEFAULT_STATUS.split(',')
    )
    setFromDate(search.fromDate ? new Date(search.fromDate as string) : defaultFromDate)
    setToDate(search.toDate ? new Date(search.toDate as string) : defaultToDate)
  }, [search.search, search.countryCode, search.languageCode, search.status, search.fromDate, search.toDate, defaultFromDate, defaultToDate])

  const handleSearch = () => {
    navigate({
      search: {
        ...search,
        search: searchValue || undefined,
        countryCode: selectedCountries.length > 0 ? selectedCountries.join(',') : undefined,
        languageCode: selectedLanguages.length > 0 ? selectedLanguages.join(',') : undefined,
        status: selectedStatuses.length > 0 ? selectedStatuses.join(',') : undefined,
        fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
        toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
        pageIndex: 1,
        pageSize: 10,
      },
    })
  }

  const handleReset = () => {
    setSearchValue('')
    setSelectedCountries([])
    setSelectedLanguages([])
    setSelectedStatuses(DEFAULT_STATUS.split(','))
    setFromDate(defaultFromDate)
    setToDate(defaultToDate)
  }

  const isFiltered =
    searchValue ||
    selectedCountries.length > 0 ||
    selectedLanguages.length > 0 ||
    selectedStatuses.join(',') !== DEFAULT_STATUS ||
    fromDate ||
    toDate

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='relative max-w-sm min-w-[200px] flex-1 sm:min-w-[350px] sm:flex-initial'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder={t('filters.searchPlaceholder', 'Search by campaign or landing page...')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            className='h-9 pl-9 pr-8'
          />
          {searchValue && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => setSearchValue('')}
              className='absolute end-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full'
              aria-label={t('filters.clearSearch', 'Clear search')}
            >
              <Cross2Icon className='h-3 w-3' />
            </Button>
          )}
        </div>

        <MultiSelectFilter
          title={t('filters.country', 'Country')}
          options={countryOptions}
          selectedValues={selectedCountries}
          onValuesChange={setSelectedCountries}
          searchPlaceholder={t('filters.countryPlaceholder', 'Search country...')}
        />

        <MultiSelectFilter
          title={t('filters.language', 'Language')}
          options={languageOptions}
          selectedValues={selectedLanguages}
          onValuesChange={setSelectedLanguages}
          searchPlaceholder={t('filters.languagePlaceholder', 'Search language...')}
        />

        <MultiSelectFilter
          title={t('filters.status', 'Status')}
          options={statusOptions}
          selectedValues={selectedStatuses}
          onValuesChange={setSelectedStatuses}
          searchPlaceholder={t('filters.statusPlaceholder', 'Search status...')}
        />

        <div className='flex items-center gap-2'>
          <DatePicker
            selected={fromDate}
            onSelect={setFromDate}
            placeholder={t('filters.fromDate', 'From Date')}
          />
          <span className='text-muted-foreground text-sm'>-</span>
          <DatePicker
            selected={toDate}
            onSelect={setToDate}
            placeholder={t('filters.toDate', 'To Date')}
          />
        </div>

        {isFiltered && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleReset}
            className='h-9 flex-1 gap-2 sm:flex-initial'
          >
            {t('filters.reset', 'Reset')}
            <X className='h-4 w-4' />
          </Button>
        )}

        <Button
          variant='default'
          size='sm'
          onClick={handleSearch}
          className='h-9 flex-1 sm:flex-initial'
        >
          <Search className='mr-2 h-4 w-4' />
          {t('filters.search', 'Search')}
        </Button>

        {table && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='ml-auto h-9'
                title={t('filters.toggleColumns', 'Toggle columns')}
              >
                <Settings2 className='h-4 w-4 sm:mr-2' />
                <span className='hidden sm:inline'>{t('filters.view', 'View')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[200px]'>
              <DropdownMenuLabel>
                {t('filters.toggleColumns', 'Toggle columns')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columnId = column.id
                  const displayName = t(`table.${columnId}`, columnId)
                  const isVisible =
                    columnId in localColumnVisibility
                      ? localColumnVisibility[columnId]
                      : column.getIsVisible()

                  return (
                    <DropdownMenuCheckboxItem
                      key={columnId}
                      className='capitalize'
                      checked={isVisible}
                      onCheckedChange={(checked) => {
                        setLocalColumnVisibility((prev) => ({
                          ...prev,
                          [columnId]: checked,
                        }))
                        column.toggleVisibility(checked)
                      }}
                      onSelect={(e) => {
                        e.preventDefault()
                      }}
                    >
                      {displayName}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

