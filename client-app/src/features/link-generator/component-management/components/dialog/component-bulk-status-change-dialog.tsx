'use client'

import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useUpdateBatchComponentStatus } from '../../api/commands'
import { status } from '../../data/data'

type ComponentBulkStatusChangeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  componentIds: string
  newStatusId: number
  affectedCount: number
  onSuccess?: () => void
}

export function ComponentBulkStatusChangeDialog({
  open,
  onOpenChange,
  componentIds,
  newStatusId,
  affectedCount,
  onSuccess,
}: ComponentBulkStatusChangeDialogProps) {
  const { t } = useTranslation('component-management')
  const updateBatchStatusMutation = useUpdateBatchComponentStatus()

  const newStatus = status.find((s) => s.value === String(newStatusId))

  const handleConfirm = () => {
    updateBatchStatusMutation.mutate(
      {
        componentIds,
        statusId: newStatusId,
      },
      {
        onSuccess: (response) => {
          if (response.errorCode === 0) {
            onOpenChange(false)
            onSuccess?.()
          }
        },
      },
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
