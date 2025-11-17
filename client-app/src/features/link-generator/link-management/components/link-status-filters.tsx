import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface LinkStatusFiltersProps {
    selectedStatus: string
    onStatusChange?: (status: string) => void
}

export function LinkStatusFilters({
    selectedStatus,
    onStatusChange,
}: LinkStatusFiltersProps) {
    const { t } = useTranslation('link-management')

    const statuses = [
        { value: '0,1', label: t('filters.all') },
        { value: '1', label: t('filters.active') },
        { value: '0', label: t('filters.inactive') },
    ]

    return (
        <div className='flex flex-wrap gap-2'>
            {statuses.map((status) => (
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

