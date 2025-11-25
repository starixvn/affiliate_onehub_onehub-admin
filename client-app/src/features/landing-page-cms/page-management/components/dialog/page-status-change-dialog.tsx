'use client'

import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useUpdateBatchLandingPageStatus } from '../../api/commands'
import { statuses } from '../../data/data'
import { type LandingPage } from '../../data/schema'

type PageStatusChangeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: LandingPage
  newStatusId: number
}

export function PageStatusChangeDialog({
  open,
  onOpenChange,
  currentRow,
  newStatusId,
}: PageStatusChangeDialogProps) {
  const { t } = useTranslation('page-management')
  const updateBatchStatusMutation = useUpdateBatchLandingPageStatus()

  const currentStatus = statuses.find(
    (s) => s.value === String(currentRow.statusId)
  )
  const newStatus = statuses.find((s) => s.value === String(newStatusId))

  const handleConfirm = () => {
    updateBatchStatusMutation.mutate(
      {
        pageIds: String(currentRow.pageId),
        statusId: newStatusId,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
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
          {t('dialog.statusChange.title')}
        </span>
      }
      desc={
        <div className='space-y-2'>
          <p>
            {t('dialog.statusChange.message')}{' '}
            <span className='font-bold'>{currentRow.lpName}</span>?
          </p>
          <p className='text-sm'>
            {t('dialog.statusChange.from')}{' '}
            <span className='font-semibold'>{currentStatus?.label}</span> →{' '}
            <span className='font-semibold'>{newStatus?.label}</span>
          </p>
        </div>
      }
      confirmText={t('dialog.statusChange.confirm')}
      cancelBtnText={t('dialog.statusChange.cancel')}
    />
  )
}
