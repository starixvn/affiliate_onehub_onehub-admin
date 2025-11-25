'use client'

import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useUpdateBatchLandingPageStatus } from '../../api/commands'
import { statuses } from '../../data/data'

type PageBulkStatusChangeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pageIds: string
  newStatusId: number
  affectedCount: number
  onSuccess?: () => void
}

export function PageBulkStatusChangeDialog({
  open,
  onOpenChange,
  pageIds,
  newStatusId,
  affectedCount,
  onSuccess,
}: PageBulkStatusChangeDialogProps) {
  const { t } = useTranslation('page-management')
  const updateBatchStatusMutation = useUpdateBatchLandingPageStatus()

  const newStatus = statuses.find((s) => s.value === String(newStatusId))

  const handleConfirm = () => {
    updateBatchStatusMutation.mutate(
      {
        pageIds,
        statusId: newStatusId,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          onSuccess?.()
        },
      }
    )
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      disabled={updateBatchStatusMutation.isPending}
      title={
        <span>
          <Info className='me-1 inline-block' size={18} />
          {t('dialog.bulkStatusChange.title')}
        </span>
      }
      desc={
        <div className='space-y-2'>
          <p>
            {t('dialog.bulkStatusChange.message', { count: affectedCount })}{' '}
            <span className='font-semibold'>{newStatus?.label}</span>?
          </p>
        </div>
      }
      confirmText={t('dialog.bulkStatusChange.confirm')}
      cancelBtnText={t('dialog.bulkStatusChange.cancel')}
    />
  )
}
