import { type Row } from '@tanstack/react-table'
import { MoreHorizontal, Eye, Copy } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'
import { type LinkInfo } from '../../data/schema'
import { useLinks } from '../link-provider'

interface DataTableRowActionsProps {
    row: Row<LinkInfo>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { t } = useTranslation('link-management')
    const { setOpen, setCurrentRow } = useLinks()
    const navigate = useNavigate()

    const handleViewDetails = () => {
        setCurrentRow(row.original)
        setOpen('detail')
    }

    const handleDuplicate = () => {
        navigate({
            to: '/link-generator/generate-link',
            state: { duplicateLink: row.original },
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                >
                    <MoreHorizontal className='h-4 w-4' />
                    <span className='sr-only'>{t('table.actions.openMenu')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
                <DropdownMenuItem onClick={handleViewDetails}>
                    <Eye className='mr-2 h-4 w-4' />
                    {t('table.actions.viewDetails')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className='mr-2 h-4 w-4' />
                    {t('table.actions.duplicate')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

