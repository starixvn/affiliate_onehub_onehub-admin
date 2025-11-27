import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter, DataTableViewOptions } from '@/components/data-table'
import { DateRangeFilter } from '@/components/date-range-filter'
import { type Table } from '@tanstack/react-table'
import { useLinkFilters } from './link-filters'

interface LinkTableToolbarProps {
  table: Table<any>
  searchValue: string
  onSearchChange: (value: string) => void
  dateRange: { from: Date | undefined; to: Date | undefined }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  onSubmit: (e: React.FormEvent) => void
  onReset: () => void
  hasChangedFilters: boolean
}

export function LinkTableToolbar({
  table,
  searchValue,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onSubmit,
  onReset,
  hasChangedFilters,
}: LinkTableToolbarProps) {
  const { t } = useTranslation('link-management')
  const filters = useLinkFilters()

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(e) }} className='flex flex-wrap items-center gap-2'>
          <div className='relative'>
            <Input
              placeholder={t('table.search')}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className='h-8 w-[150px] pe-8 lg:w-[250px] w-[250px] lg:w-[350px]'
            />
            {searchValue.length > 0 && (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => onSearchChange('')}
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
            onSelect={onDateRangeChange}
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
              onClick={onReset}
            >
              {t('common:dataTable.reset') || 'Reset'}
            </Button>
          )}
        </form>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
