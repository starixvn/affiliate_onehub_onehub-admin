import { useState, useMemo } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table, type ColumnFiltersState } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchClassName?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
    defaultValue?: string | string[]
    hidden?: boolean
  }[]
  submitLabel?: string
  onSubmit: (searchValue: string) => void
  onReset?: () => void
  initialSearchValue?: string
  defaultSearchValue?: string
  columnFilters?: ColumnFiltersState
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchClassName,
  filters = [],
  submitLabel,
  onSubmit,
  onReset,
  initialSearchValue = '',
  defaultSearchValue,
  columnFilters,
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation('common')
  const [searchValue, setSearchValue] = useState(initialSearchValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(searchValue)
  }

  const handleClear = () => {
    setSearchValue('')
  }

  const handleReset = () => {
    setSearchValue(defaultSearchValue ?? '')
    filters.forEach((filter) => {
      const column = table.getColumn(filter.columnId)
      column?.setFilterValue(filter.defaultValue)
    })
    if (onReset) {
      onReset()
    }
  }

  const hasChangedFilters = useMemo(() => {
    const searchDiffers = searchValue !== (defaultSearchValue ?? '')

    const filterDiffers = filters.some((filter) => {
      if (filter.hidden) return false

      const column = table.getColumn(filter.columnId)
      const currentValue = column?.getFilterValue()
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

    return searchDiffers || filterDiffers
  }, [searchValue, defaultSearchValue, filters, table, columnFilters])

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <form onSubmit={handleSubmit} className='flex items-center gap-2'>
          <div className='relative'>
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={cn('h-8 w-[150px] pe-8 lg:w-[250px]', searchClassName)}
            />
            {searchValue.length > 0 && (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={handleClear}
                className='absolute end-1 top-1 h-6 w-6 rounded-full'
                aria-label={t('dataTable.clear')}
              >
                <Cross2Icon className='h-3 w-3' />
              </Button>
            )}
          </div>
          {filters.map((filter) => {
            if (filter.hidden) return null
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
          <Button type='submit' size='sm' className='h-8'>
            <Search className='me-2 h-4 w-4' />
            {submitLabel ?? t('dataTable.submit')}
          </Button>
          {hasChangedFilters && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-8'
              onClick={handleReset}
            >
              {t('dataTable.reset') || 'Reset'}
            </Button>
          )}
        </form>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
