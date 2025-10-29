import { useState } from 'react'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { type Table } from '@tanstack/react-table'
import { Search, X, Settings2 } from 'lucide-react'
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
import { COLUMN_DISPLAY_NAMES, DEFAULT_PARAMS } from '../data/constants'
import type { AssetDetail } from '../data/schema'
import { useAssetUploader } from './asset-uploader-provider'

interface AssetFiltersProps {
  table?: Table<AssetDetail> | null
}

export function AssetFilters({ table }: AssetFiltersProps) {
  const { modules, countries, languages, assetStatus, navigate, search } =
    useAssetUploader()

  const moduleOptions = modules.map((module) => ({
    value: module.moduleId.toString(),
    label: module.moduleName,
  }))
  const countryOptions = countries.map((country) => ({
    value: country.targetCountryCode,
    label: country.targetCountryName,
  }))
  const languageOptions = [...new Map(languages.map((language) => [language.languageCode, language])).values()].map((language) => ({
    value: language.languageCode,
    label: language.languageName,
  }))
  const assetStatusOptions = assetStatus.map((status) => ({
    value: Number(status.statusId),
    label: status.status,
  }))

  const [searchValue, setSearchValue] = useState(
    (search.mediaName as string) || ''
  )
  const [selectedModules, setSelectedModules] = useState<string[]>(
    typeof search.moduleIds === 'string' && search.moduleIds
      ? search.moduleIds.split(',').filter(Boolean)
      : []
  )
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    typeof search.targetCountrycodes === 'string' &&
      search.targetCountrycodes !== DEFAULT_PARAMS.targetCountrycodes
      ? search.targetCountrycodes.split(',').filter(Boolean)
      : []
  )
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    typeof search.languageCodes === 'string' &&
      search.languageCodes !== DEFAULT_PARAMS.languageCodes
      ? search.languageCodes.split(',').filter(Boolean)
      : []
  )
  const [selectedStatus, setSelectedStatus] = useState<number[]>(
    typeof search.status === 'number' && search.status !== DEFAULT_PARAMS.status
      ? [search.status]
      : []
  )

  const [localColumnVisibility, setLocalColumnVisibility] = useState<
    Record<string, boolean>
  >({})

  const handleSearch = () => {
    navigate({
      search: {
        ...search,
        mediaName: searchValue || DEFAULT_PARAMS.mediaName,
        moduleIds:
          selectedModules.length > 0 ? selectedModules.join(',') : DEFAULT_PARAMS.moduleIds,
        targetCountrycodes:
          selectedCountries.length > 0 ? selectedCountries.join(',') : DEFAULT_PARAMS.targetCountrycodes,
        languageCodes:
          selectedLanguages.length > 0 ? selectedLanguages.join(',') : DEFAULT_PARAMS.languageCodes,
        status: selectedStatus.length === 1 ? selectedStatus[0] : DEFAULT_PARAMS.status,
        pageIndex: 1,
        pageSize: 10,
      },
    })
  }

  const handleReset = () => {
    setSearchValue('')
    setSelectedModules([])
    setSelectedCountries([])
    setSelectedLanguages([])
    setSelectedStatus([])
  }

  const isFiltered =
    searchValue ||
    selectedModules.length > 0 ||
    selectedCountries.length > 0 ||
    selectedLanguages.length > 0 ||
    selectedStatus.length > 0

  return (
    <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
      <div className='relative w-full sm:max-w-md sm:flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder='Search by file name...'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          className='h-9 pl-9'
        />
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <MultiSelectFilter
          title='Module'
          options={moduleOptions}
          selectedValues={selectedModules}
          onValuesChange={setSelectedModules}
          searchPlaceholder='Search module...'
        />

        <MultiSelectFilter
          title='Country'
          options={countryOptions}
          selectedValues={selectedCountries}
          onValuesChange={setSelectedCountries}
          searchPlaceholder='Search country...'
        />

        <MultiSelectFilter
          title='Language'
          options={languageOptions}
          selectedValues={selectedLanguages}
          onValuesChange={setSelectedLanguages}
          searchPlaceholder='Search language...'
        />

        <MultiSelectFilter
          title='Status'
          options={assetStatusOptions}
          selectedValues={selectedStatus}
          onValuesChange={setSelectedStatus}
          searchPlaceholder='Search status...'
        />

        <Button
          variant='default'
          size='sm'
          onClick={handleSearch}
          className='h-9 flex-1 sm:flex-initial'
        >
          <Search className='mr-2 h-4 w-4' />
          Search
        </Button>

        {isFiltered && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleReset}
            className='h-9 flex-1 gap-2 sm:flex-initial'
          >
            Reset
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>

      {table && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='ml-auto h-9'
              title='Toggle columns'
            >
              <Settings2 className='h-4 w-4 sm:mr-2' />
              <span className='hidden sm:inline'>View</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[200px]'>
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const columnId = column.id
                const displayName = COLUMN_DISPLAY_NAMES[columnId] || columnId
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
  )
}
