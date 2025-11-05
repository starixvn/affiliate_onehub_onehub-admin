import { useMemo } from 'react'
import { type Table } from '@tanstack/react-table'
import { Play, Ban, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Component } from '../../data/schema'

type ComponentBulkActionsProps = {
  table: Table<Component>
  onDeleteClick: () => void
}

export function ComponentBulkActions({
  table,
  onDeleteClick,
}: ComponentBulkActionsProps) {
  const { t } = useTranslation('component-management')
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const { activeCount, inactiveCount } = useMemo(() => {
    return {
      activeCount: selectedRows.filter((row) => row.original.statusId !== 1)
        .length,
      inactiveCount: selectedRows.filter((row) => row.original.statusId !== 0)
        .length,
    }
  }, [selectedRows])

  const handleStatusChange = (status: number, statusKey: string) => {
    const affectedComponents = selectedRows.filter(
      (row) => row.original.statusId !== status
    )

    if (affectedComponents.length === 0) {
      toast.error(t('bulkActionsToast.alreadyStatus', { status: statusKey }))
      return
    }

    toast.success(
      t('bulkActionsToast.statusChanged', {
        count: affectedComponents.length,
        status: statusKey,
      })
    )
    table.resetRowSelection()
  }

  return (
    <BulkActionsToolbar
      table={table}
      entityName={t('entity', { count: selectedRows.length })}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            disabled={activeCount === 0}
            onClick={() => handleStatusChange(1, t('statusFilters.active'))}
            className='size-8'
            aria-label={t('bulkActions.changeToActiveCount', {
              count: activeCount,
            })}
            title={t('bulkActions.changeToActiveCount', { count: activeCount })}
          >
            <Play />
            <span className='sr-only'>{t('bulkActions.changeToActive')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('bulkActions.changeToActiveCount', { count: activeCount })}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            disabled={inactiveCount === 0}
            onClick={() => handleStatusChange(0, t('statusFilters.inactive'))}
            className='size-8'
            aria-label={t('bulkActions.changeToInactiveCount', {
              count: inactiveCount,
            })}
            title={t('bulkActions.changeToInactiveCount', {
              count: inactiveCount,
            })}
          >
            <Ban />
            <span className='sr-only'>{t('bulkActions.changeToInactive')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {t('bulkActions.changeToInactiveCount', { count: inactiveCount })}
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
