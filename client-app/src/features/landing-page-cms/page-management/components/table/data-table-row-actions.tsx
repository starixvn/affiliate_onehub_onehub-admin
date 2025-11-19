import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Pencil, Copy, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getRouteApi } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type LandingPage } from '../../data/schema'
import { useLandingPages } from '../page-provider'
import { savePageManagementFilters } from '../../utils/filter-storage'

const route = getRouteApi('/iframe/landing-page-cms/page-management/')

type DataTableRowActionsProps = {
  row: Row<LandingPage>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { t } = useTranslation('page-management')
  const { setOpen, setCurrentRow } = useLandingPages()
  const search = route.useSearch()

  const handleEdit = () => {
    savePageManagementFilters(search)
    if (window.parent) {
      window.parent.location.href = `/landing-page-cms/page-builder?mode=edit&pageId=${row.original.pageId}`
    }
  }

  const handleDuplicate = () => {
    savePageManagementFilters(search)
    if (window.parent) {
      window.parent.location.href = `/landing-page-cms/page-builder?mode=duplicate&pageId=${row.original.pageId}`
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>{t('table.columns.actions')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleEdit}>
          {t('rowActions.edit')}
          <DropdownMenuShortcut>
            <Pencil size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          {t('rowActions.duplicate')}
          <DropdownMenuShortcut>
            <Copy size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('delete')
          }}
          className='text-red-500!'
        >
          {t('rowActions.delete')}
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

