import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { statuses } from '@/features/link-generator/link-management/data/link'

interface LinkStatusFiltersProps {
  selectedStatus: string
  onStatusChange?: (status: string) => void
}

export function LinkStatusFilters({
  selectedStatus,
  onStatusChange,
}: LinkStatusFiltersProps) {
  const { t } = useTranslation('link-management')

  const statusFilters = [
    { value: '0,1', label: t('filters.all') },
    ...statuses.map((s) => ({ value: s.value, label: s.label })),
  ]

  return (
    <div className='flex flex-wrap gap-2'>
      {statusFilters.map((status) => (
        <Badge
          key={status.value}
          variant={selectedStatus === status.value ? 'default' : 'outline'}
          className={cn(
            'cursor-pointer',
            selectedStatus === status.value && 'bg-primary text-primary-foreground'
          )}
          onClick={() => onStatusChange?.(status.value)}
        >
          {status.label}
        </Badge>
      ))}
    </div>
  )
}

