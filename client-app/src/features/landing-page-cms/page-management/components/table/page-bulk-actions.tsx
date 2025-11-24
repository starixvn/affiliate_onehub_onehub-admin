import { useMemo } from 'react'
import { type Table } from '@tanstack/react-table'
import { Play, Ban, FileText, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type LandingPage } from '../../data/schema'
import { useLandingPages } from '../page-provider'

type PageBulkActionsProps = {
  table: Table<LandingPage>
  onDeleteClick: () => void
}

export function PageBulkActions({
  table,
  onDeleteClick,
}: PageBulkActionsProps) {
  const { t } = useTranslation('page-management')
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const { setPendingBulkStatusChange, setOpen } = useLandingPages()

  const { activeCount, inactiveCount, draftCount } = useMemo(() => {
    return {
      activeCount: selectedRows.filter((row) => row.original.statusId !== 1)
        .length,
      inactiveCount: selectedRows.filter((row) => row.original.statusId !== 2)
        .length,
      draftCount: selectedRows.filter((row) => row.original.statusId !== 0)
        .length,
    }
  }, [selectedRows])

  const handleStatusChange = (status: number, statusKey: string) => {
    const affectedPages = selectedRows.filter(
      (row) => row.original.statusId !== status
    )

    if (affectedPages.length === 0) {
      toast.error(t('bulkActionsToast.alreadyStatus', { status: statusKey }))
      return
    }

    const pageIds = affectedPages.map((row) => row.original.pageId).join(',')

    setPendingBulkStatusChange({
      pageIds,
      statusId: status,
      affectedCount: affectedPages.length,
      onSuccess: () => table.resetRowSelection(),
    })
    setOpen('bulkStatusChange')
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
            onClick={() => handleStatusChange(2, t('statusFilters.inactive'))}
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
            variant='outline'
            size='icon'
            disabled={draftCount === 0}
            onClick={() => handleStatusChange(0, t('statusFilters.draft'))}
            className='size-8'
            aria-label={t('bulkActions.changeToDraftCount', {
              count: draftCount,
            })}
            title={t('bulkActions.changeToDraftCount', { count: draftCount })}
          >
            <FileText />
            <span className='sr-only'>{t('bulkActions.changeToDraft')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('bulkActions.changeToDraftCount', { count: draftCount })}</p>
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
