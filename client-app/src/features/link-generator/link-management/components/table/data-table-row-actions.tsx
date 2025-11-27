import { type Row } from '@tanstack/react-table'
import { CopyPlus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTranslation } from 'react-i18next'
import { type LinkInfo } from '../../data/schema'

interface DataTableRowActionsProps {
    row: Row<LinkInfo>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { t } = useTranslation('link-management')
    const navigate = useNavigate()

    const handleDuplicate = () => {
        navigate({
            to: '/iframe/link-generator/generate-link',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state: { duplicateLink: row.original } as any,
        })
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={handleDuplicate}
                    >
                        <CopyPlus className='h-4 w-4' />
                        <span className='sr-only'>{t('table.actions.duplicate')}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('table.actions.duplicate')}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

