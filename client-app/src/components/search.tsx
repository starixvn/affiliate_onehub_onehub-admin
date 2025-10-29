import { SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useSearch } from '@/context/search-provider'
import { Button } from './ui/button'

type SearchProps = {
  className?: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  variant?: 'default' | 'sidebar'
}

export function Search({
  className = '',
  placeholder,
  variant = 'default',
}: SearchProps) {
  const { t } = useTranslation()
  const { setOpen } = useSearch()
  const displayPlaceholder = placeholder || t('common.search')

  return (
    <Button
      variant='outline'
      className={cn(
        'bg-muted/25 group text-muted-foreground hover:bg-accent relative h-10 justify-start rounded-md text-base font-normal shadow-none',
        variant === 'default' && 'w-full pe-12',
        variant === 'sidebar' && 'w-full pe-12',
        className
      )}
      onClick={() => setOpen(true)}
    >
      <SearchIcon
        aria-hidden='true'
        className='absolute start-2 top-1/2 -translate-y-1/2'
        size={18}
      />
      <span className='ms-6'>{displayPlaceholder}</span>
      <kbd className='bg-muted group-hover:bg-accent pointer-events-none absolute end-2 top-1/2 hidden h-6 -translate-y-1/2 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
        <span className='text-xs'>⌘</span>K
      </kbd>
    </Button>
  )
}
