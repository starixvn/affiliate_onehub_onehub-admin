import { useState } from 'react'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { type Table } from '@tanstack/react-table'
import { Search, X, Settings2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
import { DEFAULT_PARAMS } from '../data/constants'
import type { AssetDetail } from '../data/schema'
import { useAssetUploader } from './asset-uploader-provider'

interface AssetFiltersProps {
  table?: Table<AssetDetail> | null
}

export function AssetFilters({ table }: AssetFiltersProps) {
  const { t } = useTranslation('asset-uploader')
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
  const languageOptions = [
    ...new Map(
      languages.map((language) => [language.languageCode, language])
    ).values(),
  ].map((language) => ({
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
    typeof search.currentStatus === 'object' &&
      Array.isArray(search.currentStatus)
      ? (search.currentStatus as number[])
      : [...DEFAULT_PARAMS.currentStatus]
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
          selectedModules.length > 0
            ? selectedModules.join(',')
            : DEFAULT_PARAMS.moduleIds,
        targetCountrycodes:
          selectedCountries.length > 0
            ? selectedCountries.join(',')
            : DEFAULT_PARAMS.targetCountrycodes,
        languageCodes:
          selectedLanguages.length > 0
            ? selectedLanguages.join(',')
            : DEFAULT_PARAMS.languageCodes,
        status: selectedStatus.length === 1 ? selectedStatus[0] : -1,
        currentStatus: selectedStatus,
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
    setSelectedStatus([1])
  }

  const isFiltered =
    searchValue ||
    selectedModules.length > 0 ||
    selectedCountries.length > 0 ||
    selectedLanguages.length > 0 ||
    selectedStatus.length > 0

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='relative max-w-sm min-w-[200px] flex-1 sm:min-w-[240px] sm:flex-initial md:min-w-[280px]'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder={t('filters.searchPlaceholder')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            className='h-9 pl-9 pr-9'
          />
          {searchValue && (
            <button
              type='button'
              onClick={() => setSearchValue('')}
              className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>

        <MultiSelectFilter
          title={t('filters.module')}
          options={moduleOptions}
          selectedValues={selectedModules}
          onValuesChange={setSelectedModules}
          searchPlaceholder={t('filters.modulePlaceholder')}
        />

        <MultiSelectFilter
          title={t('filters.country')}
          options={countryOptions}
          selectedValues={selectedCountries}
          onValuesChange={setSelectedCountries}
          searchPlaceholder={t('filters.countryPlaceholder')}
        />

        <MultiSelectFilter
          title={t('filters.language')}
          options={languageOptions}
          selectedValues={selectedLanguages}
          onValuesChange={setSelectedLanguages}
          searchPlaceholder={t('filters.languagePlaceholder')}
        />

        <MultiSelectFilter
          title={t('filters.status')}
          options={assetStatusOptions}
          selectedValues={selectedStatus}
          onValuesChange={setSelectedStatus}
          searchPlaceholder={t('filters.statusPlaceholder')}
        />

        {isFiltered && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleReset}
            className='h-9 flex-1 gap-2 sm:flex-initial'
          >
            {t('filters.reset')}
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
          {t('filters.search')}
        </Button>

        {table && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='ml-auto h-9'
                title={t('filters.toggleColumns')}
              >
                <Settings2 className='h-4 w-4 sm:mr-2' />
                <span className='hidden sm:inline'>{t('filters.view')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[200px]'>
              <DropdownMenuLabel>
                {t('filters.toggleColumns')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columnId = column.id
                  const displayName = t(`table.${columnId}`)
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
