import { type Table } from '@tanstack/react-table'
import { Play, Square, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import type { AssetDetail } from '../../data/schema'

interface AssetBulkActionsProps {
  table: Table<AssetDetail>
  onDeleteClick: () => void
  onStatusChangeClick: (statusId: number) => void
}

export function AssetBulkActions({
  table,
  onDeleteClick,
  onStatusChangeClick,
}: AssetBulkActionsProps) {
  const { t } = useTranslation('asset-uploader')
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const { activeCount, inactiveCount } = (() => {
    const activeCount = selectedRows.filter(
      (row) => row.original.statusId !== 1
    ).length
    const inactiveCount = selectedRows.filter(
      (row) => row.original.statusId !== 2
    ).length
    return { activeCount, inactiveCount }
  })()

  const handleStatusChange = (statusId: number) => {
    onStatusChangeClick(statusId)
  }

  return (
    <BulkActionsToolbar
      table={table}
      entityName={`asset${selectedRows.length > 1 ? 's' : ''}`}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            disabled={activeCount === 0}
            onClick={() => handleStatusChange(1)}
            className='size-8'
            aria-label={`${t('bulkActions.changeToActive')}: ${activeCount} assets`}
            title={`${t('bulkActions.changeToActive')}: ${activeCount} assets`}
          >
            <Play />
            <span className='sr-only'>{t('bulkActions.changeToActive')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {t('bulkActions.changeToActive')}: {activeCount} assets
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            disabled={inactiveCount === 0}
            onClick={() => handleStatusChange(2)}
            className='size-8'
            aria-label={`${t('bulkActions.changeToInactive')}: ${inactiveCount} assets`}
            title={`${t('bulkActions.changeToInactive')}: ${inactiveCount} assets`}
          >
            <Square />
            <span className='sr-only'>{t('bulkActions.changeToInactive')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {t('bulkActions.changeToInactive')}: {inactiveCount} assets
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='destructive'
            size='icon'
            onClick={onDeleteClick}
            className='size-8'
            aria-label={t('bulkActions.deleteSelected')}
            title={t('bulkActions.deleteSelected')}
          >
            <Trash2 />
            <span className='sr-only'>{t('bulkActions.deleteSelected')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('bulkActions.deleteSelected')}</p>
        </TooltipContent>
      </Tooltip>
    </BulkActionsToolbar>
  )
}
