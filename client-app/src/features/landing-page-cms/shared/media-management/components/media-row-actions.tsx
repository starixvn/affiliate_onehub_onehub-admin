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
import type { MediaDetail } from '../schema'

interface MediaRowActionsProps {
  row: Row<MediaDetail>
  translationKey: string
  onEdit: (row: MediaDetail) => void
  onDelete: (row: MediaDetail) => void
}

export function MediaRowActions({
  row,
  translationKey,
  onEdit,
  onDelete,
}: MediaRowActionsProps) {
  const { t } = useTranslation(translationKey)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>{t('table.action')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            onEdit(row.original)
          }}
        >
          {t('buttons.edit')}
          <DropdownMenuShortcut>
            <Pencil size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (!row.original.isMediaIdInUse) {
              onDelete(row.original)
            }
          }}
          disabled={row.original.isMediaIdInUse}
          className='text-red-500!'
        >
          {t('buttons.delete')}
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
