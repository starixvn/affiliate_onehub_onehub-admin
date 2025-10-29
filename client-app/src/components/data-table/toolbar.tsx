import { useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
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
  }[]
  submitLabel?: string
  onSubmit: (searchValue: string) => void
  initialSearchValue?: string
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchClassName,
  filters = [],
  submitLabel,
  onSubmit,
  initialSearchValue = '',
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
          <Button type='submit' size='sm' className='h-8'>
            <Search className='me-2 h-4 w-4' />
            {submitLabel ?? t('dataTable.submit')}
          </Button>
        </form>
        <div className='flex gap-x-2'>
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
        </div>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
