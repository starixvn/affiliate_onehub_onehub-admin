import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { type Component } from '../../data/schema'
import { useComponents } from '../component-provider'

type DataTableRowActionsProps = {
  row: Row<Component>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { t } = useTranslation(['component-management', 'common'])
  const { setOpen, setCurrentRow } = useComponents()
  return (
    <DropdownMenu modal={false}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
            >
              <DotsHorizontalIcon className='h-4 w-4' />
              <span className='sr-only'>
                {t('dataTable.rowActions.moreAction', { ns: 'common' })}
              </span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('dataTable.rowActions.moreAction', { ns: 'common' })}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('update')
          }}
        >
          {t('dataTable.rowActions.edit', { ns: 'common' })}
          <DropdownMenuShortcut>
            <Pencil size={16} />
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
          {t('dataTable.rowActions.delete', { ns: 'common' })}
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
